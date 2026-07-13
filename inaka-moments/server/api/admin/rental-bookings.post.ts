export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const parsed = rentalBookingSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data
  if (body.date_to < body.date_from) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'La fecha de fin no puede ser anterior a la de inicio.' })
  }

  const supabase = useSupabaseAdmin(event)
  if (await hasRentalOverlap(supabase, body.product_id, body.date_from, body.date_to)) {
    throw createError({ statusCode: 409, statusMessage: 'Conflict', message: 'Ese producto ya está reservado en fechas que se solapan con estas.' })
  }

  const { data, error } = await supabase
    .from('rental_bookings')
    .insert({ ...body, event_id: body.event_id || null })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[admin/rental-bookings] error creando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido crear la reserva.' })
  }
  return { id: data.id }
})
