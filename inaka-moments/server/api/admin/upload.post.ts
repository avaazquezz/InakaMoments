import sharp from 'sharp'

/**
 * POST /api/admin/upload — sube una imagen a Storage (galería o catálogo).
 * Pipeline: valida auth+tamaño → sharp (auto-rota por EXIF, redimensiona,
 * recomprime a WebP) → sube con service_role. La ausencia de `.withMetadata()`
 * ya elimina EXIF/GPS del resultado, sin paso extra.
 */

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB, igual que el límite de los buckets de imágenes
const ALLOWED_BUCKETS = ['gallery', 'catalog-media'] as const
type AllowedBucket = (typeof ALLOWED_BUCKETS)[number]

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const form = await readMultipartFormData(event)
  if (!form) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'No se ha recibido ningún archivo.' })
  }

  const bucket = form.find(f => f.name === 'bucket')?.data.toString('utf-8')
  const file = form.find(f => f.name === 'file')

  if (!bucket || !ALLOWED_BUCKETS.includes(bucket as AllowedBucket)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Bucket no válido.' })
  }
  if (!file?.data?.length) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'No se ha recibido ningún archivo.' })
  }
  if (file.data.length > MAX_SIZE) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'La imagen no puede superar los 10 MB.' })
  }

  let output: Buffer
  try {
    output = await sharp(file.data)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
  }
  catch (err) {
    console.error('[admin/upload] archivo no es una imagen válida:', err)
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'El archivo no es una imagen válida.' })
  }

  const path = `${crypto.randomUUID()}.webp`
  const supabase = useSupabaseAdmin(event)
  const { error } = await supabase.storage.from(bucket).upload(path, output, {
    contentType: 'image/webp',
    upsert: false,
  })

  if (error) {
    console.error('[admin/upload] error subiendo imagen:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido subir la imagen.' })
  }

  return { path }
})
