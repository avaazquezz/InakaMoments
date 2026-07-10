export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const supabase = useSupabaseAdmin(event)
  const { data: bookings } = await supabase.from('rental_bookings').select('id').eq('event_id', id)
  if (bookings && bookings.length > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Conflict',
      message: 'Este evento tiene reservas de inventario asociadas. Bórralas primero desde Inventario.',
    })
  }

  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) {
    console.error('[admin/events] error borrando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido borrar el evento.' })
  }
  return { ok: true }
})
