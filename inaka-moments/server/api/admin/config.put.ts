import { readBody } from 'h3'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CONFIG_PATH = join(__dirname, '../../../data/config.json')

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { texts, contact } = body

  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))

  if (texts) {
    if (!config.texts) config.texts = {}
    if (texts.hero) config.texts.hero = { ...config.texts.hero, ...texts.hero }
    if (texts.about) config.texts.about = { ...config.texts.about, ...texts.about }
    if (texts.footer) config.texts.footer = { ...config.texts.footer, ...texts.footer }
  }

  if (contact) {
    config.contact = { ...config.contact, ...contact }
  }

  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))

  return { success: true }
})