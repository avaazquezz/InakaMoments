// ═════════════════════════════════════════════════════════════════════════
// Inaka Moments — Motor de precios del CONFIGURADOR (Fase 3)
//
// Módulo PURO y sin dependencias: se importa tal cual en el cliente
// (app/composables/useConfigurator.ts, página) y en el servidor
// (server/api/quotes.post.ts). El cliente lo usa para el precio "en vivo";
// el servidor lo usa como ÚNICA fuente de verdad al persistir (nunca confía
// en los precios que envía el navegador → recalcula desde la BD).
//
// Reglas del catálogo 2026 (§0.1 de la guía), configurables desde
// site_content.settings: montaje incluido; desmontaje +15€; >30 km → plus
// gasolina (a consultar); >120€ → detallito gratis; alquiler → fianza.
// ═════════════════════════════════════════════════════════════════════════

/** Lectura segura de un jsonb que debería ser un array (self-contained). */
function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : []
}

/** Redondeo a 2 decimales sin errores de coma flotante. */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

/** Tramo de precio de un producto: {"label":"Pack 2","price":35}. */
export interface PriceTier {
  label: string
  price: number
}

/** Subconjunto de columnas de `products` necesario para calcular precio. */
export interface PricingProduct {
  id: string
  name: string
  slug: string
  category?: string
  base_price: number | null
  price_is_from: boolean
  pricing: unknown
  sizes?: unknown
  options?: unknown
  is_rental: boolean
  deposit: number | null
}

/** Subconjunto de columnas de `packs` necesario para calcular precio. */
export interface PricingPack {
  id: string
  name: string
  slug: string
  price: number | null
}

// ── Reglas de negocio (site_content.settings) ──────────────────────────────

export interface ConfiguratorRules {
  /** Plus por desmontaje (€). */
  desmontaje_precio: number
  /** Umbral (€) a partir del cual se regala un detallito. */
  umbral_detallito: number
  /** Km incluidos sin plus de gasolina. */
  km_incluidos: number
  /** Antelación mínima para agendar (días). */
  antelacion_dias: number
}

export const DEFAULT_RULES: ConfiguratorRules = {
  desmontaje_precio: 15,
  umbral_detallito: 120,
  km_incluidos: 30,
  antelacion_dias: 30,
}

/** Sanea el jsonb `settings` a reglas numéricas con defaults seguros. */
export function normalizeRules(raw: Record<string, unknown> | null | undefined): ConfiguratorRules {
  const num = (v: unknown, d: number) =>
    typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : d
  return {
    desmontaje_precio: num(raw?.desmontaje_precio, DEFAULT_RULES.desmontaje_precio),
    umbral_detallito: num(raw?.umbral_detallito, DEFAULT_RULES.umbral_detallito),
    km_incluidos: num(raw?.km_incluidos, DEFAULT_RULES.km_incluidos),
    antelacion_dias: num(raw?.antelacion_dias, DEFAULT_RULES.antelacion_dias),
  }
}

// ── Selección del usuario (lo mínimo que viaja al servidor) ────────────────

export interface SelectedLine {
  kind: 'product' | 'pack'
  id: string
  qty: number
  /** Etiqueta del tramo elegido (productos con `pricing`). */
  tier?: string | null
  /** Tamaño elegido (no altera precio; se guarda como atributo). */
  size?: string | null
  /** Opciones elegidas (no alteran precio; se guardan como atributos). */
  options?: string[]
}

export interface ConfiguratorOptions {
  /** Añadir desmontaje (+desmontaje_precio). */
  desmontaje: boolean
  /** Evento a más de `km_incluidos` km → plus de gasolina a consultar. */
  far: boolean
}

// ── Resultado calculado ────────────────────────────────────────────────────

export interface ComputedLine {
  kind: 'product' | 'pack'
  id: string
  name: string
  slug: string
  /** Etiqueta completa (nombre + tramo/tamaño) para mostrar y guardar. */
  label: string
  qty: number
  tier: string | null
  size: string | null
  options: string[]
  /** null = "a consultar" (no computa en el total). */
  unit_price: number | null
  line_total: number | null
  consulta: boolean
  is_rental: boolean
  deposit: number | null
}

export interface Adjustment {
  key: string
  label: string
  /** null = "a consultar" (no computa en el total). */
  amount: number | null
  note?: string
}

export interface ComputedQuote {
  lines: ComputedLine[]
  /** Suma de las líneas con precio (excluye "a consultar"). */
  itemsSubtotal: number
  adjustments: Adjustment[]
  /** itemsSubtotal + ajustes numéricos. */
  total: number
  /** Hay líneas o ajustes "a consultar" → el total es orientativo. */
  hasConsulta: boolean
  /** El total alcanza el umbral del detallito gratis. */
  detallito: boolean
  /** Alguna línea es de alquiler (fianza reembolsable). */
  hasRental: boolean
}

