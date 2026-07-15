import { z } from 'zod'

const bodySchema = z.object({
  quoteIds: z.array(z.string().uuid()).min(1).max(100),
})

/**
 * POST /api/admin/testimonials/enviar — envío manual de solicitudes de
 * reseña a varios clientes a la vez (pantalla /admin/resenas/enviar).
 * Recalcula los candidatos en servidor y filtra por los `quoteIds`
 * recibidos: nunca confía en datos que mande el cliente (mismo principio
 * que server/api/quotes.post.ts recalculando precios desde la BD).
 */
export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const { quoteIds } = parsed.data

  const all = await findReviewCandidates(event, {})
  const chosen = all.filter(c => quoteIds.includes(c.quoteId))

  const outcomes = await sendReviewRequests(event, chosen)

  return { sent: outcomes.filter(o => o.sent).length, total: chosen.length, outcomes }
})
