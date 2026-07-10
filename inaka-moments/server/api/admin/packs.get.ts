export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const supabase = useSupabaseAdmin(event)
  const query = getQuery(event)

  let q = supabase.from('packs').select('*').order('sort_order', { ascending: true })
  if (query.active === 'true') q = q.eq('active', true)
  if (query.active === 'false') q = q.eq('active', false)
  if (typeof query.search === 'string' && query.search.trim()) q = q.ilike('name', `%${query.search.trim()}%`)

  const { data, error } = await q
  if (error) {
    console.error('[admin/packs] error listando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se han podido cargar los packs.' })
  }
  return data
})
