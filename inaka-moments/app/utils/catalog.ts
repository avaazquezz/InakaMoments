import type { Tables } from '~/types/database'

export type Product = Tables<'products'>
export type Pack = Tables<'packs'>
export type Occasion = Tables<'occasions'>
export type Faq = Tables<'faqs'>
export type Testimonial = Tables<'testimonials'>

/** Tramo de precio de un producto: [{"label":"1 columna","price":20}, …] */
export interface PriceTier {
  label: string
  price: number
}

/** Etiquetas en castellano de la taxonomía de ocasiones (enum event_type). */
export const EVENT_TYPE_LABELS: Record<string, string> = {
  cumpleanos: 'Cumpleaños',
  baby_shower: 'Baby Shower',
  bautizo: 'Bautizo',
  comunion: 'Comunión',
  graduacion: 'Graduación',
  despedida: 'Despedida',
  jubilacion: 'Jubilación',
  corporativo: 'Corporativo',
  boda: 'Boda',
  otro: 'Otro',
}

/** Etiquetas de las categorías del catálogo. */
export const CATEGORY_LABELS: Record<string, string> = {
  'estructuras': 'Estructuras de globos',
  'globos': 'Globos de helio',
  'led': 'Letreros y números LED',
  'baby': 'Baby',
  'flores': 'Flores',
  'extras': 'Extras',
  'detalles': 'Detalles para invitados',
  'mesa-dulce': 'Mesa dulce',
}

export function formatEUR(n: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n)
}

/** "Desde 50 €" · "20 €" · "A consultar" */
export function productPriceLabel(p: Product): string {
  if (p.base_price == null) return 'A consultar'
  return p.price_is_from ? `Desde ${formatEUR(p.base_price)}` : formatEUR(p.base_price)
}

/** Lectura segura de columnas jsonb que contienen arrays. */
export function jsonArray<T = string>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : []
}

export const productTiers = (p: Product) => jsonArray<PriceTier>(p.pricing)
export const productSizes = (p: Product) => jsonArray(p.sizes)
export const productOptions = (p: Product) => jsonArray(p.options)
export const productEventTypes = (p: Product) => jsonArray(p.event_types)
export const packIncludes = (p: Pack) => jsonArray(p.includes)

/** ¿El producto aplica a una ocasión? ([] = aplica a todas) */
export function productMatchesEventType(p: Product, eventType: string): boolean {
  const types = productEventTypes(p)
  return types.length === 0 || types.includes(eventType)
}

/**
 * Resuelve la URL pública de una imagen de Storage.
 * Admite URL absoluta (placeholders) o ruta relativa dentro del bucket.
 */
export function storagePublicUrl(bucket: string, path: string): string {
  if (/^https?:\/\//.test(path)) return path
  const base = useRuntimeConfig().public.supabase.url
  return `${base}/storage/v1/object/public/${bucket}/${path}`
}
