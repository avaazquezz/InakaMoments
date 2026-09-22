export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const supabase = useSupabaseAdmin(event)
  const { data: images } = await supabase.from('gallery_images').select('storage_path').eq('album_id', id)

  // Las fotos del álbum se borran en cascada (FK on delete cascade).
  const { error } = await supabase.from('event_albums').delete().eq('id', id)

  if (error) {
    console.error('[admin/albums] error borrando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido borrar el álbum.' })
  }

  // Igual que en images/[id].delete.ts: solo limpiamos archivos reales
  // (no URLs externas de fotos demo), y no bloqueamos el borrado si falla.
  const realPaths = (images ?? []).map(i => i.storage_path).filter(p => !/^https?:\/\//.test(p))
  if (realPaths.length) {
    const { error: storageError } = await supabase.storage.from('gallery').remove(realPaths)
    if (storageError) console.error('[admin/albums] no se pudieron borrar los archivos de Storage (quedan huérfanos):', storageError)
  }

  return { ok: true }
})
