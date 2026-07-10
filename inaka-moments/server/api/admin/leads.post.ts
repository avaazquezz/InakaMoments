export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const parsed = leadSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data
  const supabase = useSupabaseAdmin(event)

  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...body,
      tipo: body.tipo || null,
      fecha: body.fecha || null,
      invitados: body.invitados || null,
      telefono: body.telefono || null,
      ideas_extra: body.ideas_extra || null,
      notes: body.notes || null,
      source: 'manual',
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[admin/leads] error creando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido crear el lead.' })
  }
  return { id: data.id }
})
