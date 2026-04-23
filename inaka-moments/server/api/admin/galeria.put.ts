import { readBody } from 'h3'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CONFIG_PATH = join(__dirname, '../../data/config.json')

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
  config.galeria = body.galeria || []
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')
  return { ok: true }
})
