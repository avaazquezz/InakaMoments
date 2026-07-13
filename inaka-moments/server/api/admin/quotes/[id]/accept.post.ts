import { z } from 'zod'
import { bizumConcept } from '~~/shared/bizum'
import { normalizeRules, round2 } from '~~/shared/configurator'
import { addDaysISO } from '~~/shared/dates'
import { EVENT_TYPE_LABELS, type EventType } from '~~/shared/eventTypes'

/**
 * POST /api/admin/quotes/[id]/accept — el flujo más crítico del panel:
 * acepta el presupuesto, confirma la fecha en Agenda y avisa al cliente.
 *
 * Orden deliberado: primero se inserta el `event` (confirmado); solo si
 * eso tiene éxito se actualiza el `quote` a 'aceptado'. Si se hiciera al
 * revés y el insert del evento colisionara, quedaría un presupuesto
 * "aceptado" sin evento vinculado — un estado inconsistente que exigiría
 * arreglo manual. Con este orden, una colisión de fecha deja el
 * presupuesto intacto (sigue 'enviado'), lista para reintentar con otra
 * fecha.
 */

const bodySchema = z.object({
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Datos no válidos.' })
  }
  const body = parsed.data
  const supabase = useSupabaseAdmin(event)

  const { data: quote, error: fetchErr } = await supabase.from('quotes').select('*').eq('id', id).maybeSingle()
  if (fetchErr || !quote) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Presupuesto no encontrado.' })
  }
  if (quote.status === 'aceptado') {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Este presupuesto ya está aceptado.' })
  }

  const effectiveDate = body.event_date ?? quote.event_date
  if (!effectiveDate) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'El presupuesto no tiene fecha de evento. Indica una fecha para aceptar.' })
  }

  const { data: settingsRow } = await supabase.from('site_content').select('data').eq('section', 'settings').maybeSingle()
  const settingsData = settingsRow?.data as Record<string, unknown> | null
  const rules = normalizeRules(settingsData)
  const bizumPhone = typeof settingsData?.bizum_telefono === 'string' ? settingsData.bizum_telefono : undefined
  // La reserva es SIEMPRE un % del total (gestionable en Contenido → Reglas
  // de negocio) — nunca un importe libre, para que sea consistente entre
  // presupuestos y no dependa de que la dueña recuerde fijarlo a mano.
  const senalPorcentaje = typeof settingsData?.senal_porcentaje === 'number' && settingsData.senal_porcentaje > 0
    ? settingsData.senal_porcentaje
    : 50
  const effectiveDeposit = round2(quote.total * senalPorcentaje / 100)
  const minAllowedDate = addDaysISO(rules.antelacion_dias)
  if (effectiveDate < minAllowedDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: `La fecha del evento debe tener al menos ${rules.antelacion_dias} días de antelación.`,
    })
  }

  const eventTypeLabel = quote.event_type ? (EVENT_TYPE_LABELS[quote.event_type as EventType] ?? quote.event_type) : 'Evento'

  // 1 — Confirmar el evento (esto ES la comprobación de colisión de fecha).
  const createdEvent = await confirmEventDate(event, {
    title: `${eventTypeLabel} — ${quote.client_name ?? 'Cliente'}`,
    event_type: quote.event_type,
    event_date: effectiveDate,
    location: quote.location,
    quote_id: quote.id,
    lead_id: quote.lead_id,
    client_name: quote.client_name,
    client_contact: quote.client_email ?? quote.client_phone,
  })

  // 2 — Solo si el evento se creó, marcar el presupuesto como aceptado.
  const { error: updErr } = await supabase
    .from('quotes')
    .update({ status: 'aceptado', deposit_amount: effectiveDeposit, event_date: effectiveDate })
    .eq('id', id)

  if (updErr) {
    console.error('[admin/quotes/accept] evento creado pero no se pudo actualizar el presupuesto:', updErr)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'El evento se ha confirmado pero no se ha podido actualizar el presupuesto. Revísalo manualmente en Agenda y Presupuestos.',
    })
  }

  // 3 — Email best-effort (no revierte nada si falla; el evento y el presupuesto ya están a salvo).
  let notified = false
  if (quote.client_email) {
    notified = await sendReservationConfirmedEmail({
      clientName: quote.client_name ?? '',
      clientEmail: quote.client_email,
      eventTypeLabel,
      eventDate: effectiveDate,
      location: quote.location ?? undefined,
      depositAmount: effectiveDeposit,
      total: quote.total,
      quoteId: quote.id,
      bizumPhone,
      bizumConcept: bizumConcept({ clientName: quote.client_name ?? 'Cliente', eventDate: effectiveDate }),
    })
  }

  return {
    ok: true,
    notified,
    event: createdEvent,
    quote: { id: quote.id, status: 'aceptado' as const },
  }
})
