import type { H3Event } from 'h3'

/**
 * Rate-limiter en memoria por IP (suficiente para un único contenedor).
 * Ventana deslizante simple; se auto-limpia en cada comprobación.
 */
const hits = new Map<string, number[]>()

interface RateLimitOptions {
  /** máximo de peticiones dentro de la ventana */
  max: number
  /** ventana en milisegundos */
  windowMs: number
}

export function assertRateLimit(event: H3Event, key: string, opts: RateLimitOptions) {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const bucketKey = `${key}:${ip}`
  const now = Date.now()

  const timestamps = (hits.get(bucketKey) ?? []).filter(t => now - t < opts.windowMs)
  if (timestamps.length >= opts.max) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'Has enviado demasiadas solicitudes. Inténtalo de nuevo en unos minutos.',
    })
  }
  timestamps.push(now)
  hits.set(bucketKey, timestamps)

  // Poda ocasional para no crecer indefinidamente
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every(t => now - t >= opts.windowMs)) hits.delete(k)
    }
  }
}
