export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const slug = getRouterParam(event, 'slug')
  const supabase = useSupabaseAdmin(event)
  const { data, error } = await supabase.from('occasions').select('*').eq('slug', slug!).maybeSingle()
  if (error || !data) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Ocasión no encontrada.' })
  }
  return data
})
