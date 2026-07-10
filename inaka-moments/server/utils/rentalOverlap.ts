import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/app/types/database'

/**
 * Comprobación de solape para `rental_bookings`. A diferencia de
 * `events_confirmed_date`, no hay restricción única en la BD para esto —
 * es una comprobación a nivel de aplicación (lectura-luego-escritura), con
 * una ventana de carrera real pero aceptable dado que es un único actor
 * (la dueña) usando el panel.
 */
export async function hasRentalOverlap(
  supabase: SupabaseClient<Database>,
  productId: string,
  dateFrom: string,
  dateTo: string,
  excludeId?: string,
): Promise<boolean> {
  let q = supabase
    .from('rental_bookings')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', productId)
    .lte('date_from', dateTo)
    .gte('date_to', dateFrom)

  if (excludeId) q = q.neq('id', excludeId)

  const { count } = await q
  return (count ?? 0) > 0
}
