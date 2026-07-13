export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const parsed = productSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data
  const supabase = useSupabaseAdmin(event)

  const { error } = await supabase
    .from('products')
    .update({ ...body, description: body.description || null })
    .eq('id', id)

  if (error) {
    console.error('[admin/products] error actualizando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido guardar el producto.' })
  }
  return { ok: true }
})
