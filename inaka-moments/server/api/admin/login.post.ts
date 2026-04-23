import { readBody } from 'h3'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const CONFIG_PATH = join(__dirname, '../data/config.json')
const ADMIN_HASH_PATH = join(__dirname, '../data/admin_hash.txt')

function getConfig() {
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { password } = body

  if (!password) {
    throw createError({ statusCode: 400, message: 'Password required' })
  }

  let hash = ''
  try {
    hash = readFileSync(ADMIN_HASH_PATH, 'utf-8').trim()
  } catch {
    // First-time setup: use default password and generate hash
    hash = await bcrypt.hash('inaka2026', 10)
    import('fs').then(fs => fs.writeFileSync(ADMIN_HASH_PATH, hash))
  }

  const valid = await bcrypt.compare(password, hash)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Contraseña incorrecta' })
  }

  // Return a simple session token (in production use JWT or proper sessions)
  const token = Buffer.from(`${Date.now()}:admin`).toString('base64')
  return { token }
})
