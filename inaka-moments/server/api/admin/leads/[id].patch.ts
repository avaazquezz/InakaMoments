export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const parsed = leadSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data
  const supabase = useSupabaseAdmin(event)

  const { error } = await supabase
    .from('leads')
    .update({
      ...body,
      tipo: body.tipo || null,
      fecha: body.fecha || null,
      invitados: body.invitados || null,
      telefono: body.telefono || null,
      ideas_extra: body.ideas_extra || null,
      notes: body.notes || null,
    })
    .eq('id', id)

  if (error) {
    console.error('[admin/leads] error actualizando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido guardar el lead.' })
  }
  return { ok: true }
})
