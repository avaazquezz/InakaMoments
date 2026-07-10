/**
 * Geocodificación + distancia a Abrera (server-side).
 *
 * Usa Nominatim (OpenStreetMap) — gratuito, sin API key, con política de uso
 * justo (~1 req/s, requiere User-Agent descriptivo). Nunca lanza: cualquier
 * fallo (red, timeout, sin resultados) devuelve `null` y quien llama cae a su
 * propio fallback (checkbox manual "far" en el configurador).
 */

/** Abrera, Cataluña — origen fijo para el cálculo de distancia. */
export const ABRERA_ORIGIN = { lat: 41.5165, lon: 1.9004 } as const

export interface GeoPoint {
  lat: number
  lon: number
}

export interface GeocodeResult {
  lat: number
  lon: number
  display_name: string
}

interface CacheEntry {
  result: GeocodeResult | null
  at: number
}

const CACHE_TTL_MS = 30 * 60 * 1000
const geocodeCache = new Map<string, CacheEntry>()

/** Distancia en línea recta (km) entre dos puntos (fórmula de Haversine). */
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLon = (b.lon - a.lon) * Math.PI / 180
  const lat1 = a.lat * Math.PI / 180
  const lat2 = b.lat * Math.PI / 180

  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

/** Geocodifica una dirección vía Nominatim. `null` si falla o no hay resultados. */
export async function geocodeAddress(query: string): Promise<GeocodeResult | null> {
  const key = query.trim().toLowerCase()
  const cached = geocodeCache.get(key)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.result

  const config = useRuntimeConfig()

  let result: GeocodeResult | null = null
  try {
    const rows = await $fetch<Array<{ lat: string, lon: string, display_name: string }>>(
      'https://nominatim.openstreetmap.org/search',
      {
        query: { format: 'json', limit: 1, countrycodes: 'es', q: query },
        headers: {
          'User-Agent': `InakaMomentsBot/1.0 (contacto: ${config.emailBusiness})`,
          'Accept-Language': 'es',
        },
        timeout: 6000,
      },
    )
    const hit = rows?.[0]
    if (hit) {
      result = { lat: Number.parseFloat(hit.lat), lon: Number.parseFloat(hit.lon), display_name: hit.display_name }
    }
  }
  catch (err) {
    console.error('[geocode] error consultando Nominatim:', err)
    result = null
  }

  geocodeCache.set(key, { result, at: Date.now() })
  return result
}

/** Distancia (km, redondeada a 1 decimal) desde Abrera hasta la dirección dada. */
export async function distanceFromAbreraKm(address: string): Promise<{ distanceKm: number, display_name: string } | null> {
  const geo = await geocodeAddress(address)
  if (!geo) return null
  const km = haversineKm(ABRERA_ORIGIN, geo)
  return { distanceKm: Math.round(km * 10) / 10, display_name: geo.display_name }
}
