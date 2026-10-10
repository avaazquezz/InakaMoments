import { addDaysISO, todayISO } from '~~/shared/dates'

const RECENT_EVENT_DAYS = 14

/**
 * GET /api/admin/testimonials/eventos-recientes — eventos celebrados en los
 * últimos 14 días, para crear el enlace de reseña con un clic (diálogo
 * «Enlace de reseña» de /admin/resenas). Cada uno trae la solicitud que ya
 * tenga — por event_id, o por quote_id en las antiguas solicitudes
 * automáticas por email — para no pedirle la reseña dos veces al mismo cliente.
 */
export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const supabase = useSupabaseAdmin(event)

  const [{ data: events, error: eventsErr }, { data: requests, error: requestsErr }] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, event_type, event_date, client_name, quote_id, quotes(client_name, event_type)')
      .in('status', ['confirmado', 'completado'])
      .gte('event_date', addDaysISO(-RECENT_EVENT_DAYS))
      .lte('event_date', todayISO())
      .order('event_date', { ascending: false }),
    supabase
      .from('testimonials')
      .select('event_id, quote_id, token, responded_at')
      .or('event_id.not.is.null,quote_id.not.is.null'),
  ])

  if (eventsErr || requestsErr) {
    console.error('[admin/testimonials] error cargando eventos recientes:', eventsErr ?? requestsErr)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se han podido cargar los eventos recientes.' })
  }

  return (events ?? []).map((e) => {
    const request = (requests ?? []).find(r => r.event_id === e.id || (e.quote_id && r.quote_id === e.quote_id))
    return {
      eventId: e.id,
      title: e.title,
      clientName: e.client_name ?? e.quotes?.client_name ?? null,
      eventType: e.event_type ?? e.quotes?.event_type ?? null,
      eventDate: e.event_date,
      request: request?.token ? { token: request.token, responded: !!request.responded_at } : null,
    }
  })
})
