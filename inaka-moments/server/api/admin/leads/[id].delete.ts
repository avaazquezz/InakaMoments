export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const supabase = useSupabaseAdmin(event)
  // Las actividades se borran en cascada; los presupuestos vinculados quedan
  // con lead_id = null (on delete set null), no se borran.
  const { error } = await supabase.from('leads').delete().eq('id', id)

  if (error) {
    console.error('[admin/leads] error borrando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido borrar el lead.' })
  }
  return { ok: true }
})
