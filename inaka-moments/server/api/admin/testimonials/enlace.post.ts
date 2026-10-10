import { z } from 'zod'
import { EVENT_TYPES } from '~~/shared/eventTypes'

const bodySchema = z.object({
  author: z.string().trim().max(120).optional().default(''),
  event_type: z.enum(EVENT_TYPES).nullable().optional(),
})

/**
 * POST /api/admin/testimonials/enlace — solicitud de reseña SIN email, para
 * clientes que no pasaron por el sistema de presupuestos: la dueña comparte
 * el enlace /resena/[token] a mano (WhatsApp, Instagram, email). Misma fila
 * que una solicitud automática, sin quote_id ni client_email — así el
 * formulario público, el listado y la moderación no necesitan ningún cambio.
 */
export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const { author, event_type } = parsed.data

  const token = crypto.randomUUID()
  const { data, error } = await useSupabaseAdmin(event)
    .from('testimonials')
    .insert({
      token,
      author: author || null,
      event_type: event_type ?? null,
      requested_at: new Date().toISOString(),
      published: false,
      sort_order: 999,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[admin/testimonials] error creando enlace de reseña:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido crear el enlace.' })
  }
  return { id: data.id, token }
})
