import { describe, expect, it } from 'vitest'
import { buildAggregateRatingSchema, buildBusinessReviewsSchema, buildFaqPageSchema, buildProductSchema } from './schema'

describe('buildAggregateRatingSchema', () => {
  it('devuelve null sin reseñas puntuadas (no inventar datos)', () => {
    expect(buildAggregateRatingSchema([])).toBeNull()
    expect(buildAggregateRatingSchema([{ author: 'A', quote: 'x', rating: null }])).toBeNull()
  })
  it('calcula la media redondeada a 1 decimal', () => {
    const r = buildAggregateRatingSchema([
      { author: 'A', quote: 'x', rating: 5 },
      { author: 'B', quote: 'y', rating: 4 },
    ])
    expect(r).toMatchObject({ ratingValue: 4.5, reviewCount: 2, bestRating: 5 })
  })
})

describe('buildBusinessReviewsSchema', () => {
  it('devuelve null si no hay reseñas (la sección de la home se autooculta igual)', () => {
    expect(buildBusinessReviewsSchema('Inaka Moments', 'https://inakamoments.com', [])).toBeNull()
  })
})

describe('buildFaqPageSchema', () => {
  it('devuelve null sin FAQs', () => {
    expect(buildFaqPageSchema([])).toBeNull()
  })
  it('mapea question/answer a Question/acceptedAnswer', () => {
    const schema = buildFaqPageSchema([{ question: '¿Zona?', answer: 'Baix Llobregat' }])
    expect(schema?.mainEntity).toEqual([
      { '@type': 'Question', 'name': '¿Zona?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Baix Llobregat' } },
    ])
  })
})

describe('buildProductSchema', () => {
  it('omite `price` en el Offer cuando base_price es null ("a consultar")', () => {
    const schema = buildProductSchema(
      { name: 'Cilindros', description: null, base_price: null },
      { url: 'https://inakamoments.com/catalogo/cilindros' },
    )
    expect(schema.offers).not.toHaveProperty('price')
  })
  it('incluye price cuando existe', () => {
    const schema = buildProductSchema(
      { name: 'Arco orgánico', description: null, base_price: 50 },
      { url: 'https://inakamoments.com/catalogo/arco-organico' },
    )
    expect(schema.offers).toMatchObject({ price: 50, priceCurrency: 'EUR' })
  })
})
