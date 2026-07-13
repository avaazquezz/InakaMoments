export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const supabase = useSupabaseAdmin(event)
  // Las fotos del álbum se borran en cascada (FK on delete cascade); los
  // archivos en Storage no se limpian automáticamente (hueco aceptado).
  const { error } = await supabase.from('event_albums').delete().eq('id', id)

  if (error) {
    console.error('[admin/albums] error borrando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido borrar el álbum.' })
  }
  return { ok: true }
})
