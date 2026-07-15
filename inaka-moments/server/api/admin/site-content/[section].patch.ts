export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const section = getRouterParam(event, 'section')
  if (!section) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta la sección.' })
  if (!ADMIN_EDITABLE_SITE_CONTENT_SECTIONS.includes(section as any)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden', message: 'Sección no editable desde el panel.' })
  }

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
