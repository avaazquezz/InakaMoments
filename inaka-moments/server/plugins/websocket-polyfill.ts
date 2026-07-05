import { WebSocket } from 'ws'

/**
 * Polyfill de WebSocket para Node < 22.
 *
 * @supabase/realtime-js requiere un constructor WebSocket global; Node 22+
 * lo trae nativo (imagen Docker node:22 → no-op), pero en desarrollo local
 * con Node 20 hay que proveerlo. El factory de realtime-js usa
 * globalThis.WebSocket si está definido.
 */
export default defineNitroPlugin(() => {
  if (typeof globalThis.WebSocket === 'undefined') {
    globalThis.WebSocket = WebSocket as unknown as typeof globalThis.WebSocket
  }
})
