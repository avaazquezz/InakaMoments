/**
 * Server plugin: initializes admin password hash on first run.
 * Creates server/data/admin_hash.txt if it doesn't exist.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import bcrypt from 'bcryptjs'
import { defineNuxtPlugin } from 'nuxt'

export default defineNuxtPlugin(async () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const HASH_PATH = join(__dirname, '../data/admin_hash.txt')

  if (!existsSync(HASH_PATH)) {
    // First-time setup: generate hash for default password
    const hash = await bcrypt.hash('inaka2026', 10)
    writeFileSync(HASH_PATH, hash)
    console.log('[InakaMoments] Admin password initialized. Default: inaka2026')
  }
})
