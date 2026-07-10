import { z } from 'zod'
import {
  buildCatalog,
  computeQuote,
  normalizeRules,
  type ConfiguratorRules,
  type PricingPack,
  type PricingProduct,
  type SelectedLine,
} from '~~/shared/configurator'
import { addDaysISO } from '~~/shared/dates'

/**
 * POST /api/quotes — envío del CONFIGURADOR de presupuesto (Fase 3).
 *
 * Defensas:
 *   1. Rate-limit por IP (5 / 10 min)
 *   2. Validación estricta con zod (consentimiento RGPD obligatorio)
 *   3. Honeypot ("website") → 200 silencioso
 *   4. Cloudflare Turnstile server-side
 * Después, con service_role (RLS bloquea todo lo demás):
 *   5. Recalcula precios DESDE LA BD (nunca confía en el cliente)
 *   6. Inserta lead + quote(status='enviado') + quote_items (atómico best-effort)
 *   7. Avisa a la dueña y confirma al cliente por email
 * Devuelve el resumen AUTORITATIVO (el cliente muestra estos números).
 */

const EVENT_TYPES = [
  'cumpleanos', 'comunion', 'bautizo', 'baby_shower', 'graduacion',
  'despedida', 'jubilacion', 'corporativo', 'boda', 'otro',
] as const

const EVENT_TYPE_LABELS: Record<string, string> = {
  cumpleanos: 'Cumpleaños', baby_shower: 'Baby Shower', bautizo: 'Bautizo',
  comunion: 'Comunión', graduacion: 'Graduación', despedida: 'Despedida',
  jubilacion: 'Jubilación', corporativo: 'Corporativo', boda: 'Boda', otro: 'Otro',
}

const lineSchema = z.object({
  kind: z.enum(['product', 'pack']),
  id: z.string().uuid('Identificador de producto no válido'),
  qty: z.number().int().min(1).max(99).default(1),
  tier: z.string().max(120).nullish(),
  size: z.string().max(60).nullish(),
  options: z.array(z.string().max(60)).max(12).default([]),
})

const quoteSchema = z.object({
  event_type: z.enum(EVENT_TYPES, { message: 'Ocasión no válida' }),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  far: z.boolean().default(false),
  location: z.string().trim().max(300).optional().or(z.literal('')),
  invitados: z.string().max(40).optional().or(z.literal('')),
  desmontaje: z.boolean().default(false),
  lines: z.array(lineSchema).min(1, 'Añade al menos un producto a tu presupuesto').max(40),
  nombre: z.string().trim().min(2, 'Nombre demasiado corto').max(120),
  email: z.string().trim().email('Email no válido').max(200),
  telefono: z.string().trim().min(7).max(30).optional().or(z.literal('')),
  mensaje: z.string().max(2000).optional().or(z.literal('')),
  consent: z.literal(true, { message: 'Debes aceptar la política de privacidad' }),
  website: z.string().optional().default(''), // honeypot
  turnstileToken: z.string().min(1, 'Verificación anti-spam requerida'),
  source: z.string().max(60).default('configurador'),
  utm: z.record(z.string(), z.string().max(200)).default({}),
})

