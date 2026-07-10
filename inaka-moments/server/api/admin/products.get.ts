export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const supabase = useSupabaseAdmin(event)
  const query = getQuery(event)

  let q = supabase.from('products').select('*').order('sort_order', { ascending: true })
  if (typeof query.category === 'string' && query.category) q = q.eq('category', query.category)
  if (query.active === 'true') q = q.eq('active', true)
  if (query.active === 'false') q = q.eq('active', false)
  if (typeof query.search === 'string' && query.search.trim()) q = q.ilike('name', `%${query.search.trim()}%`)

  const { data, error } = await q
  if (error) {
    console.error('[admin/products] error listando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se han podido cargar los productos.' })
  }
  return data
})
