export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const supabase = useSupabaseAdmin(event)
  // Si era la portada del álbum, el FK (on delete set null) lo limpia solo.
  const { error } = await supabase.from('gallery_images').delete().eq('id', id)

  if (error) {
    console.error('[admin/images] error borrando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido borrar la foto.' })
  }
  return { ok: true }
})
