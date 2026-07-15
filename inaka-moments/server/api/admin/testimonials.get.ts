export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const supabase = useSupabaseAdmin(event)
  // Excluye solicitudes enviadas y aún sin respuesta del cliente — solo
  // interesan aquí las reseñas manuales o ya respondidas (a moderar).
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .or('requested_at.is.null,responded_at.not.is.null')
    .order('sort_order', { ascending: true })
  if (error) {
    console.error('[admin/testimonials] error listando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se han podido cargar las reseñas.' })
  }
  return data
})
