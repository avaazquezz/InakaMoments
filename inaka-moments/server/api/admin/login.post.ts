import { readBody } from 'h3'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DATA_DIR = join(__dirname, '../data')
const ADMIN_HASH_PATH = join(DATA_DIR, 'admin_hash.txt')

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { password } = body

  if (!password) {
    throw createError({ statusCode: 400, message: 'Password required' })
  }

  // Ensure data directory and hash file exist (first-time setup)
  if (!existsSync(DATA_DIR)) {
    writeFileSync(DATA_DIR, '', { flag: 'a' })
  }
  if (!existsSync(ADMIN_HASH_PATH)) {
    const hash = await bcrypt.hash('inaka2026', 10)
    writeFileSync(ADMIN_HASH_PATH, hash)
  }

  const hash = readFileSync(ADMIN_HASH_PATH, 'utf-8').trim()
  const valid = await bcrypt.compare(password, hash)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Contraseña incorrecta' })
  }

  const token = Buffer.from(`${Date.now()}:admin`).toString('base64')
  return { token }
})
