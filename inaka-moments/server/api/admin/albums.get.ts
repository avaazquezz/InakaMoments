export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const supabase = useSupabaseAdmin(event)

  const { data, error } = await supabase
    .from('event_albums')
    .select('*, gallery_images(id)')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[admin/albums] error listando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se han podido cargar los álbumes.' })
  }
  return (data ?? []).map(a => ({ ...a, photoCount: (a.gallery_images as unknown[])?.length ?? 0, gallery_images: undefined }))
})
