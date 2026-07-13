export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const supabase = useSupabaseAdmin(event)
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('[admin/leads] error listando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se han podido cargar los leads.' })
  }
  return data
})
