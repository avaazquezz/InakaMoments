import type { Database } from '~/types/database'
import type { Product, Pack, Occasion, Faq, Testimonial } from '~/utils/catalog'

/**
 * Composables de datos públicos (SSR con useAsyncData + anon key).
 * RLS garantiza que solo llega contenido publicado/activo.
 */

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
  }
}

const GALLERY_SELECT = 'id, storage_path, alt, featured, sort_order, album:event_albums!album_id!inner(id, title, event_type)'

export function useProducts() {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData('products', async () => {
    const { data, error } = await supabase
      .from('products').select('*').eq('active', true).order('sort_order')
    if (error) throw error
    return data as Product[]
  }, { default: () => [] as Product[] })
}

export function useProduct(slug: string) {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData(`product-${slug}`, async () => {
    const { data, error } = await supabase
      .from('products').select('*').eq('slug', slug).eq('active', true).maybeSingle()
    if (error) throw error
    return data as Product | null
  })
}

export function usePacks() {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData('packs', async () => {
    const { data, error } = await supabase
      .from('packs').select('*').eq('active', true).order('sort_order')
    if (error) throw error
    return data as Pack[]
  }, { default: () => [] as Pack[] })
}

export function usePack(slug: string) {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData(`pack-${slug}`, async () => {
    const { data, error } = await supabase
      .from('packs').select('*').eq('slug', slug).eq('active', true).maybeSingle()
    if (error) throw error
    return data as Pack | null
  })
}

export function useOccasions() {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData('occasions', async () => {
    const { data, error } = await supabase
      .from('occasions').select('*').eq('published', true).order('sort_order')
    if (error) throw error
    return data as Occasion[]
  }, { default: () => [] as Occasion[] })
}

export function useOccasion(slug: string) {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData(`occasion-${slug}`, async () => {
    const { data, error } = await supabase
      .from('occasions').select('*').eq('slug', slug).eq('published', true).maybeSingle()
    if (error) throw error
    return data as Occasion | null
  })
}

export function useFaqs() {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData('faqs', async () => {
    const { data, error } = await supabase
      .from('faqs').select('*').eq('published', true).order('sort_order')
    if (error) throw error
    return data as Faq[]
  }, { default: () => [] as Faq[] })
}

export function useTestimonials() {
  const supabase = useSupabaseClient<Database>()
  return useAsyncData('testimonials', async () => {
    const { data, error } = await supabase
      .from('testimonials').select('*').eq('published', true).order('sort_order')
    if (error) throw error
    return data as Testimonial[]
  }, { default: () => [] as Testimonial[] })
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
  }, { default: () => [] as GalleryItem[] })
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
  }, { default: () => [] as GalleryItem[] })
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
  }, { default: () => defaults })
}
