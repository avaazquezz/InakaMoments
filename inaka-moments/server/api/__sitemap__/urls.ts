import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~~/app/types/database'

/**
 * Fuente dinámica del sitemap (fichas de producto/pack). Registrada en
 * nuxt.config.ts (`sitemap.sources`). Cliente anon: RLS ya filtra
 * active=true, así que no hace falta service_role para esta lectura pública.
 */
export default defineSitemapEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event)

  const [{ data: products }, { data: packs }] = await Promise.all([
    supabase.from('products').select('slug, updated_at').eq('active', true),
    supabase.from('packs').select('slug, updated_at').eq('active', true),
  ])

  return [
    ...(products ?? []).map(p => ({ loc: `/catalogo/${p.slug}`, lastmod: p.updated_at, priority: 0.7 })),
    ...(packs ?? []).map(p => ({ loc: `/packs/${p.slug}`, lastmod: p.updated_at, priority: 0.7 })),
  ]
})
