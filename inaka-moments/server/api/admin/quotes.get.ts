export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const supabase = useSupabaseAdmin(event)
  const query = getQuery(event)

  let q = supabase.from('quotes').select('*').order('created_at', { ascending: false })
  if (typeof query.status === 'string' && query.status) q = q.eq('status', query.status)
  if (typeof query.lead === 'string' && query.lead) q = q.eq('lead_id', query.lead)

  const { data, error } = await q
  if (error) {
    console.error('[admin/quotes] error listando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se han podido cargar los presupuestos.' })
  }
  return data
})
