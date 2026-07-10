import { z } from 'zod'
import { EVENT_TYPES } from '~~/shared/eventTypes'

/** Esquemas zod compartidos entre crear/editar de cada módulo admin. */

export const productSchema = z.object({
  name: z.string().trim().min(2, 'El nombre es demasiado corto').max(120),
  category: z.string().trim().min(1, 'La categoría es obligatoria').max(60),
  description: z.string().max(2000).optional().or(z.literal('')),
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
  description: z.string().max(2000).optional().or(z.literal('')),
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
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  published: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  cover_image_id: z.string().uuid().nullable().optional(),
})

export const galleryImageSchema = z.object({
  album_id: z.string().uuid(),
  storage_path: z.string().min(1),
  alt: z.string().max(200).optional().or(z.literal('')),
  featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
})

export const faqSchema = z.object({
  question: z.string().trim().min(3).max(300),
  answer: z.string().trim().min(3).max(3000),
  category: z.string().max(60).optional().or(z.literal('')),
  published: z.boolean().default(true),
  sort_order: z.number().int().default(0),
})

export const testimonialSchema = z.object({
  author: z.string().trim().min(2).max(120),
  event_type: z.enum(EVENT_TYPES).nullable().optional(),
  quote: z.string().trim().min(3).max(2000),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  source: z.string().max(120).optional().or(z.literal('')),
  published: z.boolean().default(false),
  sort_order: z.number().int().default(0),
})

export const occasionSchema = z.object({
  event_type: z.enum(EVENT_TYPES),
  title: z.string().trim().min(2).max(160),
  intro: z.string().max(3000).optional().or(z.literal('')),
  seo_title: z.string().max(160).optional().or(z.literal('')),
  seo_description: z.string().max(300).optional().or(z.literal('')),
  featured_product_ids: z.array(z.string().uuid()).max(12).default([]),
  published: z.boolean().default(false),
  sort_order: z.number().int().default(0),
})

export const eventSchema = z.object({
  title: z.string().trim().min(2).max(160),
  event_type: z.enum(EVENT_TYPES).nullable().optional(),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha no válida'),
  start_time: z.string().max(8).optional().or(z.literal('')),
  end_time: z.string().max(8).optional().or(z.literal('')),
  location: z.string().max(300).optional().or(z.literal('')),
  client_name: z.string().max(160).optional().or(z.literal('')),
  client_contact: z.string().max(160).optional().or(z.literal('')),
  status: z.enum(['tentativo', 'confirmado', 'completado', 'cancelado']).default('tentativo'),
  notes: z.string().max(2000).optional().or(z.literal('')),
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
  tipo: z.string().max(60).optional().or(z.literal('')),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  invitados: z.string().max(40).optional().or(z.literal('')),
  nombre: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  telefono: z.string().max(30).optional().or(z.literal('')),
  ideas_extra: z.string().max(2000).optional().or(z.literal('')),
  status: z.enum(['nuevo', 'contactado', 'presupuestado', 'ganado', 'perdido']).default('nuevo'),
  notes: z.string().max(2000).optional().or(z.literal('')),
  tags: z.array(z.string().max(40)).max(20).default([]),
})

export const leadActivitySchema = z.object({
  type: z.string().max(40).default('nota'),
  note: z.string().max(2000).optional().or(z.literal('')),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  done: z.boolean().default(false),
})

export const siteContentSchema = z.object({
  data: z.record(z.string(), z.unknown()),
})
