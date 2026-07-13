export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const supabase = useSupabaseAdmin(event)
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    if (error.code === '23503') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Este producto tiene presupuestos asociados. Desactívalo en lugar de borrarlo.',
      })
    }
    console.error('[admin/products] error borrando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido borrar el producto.' })
  }
  return { ok: true }
})
