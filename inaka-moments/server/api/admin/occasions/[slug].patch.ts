export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el slug.' })

  const parsed = occasionSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data
  const supabase = useSupabaseAdmin(event)

  const { error } = await supabase
    .from('occasions')
    .update({
      ...body,
      intro: body.intro || null,
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
    })
    .eq('slug', slug)

  if (error) {
    console.error('[admin/occasions] error actualizando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido guardar la ocasión.' })
  }
  return { ok: true }
})
