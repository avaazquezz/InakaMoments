import type { H3Event } from 'h3'

interface ConfirmEventDateInput {
  title: string
  event_type: string | null
  event_date: string
  location: string | null
  quote_id: string | null
  lead_id: string | null
  client_name: string | null
  client_contact: string | null
}

/**
 * Inserta un evento como 'confirmado'. Un único INSERT es, a la vez, la
 * comprobación de colisión: la BD tiene un índice único parcial
 * (`events_confirmed_date`) sobre `event_date` para `status='confirmado'`.
 * Nunca hacer un SELECT de disponibilidad antes de este INSERT — sería una
 * condición de carrera real entre dos peticiones simultáneas aceptando
 * fechas distintas. El propio INSERT, y el error 23505 si colisiona, son
 * la forma correcta (libre de carreras) de hacer esta comprobación.
 *
 * Usado tanto por el flujo de aceptar presupuesto como por confirmar un
 * evento manual desde Agenda, para no duplicar el manejo de la colisión.
 */
export async function confirmEventDate(event: H3Event, input: ConfirmEventDateInput) {
  const supabase = useSupabaseAdmin(event)
  const { data, error } = await supabase
    .from('events')
    .insert({ ...input, status: 'confirmado' })
    .select('id, event_date')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Esa fecha ya está reservada para otro evento confirmado. Elige otra fecha.',
      })
    }
    console.error('[events] error confirmando evento:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido confirmar el evento.' })
  }

  return data
}
