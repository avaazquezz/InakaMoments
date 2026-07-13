import { z } from 'zod'
import { buildCatalog, computeQuote, normalizeRules, round2, type Adjustment, type PricingPack, type PricingProduct, type SelectedLine } from '~~/shared/configurator'

/**
 * PATCH /api/admin/quotes/[id]/items — reemplaza las líneas del presupuesto
 * y recalcula subtotal/ajustes/total con el MISMO motor puro que usa el
 * configurador público (`shared/configurator.ts`) — nunca se confía en
 * precios que pudieran llegar del cliente admin, se recalculan desde la BD.
 *
 * Los ajustes 'desmontaje'/'gasolina' los gestiona el motor; cualquier otro
 * ajuste manual (p. ej. un descuento) que ya existiera en el presupuesto se
 * conserva tal cual, para no perder ediciones manuales al tocar las líneas.
 */

const lineSchema = z.object({
  kind: z.enum(['product', 'pack']),
  id: z.string().uuid(),
  qty: z.number().int().min(1).max(99),
  tier: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  options: z.array(z.string().max(60)).max(12).default([]),
})

const bodySchema = z.object({
  lines: z.array(lineSchema).min(1, 'El presupuesto necesita al menos una línea'),
  desmontaje: z.boolean().default(false),
  far: z.boolean().default(false),
  distanceKm: z.number().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const quoteId = getRouterParam(event, 'id')
  if (!quoteId) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data
  const supabase = useSupabaseAdmin(event)

  const productIds = [...new Set(body.lines.filter(l => l.kind === 'product').map(l => l.id))]
  const packIds = [...new Set(body.lines.filter(l => l.kind === 'pack').map(l => l.id))]

  const [{ data: products, error: prodErr }, { data: packs, error: packErr }, { data: settingsRow }, { data: currentQuote }] = await Promise.all([
    productIds.length
      ? supabase.from('products').select('id, name, slug, category, base_price, price_is_from, pricing, sizes, options, is_rental, deposit').in('id', productIds)
      : Promise.resolve({ data: [], error: null }),
    packIds.length
      ? supabase.from('packs').select('id, name, slug, price').in('id', packIds)
      : Promise.resolve({ data: [], error: null }),
    supabase.from('site_content').select('data').eq('section', 'settings').maybeSingle(),
    supabase.from('quotes').select('adjustments').eq('id', quoteId).maybeSingle(),
  ])

  if (prodErr || packErr) {
    console.error('[admin/quotes] error leyendo catálogo:', prodErr ?? packErr)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido recalcular el presupuesto.' })
  }

  const rules = normalizeRules(settingsRow?.data as Record<string, unknown> | null)
  const catalog = buildCatalog((products ?? []) as PricingProduct[], (packs ?? []) as PricingPack[])
  const selection: SelectedLine[] = body.lines.map(l => ({ kind: l.kind, id: l.id, qty: l.qty, tier: l.tier ?? null, size: l.size ?? null, options: l.options }))

  const computed = computeQuote(selection, { desmontaje: body.desmontaje, far: body.far, distanceKm: body.distanceKm ?? undefined }, rules, catalog)

  if (computed.lines.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Los productos seleccionados ya no están disponibles.' })
  }

  // Conserva ajustes manuales (cualquiera que no sea 'desmontaje'/'gasolina', gestionados por el motor).
  const manualAdjustments: Adjustment[] = ((currentQuote?.adjustments as Adjustment[] | null) ?? [])
    .filter(a => a.key !== 'desmontaje' && a.key !== 'gasolina')
  const adjustments = [...computed.adjustments, ...manualAdjustments]
  const manualNumeric = manualAdjustments.reduce((s, a) => s + (a.amount ?? 0), 0)
  const total = round2(computed.total + manualNumeric)

  const { error: delErr } = await supabase.from('quote_items').delete().eq('quote_id', quoteId)
  if (delErr) {
    console.error('[admin/quotes] error borrando líneas previas:', delErr)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido actualizar el presupuesto.' })
  }

  const itemsPayload = computed.lines.map(l => ({
    quote_id: quoteId,
    product_id: l.kind === 'product' ? l.id : null,
    pack_id: l.kind === 'pack' ? l.id : null,
    label: l.label,
    qty: l.qty,
    unit_price: l.unit_price,
    line_total: l.line_total,
    options: { tier: l.tier, size: l.size, options: l.options },
  }))
  const { error: insErr } = await supabase.from('quote_items').insert(itemsPayload)
  if (insErr) {
    console.error('[admin/quotes] error insertando líneas:', insErr)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido guardar el detalle del presupuesto.' })
  }

  const { error: updErr } = await supabase.from('quotes').update({
    subtotal: computed.itemsSubtotal,
    adjustments,
    total,
  }).eq('id', quoteId)
  if (updErr) {
    console.error('[admin/quotes] error actualizando totales:', updErr)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido guardar el presupuesto.' })
  }

  return { ok: true, subtotal: computed.itemsSubtotal, adjustments, total }
})
