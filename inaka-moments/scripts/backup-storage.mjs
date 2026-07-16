// Descarga el contenido de los buckets públicos de Supabase Storage a
// storage-backup/<bucket>/ — usado por .github/workflows/backup.yml (sube el
// resultado como artifact junto al dump de la BD). Sin dependencias nuevas:
// mismo patrón list+download por REST usado durante el desarrollo de esta fase.
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const BUCKETS = ['gallery', 'catalog-media', 'catalog']
const OUT_DIR = 'storage-backup'

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Faltan SUPABASE_URL / SUPABASE_SERVICE_KEY.')
  process.exit(1)
}

const headers = {
  apikey: SUPABASE_SERVICE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
}

async function listObjects(bucket) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${bucket}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: '', limit: 1000, sortBy: { column: 'name', order: 'asc' } }),
  })
  if (!res.ok) throw new Error(`list ${bucket}: ${res.status} ${await res.text()}`)
  return res.json()
}

async function downloadObject(bucket, name) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${encodeURIComponent(name)}`, { headers })
  if (!res.ok) throw new Error(`download ${bucket}/${name}: ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

for (const bucket of BUCKETS) {
  const objects = await listObjects(bucket)
  const bucketDir = path.join(OUT_DIR, bucket)
  await mkdir(bucketDir, { recursive: true })
  console.log(`${bucket}: ${objects.length} objetos`)
  for (const obj of objects) {
    const data = await downloadObject(bucket, obj.name)
    await writeFile(path.join(bucketDir, obj.name), data)
  }
}

console.log('Backup de Storage completo.')
