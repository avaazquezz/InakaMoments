export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  const supabase = useSupabaseAdmin(event)

  const [leadRes, activitiesRes, quotesRes] = await Promise.all([
    supabase.from('leads').select('*').eq('id', id!).maybeSingle(),
    supabase.from('lead_activities').select('*').eq('lead_id', id!).order('created_at', { ascending: false }),
    supabase.from('quotes').select('id, status, total, event_date, created_at').eq('lead_id', id!).order('created_at', { ascending: false }),
  ])

  if (leadRes.error || !leadRes.data) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Lead no encontrado.' })
  }

  return {
    ...leadRes.data,
    activities: activitiesRes.data ?? [],
    quotes: quotesRes.data ?? [],
  }
})