// ── Resolución de precio ───────────────────────────────────────────────────

/** Tramos válidos (con precio numérico) de un producto. */
export function productTiers(p: PricingProduct): PriceTier[] {
  return asArray<PriceTier>(p.pricing).filter(
    t => t && typeof t.label === 'string' && typeof t.price === 'number',
  )
}

/**
 * Resuelve el tramo elegido. Si el producto tiene tramos y el label pedido no
 * existe, cae al primer tramo (defensivo). Si no tiene tramos, null.
 */
export function resolveTier(p: PricingProduct, tierLabel?: string | null): PriceTier | null {
  const tiers = productTiers(p)
  if (!tiers.length) return null
  if (tierLabel) {
    const found = tiers.find(t => t.label === tierLabel)
    if (found) return found
  }
  return tiers[0]!
}

/** Precio unitario resuelto: tramo elegido → base_price → null (a consultar). */
export function productUnitPrice(p: PricingProduct, tierLabel?: string | null): number | null {
  const tier = resolveTier(p, tierLabel)
  if (tier) return tier.price
  return p.base_price
}

function buildLabel(name: string, tier: string | null, size: string | null): string {
  const extra = [tier, size].filter(Boolean).join(' · ')
  return extra ? `${name} (${extra})` : name
}

/** Normaliza una cantidad a entero ≥ 1 y ≤ 99. */
export function normalizeQty(qty: unknown): number {
  const n = Math.floor(Number(qty))
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.min(n, 99)
}

export interface Catalog {
  products: Map<string, PricingProduct>
  packs: Map<string, PricingPack>
}

/** Construye el índice del catálogo a partir de arrays (cliente o servidor). */
export function buildCatalog(products: PricingProduct[], packs: PricingPack[]): Catalog {
  return {
    products: new Map(products.map(p => [p.id, p])),
    packs: new Map(packs.map(p => [p.id, p])),
  }
}

/**
 * Núcleo del cálculo. Determinista: mismas entradas → mismo resultado en
 * cliente y servidor. Ignora en silencio ids inexistentes (defensivo).
 */
export function computeQuote(
  selected: SelectedLine[],
  opts: ConfiguratorOptions,
  rules: ConfiguratorRules,
  catalog: Catalog,
): ComputedQuote {
  const lines: ComputedLine[] = []

  for (const sel of selected) {
    const qty = normalizeQty(sel.qty)

    if (sel.kind === 'product') {
      const p = catalog.products.get(sel.id)
      if (!p) continue
      const tier = resolveTier(p, sel.tier)
      const unit = tier ? tier.price : p.base_price
      const consulta = unit == null
      lines.push({
        kind: 'product',
        id: p.id,
        name: p.name,
        slug: p.slug,
        label: buildLabel(p.name, tier?.label ?? null, sel.size ?? null),
        qty,
        tier: tier?.label ?? null,
        size: sel.size ?? null,
        options: Array.isArray(sel.options) ? sel.options : [],
        unit_price: unit,
        line_total: consulta ? null : round2(unit! * qty),
        consulta,
        is_rental: !!p.is_rental,
        deposit: p.deposit ?? null,
      })
    }
    else {
      const pk = catalog.packs.get(sel.id)
      if (!pk) continue
      const unit = pk.price
      const consulta = unit == null
      lines.push({
        kind: 'pack',
        id: pk.id,
        name: pk.name,
        slug: pk.slug,
        label: pk.name,
        qty,
        tier: null,
        size: null,
        options: [],
        unit_price: unit,
        line_total: consulta ? null : round2(unit! * qty),
        consulta,
        is_rental: false,
        deposit: null,
      })
    }
  }

  const itemsSubtotal = round2(lines.reduce((s, l) => s + (l.line_total ?? 0), 0))

  const adjustments: Adjustment[] = []
  if (opts.desmontaje) {
    adjustments.push({ key: 'desmontaje', label: 'Desmontaje', amount: rules.desmontaje_precio })
  }
  if (opts.far) {
    adjustments.push({
      key: 'gasolina',
      label: `Desplazamiento (+${rules.km_incluidos} km)`,
      amount: null,
      note: 'a consultar según distancia',
    })
  }

  const numericAdjustments = adjustments.reduce((s, a) => s + (a.amount ?? 0), 0)
  const total = round2(itemsSubtotal + numericAdjustments)
  const hasConsulta = lines.some(l => l.consulta) || adjustments.some(a => a.amount == null)
  const detallito = itemsSubtotal > 0 && total >= rules.umbral_detallito
  const hasRental = lines.some(l => l.is_rental)

  return { lines, itemsSubtotal, adjustments, total, hasConsulta, detallito, hasRental }
}
