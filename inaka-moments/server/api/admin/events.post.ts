export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const parsed = eventSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data
  const supabase = useSupabaseAdmin(event)

  const { data, error } = await supabase
    .from('events')
    .insert({
      ...body,
      start_time: body.start_time || null,
      end_time: body.end_time || null,
      location: body.location || null,
      client_name: body.client_name || null,
      client_contact: body.client_contact || null,
      notes: body.notes || null,
    })
    .select('id')
    .single()

  if (error) {
    // El índice único parcial (event_date, status='confirmado') también se
    // comprueba en INSERT: si se crea directamente como confirmado y esa
    // fecha ya está reservada, Postgres lo rechaza aquí mismo.
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'Conflict', message: 'Esa fecha ya está reservada para otro evento confirmado.' })
    }
    console.error('[admin/events] error creando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido crear el evento.' })
  }
  return { id: data!.id }
})
