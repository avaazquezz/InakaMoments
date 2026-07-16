import type { NuxtApp } from 'nuxt/app'
import type { Database } from '~/types/database'
import type { Product, Pack, Occasion, Faq, Testimonial } from '~/utils/catalog'

/**
 * Composables de datos públicos (SSR con useAsyncData + anon key).
 * RLS garantiza que solo llega contenido publicado/activo.
 */

/**
 * Por defecto, useAsyncData reutiliza indefinidamente el payload de una
 * key ya usada (incluida una navegación cliente de vuelta a una página ya
 * visitada), así que un cambio hecho en el admin no se vería hasta recargar
 * la pestaña entera. Reutilizamos el payload SOLO durante la hidratación
 * inicial (evita duplicar la petición que el servidor ya hizo) y forzamos
 * refetch en cualquier otra navegación.
 */
function alwaysFreshAfterHydration(key: string, nuxtApp: NuxtApp) {
  return nuxtApp.isHydrating ? nuxtApp.payload.data[key] : undefined
}

/** Imagen de galería con su álbum (solo álbumes publicados vía RLS). */
export interface GalleryItem {
  id: string
  storage_path: string
  alt: string | null
  featured: boolean
  sort_order: number
  album: {
    id: string
    title: string
    event_type: string
    cover_image_id: string | null
  }
}

const GALLERY_SELECT = 'id, storage_path, alt, featured, sort_order, album:event_albums!album_id!inner(id, title, event_type, cover_image_id)'

export function useProducts() {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData('products', async () => {
    const { data, error } = await supabase
      .from('products').select('*').eq('active', true).order('sort_order')
    if (error) throw error
    return data as Product[]
  }, { default: () => [] as Product[], getCachedData: alwaysFreshAfterHydration })
}

export function useProduct(slug: string) {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData(`product-${slug}`, async () => {
    const { data, error } = await supabase
      .from('products').select('*').eq('slug', slug).eq('active', true).maybeSingle()
    if (error) throw error
    return data as Product | null
  }, { getCachedData: alwaysFreshAfterHydration })
}

export function usePacks() {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData('packs', async () => {
    const { data, error } = await supabase
      .from('packs').select('*').eq('active', true).order('sort_order')
    if (error) throw error
    return data as Pack[]
  }, { default: () => [] as Pack[], getCachedData: alwaysFreshAfterHydration })
}

export function usePack(slug: string) {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData(`pack-${slug}`, async () => {
    const { data, error } = await supabase
      .from('packs').select('*').eq('slug', slug).eq('active', true).maybeSingle()
    if (error) throw error
    return data as Pack | null
  }, { getCachedData: alwaysFreshAfterHydration })
}

export function useOccasions() {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData('occasions', async () => {
    const { data, error } = await supabase
      .from('occasions').select('*').eq('published', true).order('sort_order')
    if (error) throw error
    return data as Occasion[]
  }, { default: () => [] as Occasion[], getCachedData: alwaysFreshAfterHydration })
}

export function useOccasion(slug: string) {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData(`occasion-${slug}`, async () => {
    const { data, error } = await supabase
      .from('occasions').select('*').eq('slug', slug).eq('published', true).maybeSingle()
    if (error) throw error
    return data as Occasion | null
  }, { getCachedData: alwaysFreshAfterHydration })
}

export function useFaqs() {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData('faqs', async () => {
    const { data, error } = await supabase
      .from('faqs').select('*').eq('published', true).order('sort_order')
    if (error) throw error
    return data as Faq[]
  }, { default: () => [] as Faq[], getCachedData: alwaysFreshAfterHydration })
}

export function useTestimonials() {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData('testimonials', async () => {
    const { data, error } = await supabase
      .from('testimonials').select('*').eq('published', true).order('sort_order')
    if (error) throw error
    return data as Testimonial[]
  }, { default: () => [] as Testimonial[], getCachedData: alwaysFreshAfterHydration })
}

/** Todas las imágenes de la galería (álbumes publicados). */
export function useGalleryImages() {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData('gallery-images', async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select(GALLERY_SELECT)
      .order('sort_order')
    if (error) throw error
    return (data ?? []) as unknown as GalleryItem[]
  }, { default: () => [] as GalleryItem[], getCachedData: alwaysFreshAfterHydration })
}

/** Imágenes destacadas (carrusel "momentos reales" del home). */
export function useFeaturedImages() {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData('featured-images', async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select(GALLERY_SELECT)
      .eq('featured', true)
      .order('sort_order')
      .limit(10)
    if (error) throw error
    return (data ?? []) as unknown as GalleryItem[]
  }, { default: () => [] as GalleryItem[], getCachedData: alwaysFreshAfterHydration })
}

/**
 * Sección de site_content mezclada con defaults del componente.
 * NUNCA rompe la página: ante error devuelve los defaults.
 */
export function useSiteSection<T extends Record<string, unknown>>(section: string, defaults: T) {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData(`site-content-${section}`, async () => {
    try {
      const { data, error } = await supabase
        .from('site_content').select('data').eq('section', section).maybeSingle()
      if (error) throw error
      return { ...defaults, ...((data?.data as object | null) ?? {}) } as T
    }
    catch (err) {
      console.error(`[site_content:${section}]`, err)
      return defaults
    }
  }, { default: () => defaults, getCachedData: alwaysFreshAfterHydration })
}