export default defineEventHandler(async (event) => {
  // 1 ─ Rate limit por IP
  assertRateLimit(event, 'quotes', { max: 5, windowMs: 10 * 60 * 1000 })

  // 2 ─ Validación
  const parsed = quoteSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: parsed.error.issues[0]?.message ?? 'Datos no válidos',
    })
  }
  const body = parsed.data

  // 3 ─ Honeypot: los bots lo rellenan; éxito silencioso sin persistir
  if (body.website !== '') {
    return { ok: true, notified: true, quote: null }
  }

  // 4 ─ Turnstile (verificación server-side del token)
  const turnstile = await verifyTurnstileToken(body.turnstileToken, event)
  if (!turnstile.success) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'No hemos podido verificar que eres humano. Recarga la página e inténtalo de nuevo.',
    })
  }

  const supabase = useSupabaseAdmin(event)

  // 5 ─ Recalcular precios desde la BD (fuente de verdad) ────────────────────
  const productIds = [...new Set(body.lines.filter(l => l.kind === 'product').map(l => l.id))]
  const packIds = [...new Set(body.lines.filter(l => l.kind === 'pack').map(l => l.id))]

  const [{ data: products, error: prodErr }, { data: packs, error: packErr }, { data: settingsRow }, geo] =
    await Promise.all([
      productIds.length
        ? supabase.from('products')
            .select('id, name, slug, category, base_price, price_is_from, pricing, sizes, options, is_rental, deposit')
            .in('id', productIds).eq('active', true)
        : Promise.resolve({ data: [], error: null }),
      packIds.length
        ? supabase.from('packs')
            .select('id, name, slug, price')
            .in('id', packIds).eq('active', true)
        : Promise.resolve({ data: [], error: null }),
      supabase.from('site_content').select('data').eq('section', 'settings').maybeSingle(),
      body.location ? distanceFromAbreraKm(body.location) : Promise.resolve(null),
    ])

  if (prodErr || packErr) {
    console.error('[quotes] error leyendo catálogo:', prodErr ?? packErr)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No hemos podido calcular tu presupuesto. Inténtalo de nuevo.' })
  }

  const rules: ConfiguratorRules = normalizeRules(settingsRow?.data as Record<string, unknown> | null)
  const catalog = buildCatalog(
    (products ?? []) as PricingProduct[],
    (packs ?? []) as PricingPack[],
  )

  // La distancia geocodificada por el propio servidor es autoritativa; nunca
  // se confía en un distance_km enviado por el cliente (ni siquiera se acepta).
  const distanceKm = geo?.distanceKm ?? null

  const selection: SelectedLine[] = body.lines.map(l => ({
    kind: l.kind,
    id: l.id,
    qty: l.qty,
    tier: l.tier ?? null,
    size: l.size ?? null,
    options: l.options,
  }))

  const computed = computeQuote(
    selection,
    { desmontaje: body.desmontaje, far: body.far, distanceKm },
    rules,
    catalog,
  )

  // Si ninguna línea resolvió (todos los ids inexistentes/inactivos) → 400
  if (computed.lines.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Los productos seleccionados ya no están disponibles. Revisa tu selección.',
    })
  }

  const eventTypeLabel = EVENT_TYPE_LABELS[body.event_type] ?? body.event_type
  const eventDate = body.event_date || null

  // Una solicitud nueva debe respetar la antelación mínima real configurada
  // (el cliente ya limita el calendario a estas fechas; esto blinda envíos
  // manipulados directamente contra la API).
  const minAllowedDate = addDaysISO(rules.antelacion_dias)
  if (eventDate && eventDate < minAllowedDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: `La fecha del evento debe tener al menos ${rules.antelacion_dias} días de antelación.`,
    })
  }

  // 6 ─ Persistencia: lead → quote → quote_items ────────────────────────────
  const { data: lead, error: leadErr } = await supabase
    .from('leads')
    .insert({
      nombre: body.nombre,
      email: body.email,
      telefono: body.telefono || null,
      tipo: body.event_type,
      fecha: eventDate,
      invitados: body.invitados || null,
      ideas_extra: body.mensaje || null,
      status: 'presupuestado',
      source: body.source,
      utm: body.utm,
    })
    .select('id')
    .single()

  if (leadErr || !lead) {
    console.error('[quotes] error insertando lead:', leadErr)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No hemos podido registrar tu solicitud. Inténtalo de nuevo o escríbenos por Instagram.' })
  }

  const { data: quote, error: quoteErr } = await supabase
    .from('quotes')
    .insert({
      lead_id: lead.id,
      client_name: body.nombre,
      client_email: body.email,
      client_phone: body.telefono || null,
      event_type: body.event_type,
      event_date: eventDate,
      location: body.location || null,
      distance_km: distanceKm,
      status: 'enviado',
      subtotal: computed.itemsSubtotal,
      adjustments: computed.adjustments,
      total: computed.total,
      deposit_amount: null, // la señal la fija la dueña al aceptar (Fase 4/5)
      valid_until: addDaysISO(30),
      notes: body.mensaje || null,
    })
    .select('id')
    .single()

  if (quoteErr || !quote) {
    console.error('[quotes] error insertando quote:', quoteErr)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No hemos podido guardar tu presupuesto. Inténtalo de nuevo.' })
  }

  const itemsPayload = computed.lines.map(l => ({
    quote_id: quote.id,
    product_id: l.kind === 'product' ? l.id : null,
    pack_id: l.kind === 'pack' ? l.id : null,
    label: l.label,
    qty: l.qty,
    unit_price: l.unit_price,
    line_total: l.line_total,
    options: { tier: l.tier, size: l.size, options: l.options },
  }))

  const { error: itemsErr } = await supabase.from('quote_items').insert(itemsPayload)

  if (itemsErr) {
    console.error('[quotes] error insertando quote_items:', itemsErr)
    // Limpieza: evita dejar un presupuesto vacío. El lead se conserva (contacto).
    await supabase.from('quotes').delete().eq('id', quote.id)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No hemos podido guardar el detalle de tu presupuesto. Inténtalo de nuevo.' })
  }

  // 7 ─ Emails (best-effort; el presupuesto ya está a salvo en BD) ───────────
  const emailData = {
    quoteId: quote.id,
    clientName: body.nombre,
    clientEmail: body.email,
    clientPhone: body.telefono || undefined,
    eventTypeLabel,
    eventDate: eventDate || undefined,
    location: body.location || undefined,
    invitados: body.invitados || undefined,
    distanceKm,
    lines: computed.lines.map(l => ({ label: l.label, qty: l.qty, unit_price: l.unit_price, line_total: l.line_total })),
    adjustments: computed.adjustments.map(a => ({ label: a.label, amount: a.amount, note: a.note })),
    itemsSubtotal: computed.itemsSubtotal,
    total: computed.total,
    hasConsulta: computed.hasConsulta,
    hasRental: computed.hasRental,
    message: body.mensaje || undefined,
  }

  const [notified] = await Promise.all([
    sendOwnerQuoteNotification(emailData),
    sendClientQuoteConfirmation(emailData),
  ])

  return {
    ok: true,
    notified, // aviso a la dueña salió → el cliente NO dispara fallback EmailJS
    quote: {
      id: quote.id,
      itemsSubtotal: computed.itemsSubtotal,
      total: computed.total,
      hasConsulta: computed.hasConsulta,
      detallito: computed.detallito,
      hasRental: computed.hasRental,
      adjustments: computed.adjustments,
      lines: computed.lines.map(l => ({
        label: l.label,
        qty: l.qty,
        unit_price: l.unit_price,
        line_total: l.line_total,
        consulta: l.consulta,
        is_rental: l.is_rental,
      })),
    },
  }
})
