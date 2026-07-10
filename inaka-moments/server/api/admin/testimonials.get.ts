export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const supabase = useSupabaseAdmin(event)
  const { data, error } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true })
  if (error) {
    console.error('[admin/testimonials] error listando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se han podido cargar las reseñas.' })
  }
  return data
})
