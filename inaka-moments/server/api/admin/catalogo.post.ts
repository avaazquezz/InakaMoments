import { readMultipartFormData } from 'h3'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CATALOGO_DIR = join(__dirname, '../../../public/uploads/inaka/catalogo')

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: 'No file received' })
  }

  const file = formData[0]
  if (!file.filename || !file.filename.endsWith('.pdf')) {
    throw createError({ statusCode: 400, message: 'Solo se aceptan archivos PDF' })
  }

  if (!existsSync(CATALOGO_DIR)) {
    mkdirSync(CATALOGO_DIR, { recursive: true })
  }

  const filename = `catalogo-${Date.now()}.pdf`
  const filepath = join(CATALOGO_DIR, filename)
  writeFileSync(filepath, file.data)

  // Update config
  const { readFileSync, writeFileSync } = await import('fs')
  const CONFIG_PATH = join(__dirname, '../../data/config.json')
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
  config.catalogo = {
    filename: `/uploads/inaka/catalogo/${filename}`,
    updatedAt: new Date().toISOString(),
  }
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')

  return { filename: config.catalogo.filename }
})
