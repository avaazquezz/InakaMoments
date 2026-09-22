import type { H3Event } from 'h3'
import { todayISO } from '~~/shared/dates'

/**
 * Marca como 'caducado' los presupuestos 'enviado' cuya validez
 * (`valid_until`, 30 días desde la creación) ya pasó — sin esto el estado
 * existía en la BD pero nada lo asignaba, y uno de hace meses contaba igual
 * que uno de ayer en "Presupuestos por decidir". 'caducado' no es un callejón
 * sin salida: desde el panel sigue pudiéndose aceptar o reactivar.
 *
 * Mismo patrón y mismas limitaciones (un único contenedor self-hosted) que
 * review-request-scheduler.ts. Idempotente: repetir el chequeo no cambia nada.
 */

const POLL_INTERVAL_MS = 60 * 60 * 1000 // cada hora
const STARTUP_DELAY_MS = 45_000

export default defineNitroPlugin(() => {
  async function tick() {
    // `context.nitro` tiene que ser un objeto real: useRuntimeConfig(event) lee
    // event.context.nitro.runtimeConfig y, si no existe, lo calcula y lo cachea
    // ahí mismo — con `context: {}` a secas, `.nitro` es undefined y truena.
    const fakeEvent = { context: { nitro: {} } } as unknown as H3Event

    try {
      const supabase = useSupabaseAdmin(fakeEvent)
      const { data, error } = await supabase
        .from('quotes')
        .update({ status: 'caducado' })
        .eq('status', 'enviado')
        .lt('valid_until', todayISO())
        .select('id')
      if (error) throw error
      if (data && data.length > 0) console.log(`[quotes] presupuestos caducados: ${data.length}`)
    }
    catch (err) {
      console.error('[quotes] error en el ciclo de caducidad de presupuestos:', err)
    }
  }

  setTimeout(tick, STARTUP_DELAY_MS)
  setInterval(tick, POLL_INTERVAL_MS)
})
