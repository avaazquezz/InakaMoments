export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  const supabase = useSupabaseAdmin(event)

  const [quoteRes, itemsRes] = await Promise.all([
    supabase.from('quotes').select('*').eq('id', id!).maybeSingle(),
    supabase.from('quote_items').select('*').eq('quote_id', id!).order('created_at', { ascending: true }),
  ])

  if (quoteRes.error || !quoteRes.data) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Presupuesto no encontrado.' })
  }

  return { ...quoteRes.data, items: itemsRes.data ?? [] }
})
