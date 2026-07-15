import { CATALOG_PDF_PATH } from '~~/shared/catalogPdf'

/** DELETE /api/admin/catalog-pdf — borra el PDF del catálogo actual. */
export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const supabase = useSupabaseAdmin(event)
  const { error } = await supabase.storage.from('catalog').remove([CATALOG_PDF_PATH])

  if (error) {
    console.error('[admin/catalog-pdf] error borrando el PDF:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido borrar el catálogo.' })
  }

  return { ok: true }
})
