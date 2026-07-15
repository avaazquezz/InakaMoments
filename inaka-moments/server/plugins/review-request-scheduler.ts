import type { H3Event } from 'h3'
import { addDaysISO } from '~~/shared/dates'

/**
 * Chequeo periódico que dispara solicitudes de reseña para eventos ya
 * pasados (ventana `[hoy-AUTO_REVIEW_WINDOW_DAYS, hoy-1]`, ver
 * `server/utils/reviews.ts`). Chequeo horario (no un cron exacto a
 * medianoche) + ventana de varios días → autosanable ante un reinicio
 * breve del contenedor, sin persistir ninguna "última ejecución".
 *
 * Único contenedor self-hosted (mismo supuesto que el rate-limiter en
 * memoria de server/utils/rate-limit.ts) — con réplicas habría que pasar a
 * un cron real.
 */

const POLL_INTERVAL_MS = 60 * 60 * 1000 // cada hora
const STARTUP_DELAY_MS = 30_000 // no competir con el arranque en frío

export default defineNitroPlugin(() => {
  async function tick() {
    // No hay un H3Event real fuera de una petición entrante. useSupabaseAdmin
    // solo necesita `event.context` (caché del cliente) y reenvía `event` a
    // useRuntimeConfig, que en este despliegue self-hosted no depende de la
    // request — un objeto mínimo con `context` vale como sustituto.
    const fakeEvent = { context: {} } as unknown as H3Event

    try {
      const candidates = await findReviewCandidates(fakeEvent, {
        minEventDate: addDaysISO(-AUTO_REVIEW_WINDOW_DAYS),
        maxEventDate: addDaysISO(-1),
      })
      if (candidates.length === 0) return

      const outcomes = await sendReviewRequests(fakeEvent, candidates)
      console.log(`[reviews] solicitudes automáticas: ${outcomes.filter(o => o.sent).length}/${candidates.length}`)
    }
    catch (err) {
      console.error('[reviews] error en el ciclo automático de solicitudes:', err)
    }
  }

  setTimeout(tick, STARTUP_DELAY_MS)
  setInterval(tick, POLL_INTERVAL_MS)
})
