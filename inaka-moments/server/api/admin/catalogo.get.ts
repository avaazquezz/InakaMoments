import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CONFIG_PATH = join(__dirname, '../../data/config.json')

export default defineEventHandler(() => {
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
  return {
    filename: config.catalogo?.filename || null,
    updatedAt: config.catalogo?.updatedAt || null,
  }
})
