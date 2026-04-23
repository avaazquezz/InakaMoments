import { readBody } from 'h3'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CONFIG_PATH = join(__dirname, '../../data/config.json')

function getConfig() {
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
}

function saveConfig(data: any) {
  writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = getConfig()

  // Merge contact
  if (body.contact) {
    config.contact = { ...config.contact, ...body.contact }
  }

  // Merge texts (deep merge)
  if (body.texts) {
    config.texts = {
      hero: { ...config.texts.hero, ...(body.texts.hero || {}) },
      about: { ...config.texts.about, ...(body.texts.about || {}) },
      footer: { ...config.texts.footer, ...(body.texts.footer || {}) },
    }
  }

  saveConfig(config)
  return { ok: true }
})
