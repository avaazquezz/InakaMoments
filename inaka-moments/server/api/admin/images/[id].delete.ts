export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const supabase = useSupabaseAdmin(event)
  const { data: image } = await supabase.from('gallery_images').select('storage_path').eq('id', id).maybeSingle()

  // Si era la portada del álbum, el FK (on delete set null) lo limpia solo.
  const { error } = await supabase.from('gallery_images').delete().eq('id', id)

  if (error) {
    console.error('[admin/images] error borrando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido borrar la foto.' })
  }

  // Las URLs externas (fotos demo/seed) no viven en nuestro bucket; solo se
  // limpia Storage cuando es un archivo real subido desde el panel. No falla
  // la petición si esto falla: la foto ya no está en la web, un huérfano en
  // Storage es un mal menor frente a bloquear el borrado.
  if (image?.storage_path && !/^https?:\/\//.test(image.storage_path)) {
    const { error: storageError } = await supabase.storage.from('gallery').remove([image.storage_path])
    if (storageError) console.error('[admin/images] no se pudo borrar el archivo de Storage (queda huérfano):', storageError)
  }

  return { ok: true }
})
