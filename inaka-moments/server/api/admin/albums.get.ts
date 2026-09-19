export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const supabase = useSupabaseAdmin(event)

  const { data, error } = await supabase
    .from('event_albums')
    .select('*, gallery_images!gallery_images_album_id_fkey(id, storage_path)')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[admin/albums] error listando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se han podido cargar los álbumes.' })
  }
  return (data ?? []).map((a) => {
    const images = (a.gallery_images as { id: string, storage_path: string }[]) ?? []
    const cover = images.find(img => img.id === a.cover_image_id) ?? images[0]
    return { ...a, photoCount: images.length, coverPath: cover?.storage_path ?? null, gallery_images: undefined }
  })
})
