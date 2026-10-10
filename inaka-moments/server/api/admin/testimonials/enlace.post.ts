import { z } from 'zod'
import { EVENT_TYPES } from '~~/shared/eventTypes'

const bodySchema = z.object({
  author: z.string().trim().max(120).optional().default(''),
  event_type: z.enum(EVENT_TYPES).nullable().optional(),
  event_id: z.string().uuid().nullable().optional(),
})

/**
 * POST /api/admin/testimonials/enlace — solicitud de reseña por enlace: la
 * dueña comparte /resena/[token] a mano (WhatsApp, Instagram, email). Con
 * `event_id` queda ligada a un evento de la agenda (como mucho una por
 * evento, ver migración testimonials_event_id); sin él, sirve para cualquier
 * cliente que no esté en el panel.
 */
export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const { author, event_type, event_id } = parsed.data
  const supabase = useSupabaseAdmin(event)

  const token = crypto.randomUUID()
  const { data, error } = await supabase
    .from('testimonials')
    .insert({
      token,
      author: author || null,
      event_type: event_type ?? null,
      event_id: event_id ?? null,
      requested_at: new Date().toISOString(),
      published: false,
      sort_order: 999,
    })
    .select('id')
    .single()

  // Ese evento ya tenía enlace (doble clic, otra pestaña): se devuelve el mismo
  // en vez de fallar, para que el cliente nunca reciba dos enlaces distintos.
  if (error?.code === '23505' && event_id) {
    const { data: existing, error: existingErr } = await supabase
      .from('testimonials')
      .select('id, token')
      .eq('event_id', event_id)
      .single()
    if (existing?.token) return { id: existing.id, token: existing.token }
    console.error('[admin/testimonials] enlace duplicado sin token recuperable:', existingErr)
  }

  if (error || !data) {
    console.error('[admin/testimonials] error creando enlace de reseña:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido crear el enlace.' })
  }
  return { id: data.id, token }
})
