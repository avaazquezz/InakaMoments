/**
 * GET /api/geocode?address=... — estimación en vivo de distancia a Abrera.
 *
 * Usado por el configurador mientras el usuario escribe la dirección del
 * evento (debounced en el cliente). No persiste nada ni tiene valor para
 * spam, así que solo lleva rate-limit (protege el uso justo de Nominatim,
 * no anti-abuso). El cálculo final y autoritativo se repite server-side en
 * `POST /api/quotes` — este endpoint es solo para el feedback visual.
 */
export default defineEventHandler(async (event) => {
  assertRateLimit(event, 'geocode', { max: 20, windowMs: 10 * 60 * 1000 })

  const query = getQuery(event)
  const address = typeof query.address === 'string' ? query.address.trim() : ''
  if (address.length < 5) return { distance_km: null, display_name: null }

  const result = await distanceFromAbreraKm(address)
  return result
    ? { distance_km: result.distanceKm, display_name: result.display_name }
    : { distance_km: null, display_name: null }
})
