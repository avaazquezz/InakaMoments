export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const parsed = albumSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data
  const supabase = useSupabaseAdmin(event)

  const { data, error } = await supabase
    .from('event_albums')
    .insert({ ...body, event_date: body.event_date || null })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[admin/albums] error creando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido crear el álbum.' })
  }
  return { id: data.id }
})
