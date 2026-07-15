import { addDaysISO } from '~~/shared/dates'

/**
 * GET /api/admin/testimonials/candidatos — clientes con evento ya pasado
 * que aún no tienen solicitud de reseña, para el envío manual desde el
 * panel. Excluye la ventana que ya cubre el scheduler automático (ver
 * server/utils/reviews.ts) para no duplicar visualmente ambos flujos.
 */
export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  return await findReviewCandidates(event, {
    maxEventDate: addDaysISO(-(AUTO_REVIEW_WINDOW_DAYS + 1)),
  })
})
