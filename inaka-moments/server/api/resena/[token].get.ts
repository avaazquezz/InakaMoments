import { EVENT_TYPE_LABELS } from '~~/shared/eventTypes'

/**
 * GET /api/resena/[token] — datos para pintar el formulario público de
 * reseña (o el estado "ya respondida" / "enlace no válido").
 */
export default defineEventHandler(async (event) => {
  assertRateLimit(event, 'resena-get', { max: 30, windowMs: 10 * 60 * 1000 })

  const token = getRouterParam(event, 'token')
  if (!token) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el enlace.' })

  const supabase = useSupabaseAdmin(event)
  const { data, error } = await supabase
    .from('testimonials')
    .select('author, event_type, responded_at')
    .eq('token', token)
    .maybeSingle()

  if (error) {
    console.error('[resena] error consultando token:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido cargar el formulario.' })
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Este enlace no es válido.' })
  }

  return {
    alreadyResponded: !!data.responded_at,
    authorDefault: data.author,
    eventTypeLabel: data.event_type ? (EVENT_TYPE_LABELS[data.event_type] ?? data.event_type) : null,
  }
})
