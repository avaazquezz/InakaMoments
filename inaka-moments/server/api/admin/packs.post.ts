export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const parsed = packSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data
  const supabase = useSupabaseAdmin(event)

  const slug = await uniqueSlug(body.name, async (candidate) => {
    const { count } = await supabase.from('packs').select('id', { count: 'exact', head: true }).eq('slug', candidate)
    return (count ?? 0) > 0
  })

  const { data, error } = await supabase
    .from('packs')
    .insert({ ...body, description: body.description || null, slug })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[admin/packs] error creando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido crear el pack.' })
  }
  return { id: data.id }
})
