export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const supabase = useSupabaseAdmin(event)

  const { data, error } = await supabase
    .from('rental_bookings')
    .select('*, product:products(name), event:events(title)')
    .order('date_from', { ascending: true })

  if (error) {
    console.error('[admin/rental-bookings] error listando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se han podido cargar las reservas de inventario.' })
  }
  return data
})
