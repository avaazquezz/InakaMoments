export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const supabase = useSupabaseAdmin(event)

  const { data: quote } = await supabase.from('quotes').select('status').eq('id', id).maybeSingle()
  if (quote?.status === 'aceptado') {
    throw createError({
      statusCode: 409,
      statusMessage: 'Conflict',
      message: 'Este presupuesto ya está aceptado y tiene un evento vinculado. Cancélalo desde Agenda en lugar de borrarlo.',
    })
  }

  const { error } = await supabase.from('quotes').delete().eq('id', id)
  if (error) {
    console.error('[admin/quotes] error borrando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido borrar el presupuesto.' })
  }
  return { ok: true }
})
