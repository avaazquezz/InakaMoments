import { z } from 'zod'
import { EVENT_TYPES } from '~~/shared/eventTypes'

/**
 * Esquemas zod compartidos entre crear/editar de cada módulo admin.
 *
 * Los campos de texto opcionales usan `.optional().or(z.literal('')).nullable()`
 * a propósito: las columnas correspondientes son nullable en Postgres, así que
 * un GET siempre puede devolver `null` (nunca `''`), y el flujo editar→guardar
 * reenvía ese mismo objeto en el PATCH. Sin `.nullable()` aquí, cualquier
 * edición de una fila con ese campo vacío falla la validación.
 */

export const productSchema = z.object({
  name: z.string().trim().min(2, 'El nombre es demasiado corto').max(120),
  category: z.string().trim().min(1, 'La categoría es obligatoria').max(60),
  description: z.string().max(2000).optional().or(z.literal('')).nullable(),
  base_price: z.number().min(0).nullable(),
  price_is_from: z.boolean().default(true),
  pricing: z.array(z.object({ label: z.string().min(1).max(60), price: z.number().min(0) })).max(20).default([]),
  sizes: z.array(z.string().min(1).max(40)).max(20).default([]),
  options: z.array(z.string().min(1).max(40)).max(20).default([]),
  event_types: z.array(z.enum(EVENT_TYPES)).default([]),
  is_rental: z.boolean().default(false),
  deposit: z.number().min(0).default(0),
  stock: z.number().int().min(0).default(1),
  images: z.array(z.string()).max(20).default([]),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
})

export const packSchema = z.object({
  name: z.string().trim().min(2, 'El nombre es demasiado corto').max(120),
  description: z.string().max(2000).optional().or(z.literal('')).nullable(),
  price: z.number().min(0).nullable(),
  includes: z.array(z.string().min(1).max(120)).max(30).default([]),
  event_types: z.array(z.enum(EVENT_TYPES)).default([]),
  images: z.array(z.string()).max(20).default([]),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
})

export const albumSchema = z.object({
  title: z.string().trim().min(2).max(120),
  event_type: z.enum(EVENT_TYPES),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')).nullable(),
  published: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  cover_image_id: z.string().uuid().nullable().optional(),
})

export const galleryImageSchema = z.object({
  album_id: z.string().uuid(),
  storage_path: z.string().min(1),
  alt: z.string().max(200).optional().or(z.literal('')).nullable(),
  featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
})

export const faqSchema = z.object({
  question: z.string().trim().min(3).max(300),
  answer: z.string().trim().min(3).max(3000),
  category: z.string().max(60).optional().or(z.literal('')).nullable(),
  published: z.boolean().default(true),
  sort_order: z.number().int().default(0),
})

export const testimonialSchema = z.object({
  author: z.string().trim().min(2).max(120),
  event_type: z.enum(EVENT_TYPES).nullable().optional(),
  quote: z.string().trim().min(3).max(2000),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  source: z.string().max(120).optional().or(z.literal('')).nullable(),
  published: z.boolean().default(false),
  sort_order: z.number().int().default(0),
})

export const occasionSchema = z.object({
  event_type: z.enum(EVENT_TYPES),
  title: z.string().trim().min(2).max(160),
  intro: z.string().max(3000).optional().or(z.literal('')).nullable(),
  seo_title: z.string().max(160).optional().or(z.literal('')).nullable(),
  seo_description: z.string().max(300).optional().or(z.literal('')).nullable(),
  featured_product_ids: z.array(z.string().uuid()).max(12).default([]),
  published: z.boolean().default(false),
  sort_order: z.number().int().default(0),
})

export const eventSchema = z.object({
  title: z.string().trim().min(2).max(160),
  event_type: z.enum(EVENT_TYPES).nullable().optional(),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha no válida'),
  start_time: z.string().max(8).optional().or(z.literal('')).nullable(),
  end_time: z.string().max(8).optional().or(z.literal('')).nullable(),
  location: z.string().max(300).optional().or(z.literal('')).nullable(),
  client_name: z.string().max(160).optional().or(z.literal('')).nullable(),
  client_contact: z.string().max(160).optional().or(z.literal('')).nullable(),
  status: z.enum(['tentativo', 'confirmado', 'completado', 'cancelado']).default('tentativo'),
  notes: z.string().max(2000).optional().or(z.literal('')).nullable(),
})

export const rentalBookingSchema = z.object({
  product_id: z.string().uuid(),
  event_id: z.string().uuid().nullable().optional(),
  date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  deposit_amount: z.number().min(0).default(0),
  deposit_status: z.enum(['pendiente', 'pagado', 'reembolsado', 'fallido']).default('pendiente'),
})

export const leadSchema = z.object({
  tipo: z.string().max(60).optional().or(z.literal('')).nullable(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')).nullable(),
  invitados: z.string().max(40).optional().or(z.literal('')).nullable(),
  nombre: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  telefono: z.string().max(30).optional().or(z.literal('')).nullable(),
  ideas_extra: z.string().max(2000).optional().or(z.literal('')).nullable(),
  status: z.enum(['nuevo', 'contactado', 'presupuestado', 'ganado', 'perdido']).default('nuevo'),
  notes: z.string().max(2000).optional().or(z.literal('')).nullable(),
  tags: z.array(z.string().max(40)).max(20).default([]),
})

export const leadActivitySchema = z.object({
  type: z.string().max(40).default('nota'),
  note: z.string().max(2000).optional().or(z.literal('')).nullable(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')).nullable(),
  done: z.boolean().default(false),
})

export const siteContentSchema = z.object({
  data: z.record(z.string(), z.unknown()),
})

// Únicas secciones de site_content editables desde el panel — Textos web
// (hero/about/footer/contacto) se retiró deliberadamente de la UI para el
// traspaso a un segundo admin no técnico; este guard cierra también la API
// para que no sea saltable con una llamada directa.
export const ADMIN_EDITABLE_SITE_CONTENT_SECTIONS = ['settings'] as const
