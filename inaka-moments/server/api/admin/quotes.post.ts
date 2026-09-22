import { z } from 'zod'
import {
  buildCatalog,
  computeQuote,
  normalizeRules,
  type PricingPack,
  type PricingProduct,
  type SelectedLine,
} from '~~/shared/configurator'
import { addDaysISO } from '~~/shared/dates'
import { EVENT_TYPES } from '~~/shared/eventTypes'

/**
 * POST /api/admin/quotes — crea un presupuesto a mano (llamada, Instagram,
 * en persona). Mismo motor de precios que el configurador público
 * (`shared/configurator.ts`): nunca se aceptan importes del cliente, se
 * recalcula todo desde la BD. Nace en 'borrador'; pasa a 'enviado' al
 * enviarlo por email (POST /send) y se acepta con POST /accept.
 */

const lineSchema = z.object({
  kind: z.enum(['product', 'pack']),
  id: z.string().uuid(),
  qty: z.number().int().min(1).max(99).default(1),
  tier: z.string().max(120).nullish(),
  size: z.string().max(60).nullish(),
  options: z.array(z.string().max(60)).max(12).default([]),
})

const bodySchema = z.object({
  lead_id: z.string().uuid().nullish(),
  client_name: z.string().trim().min(2, 'Nombre demasiado corto').max(120),
  client_email: z.string().trim().email('Email no válido').max(200).or(z.literal('')).optional(),
  client_phone: z.string().trim().max(30).optional(),
  event_type: z.enum(EVENT_TYPES).nullish(),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal('')).optional(),
  location: z.string().trim().max(300).optional(),
  far: z.boolean().default(false),
  desmontaje: z.boolean().default(false),
  notes: z.string().max(2000).optional(),
  lines: z.array(lineSchema).min(1, 'Añade al menos un producto o pack').max(40),
})

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data
  const supabase = useSupabaseAdmin(event)

  const productIds = [...new Set(body.lines.filter(l => l.kind === 'product').map(l => l.id))]
  const packIds = [...new Set(body.lines.filter(l => l.kind === 'pack').map(l => l.id))]

  const [{ data: products, error: prodErr }, { data: packs, error: packErr }, { data: settingsRow }, geo] = await Promise.all([
    productIds.length
      ? supabase.from('products').select('id, name, slug, category, base_price, price_is_from, pricing, sizes, options, is_rental, deposit').in('id', productIds)
      : Promise.resolve({ data: [], error: null }),
    packIds.length
      ? supabase.from('packs').select('id, name, slug, price').in('id', packIds)
      : Promise.resolve({ data: [], error: null }),
    supabase.from('site_content').select('data').eq('section', 'settings').maybeSingle(),
    body.location ? distanceFromAbreraKm(body.location) : Promise.resolve(null),
  ])

  if (prodErr || packErr) {
    console.error('[admin/quotes] error leyendo catálogo:', prodErr ?? packErr)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido calcular el presupuesto.' })
  }

  const rules = normalizeRules(settingsRow?.data as Record<string, unknown> | null)
  const catalog = buildCatalog((products ?? []) as PricingProduct[], (packs ?? []) as PricingPack[])
  const distanceKm = geo?.distanceKm ?? null
  const selection: SelectedLine[] = body.lines.map(l => ({
    kind: l.kind,
    id: l.id,
    qty: l.qty,
    tier: l.tier ?? null,
    size: l.size ?? null,
    options: l.options,
  }))

  const computed = computeQuote(selection, { desmontaje: body.desmontaje, far: body.far, distanceKm }, rules, catalog)
  if (computed.lines.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Los productos seleccionados ya no existen.' })
  }

  const { data: quote, error: quoteErr } = await supabase
    .from('quotes')
    .insert({
      lead_id: body.lead_id ?? null,
      client_name: body.client_name,
      client_email: body.client_email || null,
      client_phone: body.client_phone || null,
      event_type: body.event_type ?? null,
      event_date: body.event_date || null,
      location: body.location || null,
      distance_km: distanceKm,
      status: 'borrador',
      subtotal: computed.itemsSubtotal,
      adjustments: computed.adjustments,
      total: computed.total,
      deposit_amount: null,
      valid_until: addDaysISO(30),
      notes: body.notes || null,
    })
    .select('id')
    .single()

  if (quoteErr || !quote) {
    console.error('[admin/quotes] error insertando presupuesto:', quoteErr)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido crear el presupuesto.' })
  }

  const { error: itemsErr } = await supabase.from('quote_items').insert(
    computed.lines.map(l => ({
      quote_id: quote.id,
      product_id: l.kind === 'product' ? l.id : null,
      pack_id: l.kind === 'pack' ? l.id : null,
      label: l.label,
      qty: l.qty,
      unit_price: l.unit_price,
      line_total: l.line_total,
      options: { tier: l.tier, size: l.size, options: l.options },
    })),
  )

  if (itemsErr) {
    console.error('[admin/quotes] error insertando líneas:', itemsErr)
    // Evita dejar un presupuesto vacío.
    await supabase.from('quotes').delete().eq('id', quote.id)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido guardar el detalle del presupuesto.' })
  }

  return { id: quote.id, total: computed.total, hasConsulta: computed.hasConsulta }
})
