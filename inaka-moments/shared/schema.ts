// ═════════════════════════════════════════════════════════════════════════
// Inaka Moments — Constructores de datos estructurados (JSON-LD / schema.org)
//
// Módulo PURO y sin dependencias (mismo patrón que shared/configurator.ts y
// shared/dates.ts): no toca useHead/useRuntimeConfig, así que se puede
// testear con Vitest sin contexto Nuxt. app/composables/useJsonLd.ts es el
// que conecta esto a <head>.
// ═════════════════════════════════════════════════════════════════════════

const CONTEXT = 'https://schema.org' as const

export interface SchemaProduct {
  name: string
  description: string | null
  base_price: number | null
}

export interface SchemaPack {
  name: string
  description: string | null
  price: number | null
}

export interface SchemaFaq {
  question: string
  answer: string
}

export interface SchemaTestimonial {
  author: string
  quote: string
  rating: number | null
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface OpeningHours {
  dayOfWeek: string[]
  opens: string
  closes: string
}

export interface LocalBusinessNap {
  name: string
  url: string
  logoUrl: string
  email?: string | null
  telephone?: string | null
  addressLocality: string
  addressRegion: string
  addressCountry: string
  areaServed: string[]
  sameAs?: string[]
  openingHours?: OpeningHours[]
}

export function buildLocalBusinessSchema(nap: LocalBusinessNap): Record<string, unknown> {
  return {
    '@context': CONTEXT,
    '@type': 'LocalBusiness',
    '@id': `${nap.url}/#negocio`,
    'name': nap.name,
    'url': nap.url,
    'image': nap.logoUrl,
    'logo': nap.logoUrl,
    ...(nap.email ? { email: nap.email } : {}),
    ...(nap.telephone ? { telephone: nap.telephone } : {}),
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': nap.addressLocality,
      'addressRegion': nap.addressRegion,
      'addressCountry': nap.addressCountry,
    },
    'areaServed': nap.areaServed.map(name => ({ '@type': 'Place', name })),
    ...(nap.openingHours?.length
      ? {
          openingHoursSpecification: nap.openingHours.map(h => ({
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': h.dayOfWeek,
            'opens': h.opens,
            'closes': h.closes,
          })),
        }
      : {}),
    ...(nap.sameAs?.length ? { sameAs: nap.sameAs } : {}),
  }
}

function buildOfferSchema(price: number | null, url: string): Record<string, unknown> {
  return {
    '@type': 'Offer',
    url,
    'priceCurrency': 'EUR',
    'availability': 'https://schema.org/InStock',
    // price ausente = "a consultar": Google tolera un Offer sin precio antes
    // que publicar un precio inventado.
    ...(price != null ? { price } : {}),
  }
}

function buildProductLikeSchema(
  input: { name: string, description: string | null, price: number | null },
  opts: { url: string, imageUrl?: string | null },
): Record<string, unknown> {
  return {
    '@context': CONTEXT,
    '@type': 'Product',
    'name': input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(opts.imageUrl ? { image: opts.imageUrl } : {}),
    'url': opts.url,
    'offers': buildOfferSchema(input.price, opts.url),
  }
}

export function buildProductSchema(p: SchemaProduct, opts: { url: string, imageUrl?: string | null }): Record<string, unknown> {
  return buildProductLikeSchema({ name: p.name, description: p.description, price: p.base_price }, opts)
}

export function buildPackSchema(pk: SchemaPack, opts: { url: string, imageUrl?: string | null }): Record<string, unknown> {
  return buildProductLikeSchema({ name: pk.name, description: pk.description, price: pk.price }, opts)
}

/** null si no hay FAQs — no emitir el schema sin contenido real. */
export function buildFaqPageSchema(faqs: SchemaFaq[]): Record<string, unknown> | null {
  if (!faqs.length) return null
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    'mainEntity': faqs.map(f => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': { '@type': 'Answer', 'text': f.answer },
    })),
  }
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'name': item.name,
      'item': item.url,
    })),
  }
}

/** null si no hay reseñas puntuadas — Google penaliza un AggregateRating sin datos reales. */
export function buildAggregateRatingSchema(testimonials: SchemaTestimonial[]): Record<string, unknown> | null {
  const rated = testimonials.filter(t => typeof t.rating === 'number')
  if (!rated.length) return null
  const avg = rated.reduce((s, t) => s + (t.rating as number), 0) / rated.length
  return {
    '@type': 'AggregateRating',
    'ratingValue': Math.round(avg * 10) / 10,
    'reviewCount': rated.length,
    'bestRating': 5,
    'worstRating': 1,
  }
}

function buildReviewSchema(t: SchemaTestimonial): Record<string, unknown> {
  return {
    '@type': 'Review',
    'author': { '@type': 'Person', 'name': t.author },
    'reviewBody': t.quote,
    ...(t.rating != null ? { reviewRating: { '@type': 'Rating', 'ratingValue': t.rating, 'bestRating': 5, 'worstRating': 1 } } : {}),
  }
}

/** LocalBusiness con aggregateRating + reviews embebidas; null si aún no hay reseñas publicadas. */
export function buildBusinessReviewsSchema(
  businessName: string,
  businessUrl: string,
  testimonials: SchemaTestimonial[],
): Record<string, unknown> | null {
  const aggregateRating = buildAggregateRatingSchema(testimonials)
  if (!aggregateRating) return null
  return {
    '@context': CONTEXT,
    '@type': 'LocalBusiness',
    'name': businessName,
    'url': businessUrl,
    aggregateRating,
    'review': testimonials.map(buildReviewSchema),
  }
}
