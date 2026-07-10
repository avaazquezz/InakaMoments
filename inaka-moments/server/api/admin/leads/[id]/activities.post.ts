export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const leadId = getRouterParam(event, 'id')
  if (!leadId) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador del lead.' })

  const parsed = leadActivitySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data
  const supabase = useSupabaseAdmin(event)

  const { data, error } = await supabase
    .from('lead_activities')
    .insert({ ...body, lead_id: leadId, note: body.note || null, due_date: body.due_date || null })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[admin/leads] error creando actividad:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido añadir la actividad.' })
  }
  return { id: data.id }
})
