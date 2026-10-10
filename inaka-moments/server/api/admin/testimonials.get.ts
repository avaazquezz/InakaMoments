export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const supabase = useSupabaseAdmin(event)
  // Incluye las solicitudes aún sin respuesta: /admin/resenas las separa de
  // las reseñas (requested_at && !responded_at) para poder reenviarlas o anularlas.
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) {
    console.error('[admin/testimonials] error listando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se han podido cargar las reseñas.' })
  }
  return data
})
