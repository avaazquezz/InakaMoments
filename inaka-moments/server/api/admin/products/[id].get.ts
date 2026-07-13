export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  const supabase = useSupabaseAdmin(event)

  const { data, error } = await supabase.from('products').select('*').eq('id', id!).maybeSingle()
  if (error || !data) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Producto no encontrado.' })
  }
  return data
})
