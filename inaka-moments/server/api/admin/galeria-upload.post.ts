import { readMultipartFormData } from 'h3'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const GALERIA_DIR = join(__dirname, '../../../public/uploads/inaka/galeria')
const THUMB_DIR = join(__dirname, '../../../public/uploads/inaka/galeria/thumbs')

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: 'No file received' })
  }

  const file = formData[0]
  if (!file.filename || !file.type?.startsWith('image/')) {
    throw createError({ statusCode: 400, message: 'Solo se aceptan imágenes' })
  }

  if (!existsSync(GALERIA_DIR)) mkdirSync(GALERIA_DIR, { recursive: true })
  if (!existsSync(THUMB_DIR)) mkdirSync(THUMB_DIR, { recursive: true })

  const ext = file.filename.split('.').pop() || 'jpg'
  const base = `img-${Date.now()}`
  const thumbPath = join(THUMB_DIR, `${base}-thumb.${ext}`)
  const fullPath = join(GALERIA_DIR, `${base}-full.${ext}`)

  // Generate thumbnail (300x375 cropped)
  const thumb = await sharp(file.data).resize(300, 375, { fit: 'cover' }).toFile(thumbPath)
  // Keep full size (max 1200px wide)
  await sharp(file.data).resize(1200, null, { withoutEnlargement: true }).toFile(fullPath)

  return {
    url: `/uploads/inaka/galeria/${base}-full.${ext}`,
    thumb: `/uploads/inaka/galeria/thumbs/${base}-thumb.${ext}`,
    filename: `${base}-full.${ext}`,
  }
})
