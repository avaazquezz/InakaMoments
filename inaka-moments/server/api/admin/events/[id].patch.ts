export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const parsed = eventSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data
  const supabase = useSupabaseAdmin(event)

  const { error } = await supabase
    .from('events')
    .update({
      ...body,
      start_time: body.start_time || null,
      end_time: body.end_time || null,
      location: body.location || null,
      client_name: body.client_name || null,
      client_contact: body.client_contact || null,
      notes: body.notes || null,
    })
    .eq('id', id)

  if (error) {
    // Igual que en el INSERT: el índice único parcial también protege el
    // UPDATE, así que pasar un evento a 'confirmado' en una fecha ya
    // ocupada falla aquí de forma segura frente a condiciones de carrera.
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'Conflict', message: 'Esa fecha ya está reservada para otro evento confirmado.' })
    }
    console.error('[admin/events] error actualizando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido guardar el evento.' })
  }

  // Un evento cancelado no debe seguir bloqueando el stock de alquiler: sin
  // esto, hasRentalOverlap contaba para siempre reservas de un evento que ya
  // no va a celebrarse.
  if (body.status === 'cancelado') {
    const { error: releaseError } = await supabase.from('rental_bookings').delete().eq('event_id', id)
    if (releaseError) {
      console.error('[admin/events] error liberando reservas de alquiler tras cancelar:', releaseError)
      throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'El evento se canceló pero no se pudieron liberar sus reservas de alquiler. Bórralas a mano desde Inventario.' })
    }
  }

  return { ok: true }
})
