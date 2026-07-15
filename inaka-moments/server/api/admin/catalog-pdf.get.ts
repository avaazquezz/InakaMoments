import { CATALOG_PDF_PATH } from '~~/shared/catalogPdf'

/**
 * GET /api/admin/catalog-pdf — indica si hay un PDF de catálogo subido y
 * cuándo se actualizó por última vez, para mostrarlo en el panel.
 */
export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const supabase = useSupabaseAdmin(event)
  const { data, error } = await supabase.storage.from('catalog').list('', { search: CATALOG_PDF_PATH })

  if (error) {
    console.error('[admin/catalog-pdf] error consultando el PDF:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido comprobar el catálogo actual.' })
  }

  const file = data?.find(f => f.name === CATALOG_PDF_PATH)
  return { exists: !!file, updatedAt: file?.updated_at ?? null }
})
