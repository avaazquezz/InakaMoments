export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const supabase = useSupabaseAdmin(event)
  const { error } = await supabase.from('lead_activities').delete().eq('id', id)
  if (error) {
    console.error('[admin/lead-activities] error borrando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido borrar la actividad.' })
  }
  return { ok: true }
})
