/**
 * Composable that provides Inaka Moments configuration
 * (galeria, textos, contacto, catalogo) reactive.
 *
 * Call useInakaConfig() in components. It auto-fetches from the API.
 * Cache is invalidated after admin saves so next page load gets fresh data.
 */

export interface GaleriaItem {
  url: string
  alt: string
  categoria: string
}

export interface Contact {
  email: string
  whatsapp: string
  ubicacion: string
  instagram: string
}

export interface Texts {
  hero: {
    tagline: string
    titulo: string
    titulo_span: string
    subtitulo: string
    cta_principal: string
    cta_secundario: string
  }
  about: {
    titulo_principal: string
    titulo_secundario: string
    parrafo_1: string
    parrafo_2: string
    quote: string
    cta_enlace: string
  }
  footer: {
    tagline_titulo: string
    tagline_span: string
    tagline_sub: string
  }
}

export interface InakaConfig {
  contact: Contact
  texts: Texts
  galeria: GaleriaItem[]
  catalogo: { filename: string | null; updatedAt: string | null }
}

// Simple in-memory cache (resets on server restart — fine for MVP)
let _cache: InakaConfig | null = null
let _cacheTime = 0
const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

export function useInakaConfig() {
  async function fetchConfig(): Promise<InakaConfig | null> {
    const now = Date.now()
    if (_cache && (now - _cacheTime) < CACHE_TTL) {
      return _cache
    }
    try {
      const data = await $fetch<InakaConfig>('/api/admin/config')
      _cache = data
      _cacheTime = now
      return data
    } catch {
      return _cache // return stale cache on error rather than nothing
    }
  }

  function invalidateCache() {
    _cache = null
    _cacheTime = 0
  }

  return { fetchConfig, invalidateCache }
}