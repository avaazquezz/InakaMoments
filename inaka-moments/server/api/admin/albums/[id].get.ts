export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  const supabase = useSupabaseAdmin(event)

  const { data, error } = await supabase
    .from('event_albums')
    .select('*, gallery_images!gallery_images_album_id_fkey(*)')
    .eq('id', id!)
    .maybeSingle()

  if (error || !data) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Álbum no encontrado.' })
  }

  const images = ((data.gallery_images as unknown[]) ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)
  return { ...data, gallery_images: images }
})
