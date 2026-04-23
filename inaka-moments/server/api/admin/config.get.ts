import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CONFIG_PATH = join(__dirname, '../../data/config.json')

function getConfig() {
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
}

export default defineEventHandler(() => {
  return getConfig()
})
