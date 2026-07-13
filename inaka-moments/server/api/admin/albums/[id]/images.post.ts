export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const albumId = getRouterParam(event, 'id')
  if (!albumId) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador del álbum.' })

  const body = await readBody(event)
  const parsed = galleryImageSchema.safeParse({ ...body, album_id: albumId })
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }

  const supabase = useSupabaseAdmin(event)
  const { data, error } = await supabase
    .from('gallery_images')
    .insert({ ...parsed.data, alt: parsed.data.alt || null })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[admin/albums] error añadiendo foto:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido añadir la foto.' })
  }
  return { id: data.id }
})
