export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const section = getRouterParam(event, 'section')
  if (!section) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta la sección.' })

  const parsed = siteContentSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Datos no válidos.' })
  }
  const supabase = useSupabaseAdmin(event)

  const { error } = await supabase
    .from('site_content')
    .upsert({ section, data: parsed.data.data }, { onConflict: 'section' })

  if (error) {
    console.error('[admin/site-content] error guardando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido guardar.' })
  }
  return { ok: true }
})
