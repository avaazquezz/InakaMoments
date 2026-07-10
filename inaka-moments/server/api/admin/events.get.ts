export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const supabase = useSupabaseAdmin(event)
  const query = getQuery(event)

  let q = supabase.from('events').select('*').order('event_date', { ascending: true })
  if (typeof query.from === 'string' && query.from) q = q.gte('event_date', query.from)
  if (typeof query.to === 'string' && query.to) q = q.lte('event_date', query.to)

  const { data, error } = await q
  if (error) {
    console.error('[admin/events] error listando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se han podido cargar los eventos.' })
  }
  return data
})
