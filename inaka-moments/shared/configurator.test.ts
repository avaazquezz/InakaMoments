import { describe, expect, it } from 'vitest'
import {
  buildCatalog,
  computeQuote,
  DEFAULT_RULES,
  normalizeQty,
  normalizeRules,
  resolveTier,
  round2,
  type PricingPack,
  type PricingProduct,
} from './configurator'

const arco: PricingProduct = {
  id: 'p-arco', name: 'Arco orgánico', slug: 'arco-organico', category: 'estructuras',
  base_price: 50, price_is_from: true, pricing: [], is_rental: false, deposit: null,
}
const columna: PricingProduct = {
  id: 'p-columna', name: 'Columna orgánica', slug: 'columna-organica', category: 'estructuras',
  base_price: 20, price_is_from: true,
  pricing: [{ label: '1 columna', price: 20 }, { label: 'Pack 2', price: 35 }],
  is_rental: false, deposit: null,
}
const cilindros: PricingProduct = {
  id: 'p-cilindros', name: 'Cilindros decorativos', slug: 'cilindros', category: 'estructuras',
  base_price: null, price_is_from: true, pricing: [], is_rental: false, deposit: null,
}
const aroAlquiler: PricingProduct = {
  id: 'p-aro', name: 'Aro completo 360', slug: 'aro-completo-360', category: 'estructuras',
  base_price: 75, price_is_from: true, pricing: [], is_rental: true, deposit: 30,
}
const packBaby: PricingPack = { id: 'pk-baby', name: 'Pack Baby "Dulce Espera"', slug: 'pack-baby-dulce-espera', price: 130 }

const catalog = buildCatalog([arco, columna, cilindros, aroAlquiler], [packBaby])

describe('round2', () => {
  it('evita errores de coma flotante', () => {
    expect(round2(0.1 + 0.2)).toBe(0.3)
  })
})

describe('normalizeQty', () => {
  it('valores por defecto y límites', () => {
    expect(normalizeQty(undefined)).toBe(1)
    expect(normalizeQty('abc')).toBe(1)
    expect(normalizeQty(0)).toBe(1)
    expect(normalizeQty(-5)).toBe(1)
    expect(normalizeQty(3.9)).toBe(3)
    expect(normalizeQty(500)).toBe(99)
  })
})

describe('resolveTier', () => {
  it('sin tramos devuelve null', () => {
    expect(resolveTier(arco)).toBeNull()
  })
  it('label existente resuelve su tramo', () => {
    expect(resolveTier(columna, 'Pack 2')).toEqual({ label: 'Pack 2', price: 35 })
  })
  it('label inexistente cae al primer tramo (defensivo)', () => {
    expect(resolveTier(columna, 'tramo-fantasma')).toEqual({ label: '1 columna', price: 20 })
  })
})

describe('normalizeRules', () => {
  it('usa defaults si el jsonb viene vacío/corrupto', () => {
    expect(normalizeRules(null)).toEqual(DEFAULT_RULES)
    expect(normalizeRules({ desmontaje_precio: 'no-es-numero' })).toEqual(DEFAULT_RULES)
  })
  it('respeta valores válidos', () => {
    expect(normalizeRules({ desmontaje_precio: 20, km_incluidos: 15 }).desmontaje_precio).toBe(20)
  })
})

describe('computeQuote', () => {
  it('producto sin tramos usa base_price', () => {
    const q = computeQuote([{ kind: 'product', id: arco.id, qty: 1 }], {}, DEFAULT_RULES, catalog)
    expect(q.lines[0]).toMatchObject({ unit_price: 50, line_total: 50, consulta: false })
    expect(q.total).toBe(50)
  })

  it('resuelve el tramo elegido de un producto con pricing', () => {
    const q = computeQuote([{ kind: 'product', id: columna.id, qty: 2, tier: 'Pack 2' }], {}, DEFAULT_RULES, catalog)
    expect(q.lines[0]).toMatchObject({ unit_price: 35, line_total: 70 })
  })

  it('"a consultar" no computa en el total y marca hasConsulta', () => {
    const q = computeQuote([{ kind: 'product', id: cilindros.id, qty: 1 }], {}, DEFAULT_RULES, catalog)
    expect(q.lines[0]).toMatchObject({ unit_price: null, line_total: null, consulta: true })
    expect(q.itemsSubtotal).toBe(0)
    expect(q.hasConsulta).toBe(true)
  })

  it('ids inexistentes se ignoran en silencio', () => {
    const q = computeQuote([{ kind: 'product', id: 'no-existe', qty: 1 }], {}, DEFAULT_RULES, catalog)
    expect(q.lines).toHaveLength(0)
  })

  it('packs se suman igual que productos', () => {
    const q = computeQuote([{ kind: 'pack', id: packBaby.id, qty: 1 }], {}, DEFAULT_RULES, catalog)
    expect(q.lines[0]).toMatchObject({ kind: 'pack', unit_price: 130, line_total: 130 })
  })

  it('desmontaje añade el ajuste configurado', () => {
    const q = computeQuote([{ kind: 'product', id: arco.id, qty: 1 }], { desmontaje: true, far: false }, DEFAULT_RULES, catalog)
    expect(q.adjustments).toContainEqual({ key: 'desmontaje', label: 'Desmontaje', amount: 15 })
    expect(q.total).toBe(65)
  })

  it('dentro de los km incluidos no añade plus de gasolina', () => {
    const q = computeQuote([{ kind: 'product', id: arco.id, qty: 1 }], { desmontaje: false, far: false, distanceKm: 10 }, DEFAULT_RULES, catalog)
    expect(q.adjustments).toHaveLength(0)
  })

  it('fuera de los km incluidos añade gasolina "a consultar" (no computa)', () => {
    const q = computeQuote([{ kind: 'product', id: arco.id, qty: 1 }], { desmontaje: false, far: false, distanceKm: 45 }, DEFAULT_RULES, catalog)
    expect(q.adjustments[0]).toMatchObject({ key: 'gasolina', amount: null })
    expect(q.hasConsulta).toBe(true)
    expect(q.total).toBe(50) // el ajuste sin precio no altera el total numérico
  })

  it('detallito gratis a partir del umbral', () => {
    const bajoUmbral = computeQuote([{ kind: 'product', id: arco.id, qty: 1 }], {}, DEFAULT_RULES, catalog)
    expect(bajoUmbral.detallito).toBe(false)

    const sobreUmbral = computeQuote([{ kind: 'product', id: arco.id, qty: 3 }], {}, DEFAULT_RULES, catalog) // 150€
    expect(sobreUmbral.detallito).toBe(true)
  })

  it('alquiler marca hasRental y conserva la fianza en la línea', () => {
    const q = computeQuote([{ kind: 'product', id: aroAlquiler.id, qty: 1 }], {}, DEFAULT_RULES, catalog)
    expect(q.hasRental).toBe(true)
    expect(q.lines[0]).toMatchObject({ is_rental: true, deposit: 30 })
  })
})
