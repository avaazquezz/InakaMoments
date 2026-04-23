import { readBody } from 'h3'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CONFIG_PATH = join(__dirname, '../../../data/config.json')

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { galeria } = body

  if (!Array.isArray(galeria)) {
    throw createError({ statusCode: 400, message: 'Invalid galeria data' })
  }

  // Keep only 6 slots
  const trimmed = galeria.slice(0, 6).map((item: any, i: number) => ({
    url: item.url || '',
    alt: item.alt || '',
    categoria: item.categoria || '',
  }))

  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
  config.galeria = trimmed
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))

  return { success: true, galeria: trimmed }
})