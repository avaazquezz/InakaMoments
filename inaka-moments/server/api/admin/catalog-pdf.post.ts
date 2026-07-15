/**
 * POST /api/admin/catalog-pdf — reemplaza el PDF del catálogo en el bucket
 * `catalog`, siempre en la misma ruta fija (upsert) para que el enlace
 * público nunca cambie.
 */

import { CATALOG_PDF_PATH } from '~~/shared/catalogPdf'

const MAX_SIZE = 25 * 1024 * 1024 // 25 MB, igual que el límite del bucket 'catalog'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const form = await readMultipartFormData(event)
  const file = form?.find(f => f.name === 'file')

  if (!file?.data?.length) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'No se ha recibido ningún archivo.' })
  }
  if (file.type !== 'application/pdf') {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'El archivo debe ser un PDF.' })
  }
  if (file.data.length > MAX_SIZE) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'El PDF no puede superar los 25 MB.' })
  }

  const supabase = useSupabaseAdmin(event)
  const { error } = await supabase.storage.from('catalog').upload(CATALOG_PDF_PATH, file.data, {
    contentType: 'application/pdf',
    upsert: true,
  })

  if (error) {
    console.error('[admin/catalog-pdf] error subiendo PDF:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido subir el PDF.' })
  }

  return { path: CATALOG_PDF_PATH }
})
