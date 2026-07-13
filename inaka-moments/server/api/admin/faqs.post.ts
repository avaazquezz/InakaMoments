export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const parsed = faqSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data
  const supabase = useSupabaseAdmin(event)

  const { data, error } = await supabase
    .from('faqs')
    .insert({ ...body, category: body.category || null })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[admin/faqs] error creando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido crear la FAQ.' })
  }
  return { id: data.id }
})
