import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/app/types/database'

/**
 * ¿Ya no queda ninguna unidad libre de este producto en esas fechas?
 * Cada reserva ocupa 1 unidad, así que se bloquea solo cuando las reservas
 * solapadas alcanzan `products.stock` (con stock > 1, solapar no es conflicto).
 *
 * A diferencia de `events_confirmed_date`, no hay restricción única en la BD
 * para esto — es una comprobación a nivel de aplicación (lectura-luego-
 * escritura), con una ventana de carrera real pero aceptable dado que es un
 * único actor (la dueña) usando el panel.
 */
export async function hasRentalOverlap(
  supabase: SupabaseClient<Database>,
  productId: string,
  dateFrom: string,
  dateTo: string,
  excludeId?: string,
): Promise<boolean> {
  const { data: product } = await supabase.from('products').select('stock').eq('id', productId).maybeSingle()
  // Solo null/undefined caen al valor por defecto: un 0 explícito (sin unidades
  // libres) debe bloquear cualquier reserva, no comportarse como stock=1.
  const stock = product?.stock ?? 1

  let q = supabase
    .from('rental_bookings')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', productId)
    .lte('date_from', dateTo)
    .gte('date_to', dateFrom)

  if (excludeId) q = q.neq('id', excludeId)

  const { count } = await q
  return (count ?? 0) >= stock
}
