export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const section = getRouterParam(event, 'section')
  const supabase = useSupabaseAdmin(event)

  const { data, error } = await supabase.from('site_content').select('*').eq('section', section!).maybeSingle()
  if (error) {
    console.error('[admin/site-content] error leyendo:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido cargar el contenido.' })
  }
  return data ?? { section, data: {} }
})
