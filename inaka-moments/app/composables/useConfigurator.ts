import {
  buildCatalog,
  computeQuote,
  normalizeRules,
  resolveTier,
  round2,
  type ComputedQuote,
  type ConfiguratorRules,
  type PricingPack,
  type PricingProduct,
  type SelectedLine,
} from '~~/shared/configurator'

/** Vista para mostrar una línea del carrito (precio resuelto desde catálogo). */
export interface LineView {
  name: string
  tier: string | null
  size: string | null
  options: string[]
  unit_price: number | null
  line_total: number | null
  consulta: boolean
  is_rental: boolean
}

/**
 * Estado global del CONFIGURADOR (Fase 3), compartido entre pasos y
 * componentes vía `useState` (sobrevive a la navegación dentro de la SPA).
 *
 * El precio "en vivo" se calcula con el MISMO motor puro que usa el servidor
 * (`shared/configurator.ts`), alimentado con los productos/packs y reglas
 * que ya carga la web pública. Así el total mostrado cuadra con lo que
 * persistirá el endpoint.
 */

export interface ConfiguratorState {
  event_type: string
  event_date: string
  far: boolean
  /** Dirección del evento (texto libre, para geocodificar). */
  location: string
  /** Distancia (km) desde Abrera, estimada en vivo por /api/geocode. */
  distance_km: number | null
  /** Rango de invitados (opcional): 'Menos de 50' | '50 – 100' | 'Más de 100'. */
  invitados: string
  desmontaje: boolean
  lines: SelectedLine[]
}

function emptyState(): ConfiguratorState {
  return { event_type: '', event_date: '', far: false, location: '', distance_km: null, invitados: '', desmontaje: false, lines: [] }
}

/** Clave estable de una línea (mismo producto + tramo + tamaño = misma línea). */
function lineKey(l: SelectedLine): string {
  return `${l.kind}:${l.id}:${l.tier ?? ''}:${l.size ?? ''}:${(l.options ?? []).join(',')}`
}

export function useConfigurator() {
  const state = useState<ConfiguratorState>('configurator', emptyState)

  // Datos públicos (SSR, cacheados por clave; se reutilizan si ya se cargaron)
  const { data: products, pending: productsPending } = useProducts()
  const { data: packs } = usePacks()
  const { data: settings } = useSiteSection<Record<string, unknown>>('settings', {})

  const rules = computed<ConfiguratorRules>(() => normalizeRules(settings.value))

  const catalog = computed(() =>
    buildCatalog(
      (products.value ?? []) as unknown as PricingProduct[],
      (packs.value ?? []) as unknown as PricingPack[],
    ),
  )

  const quote = computed<ComputedQuote>(() =>
    computeQuote(
      state.value.lines,
      { desmontaje: state.value.desmontaje, far: state.value.far, distanceKm: state.value.distance_km },
      rules.value,
      catalog.value,
    ),
  )

  const count = computed(() => state.value.lines.length)
  const totalQty = computed(() => state.value.lines.reduce((s, l) => s + l.qty, 0))

  // ── Mutaciones ────────────────────────────────────────────────────────────

  function addLine(line: SelectedLine) {
    const key = lineKey(line)
    const existing = state.value.lines.find(l => lineKey(l) === key)
    if (existing) {
      existing.qty = Math.min(99, existing.qty + Math.max(1, line.qty))
    }
    else {
      state.value.lines.push({ ...line, qty: Math.min(99, Math.max(1, line.qty)) })
    }
  }

  function removeAt(index: number) {
    state.value.lines.splice(index, 1)
  }

  function setQtyAt(index: number, qty: number) {
    const l = state.value.lines[index]
    if (!l) return
    const n = Math.floor(qty)
    if (!Number.isFinite(n) || n < 1) { removeAt(index); return }
    l.qty = Math.min(99, n)
  }

  function incAt(index: number, delta: number) {
    const l = state.value.lines[index]
    if (!l) return
    setQtyAt(index, l.qty + delta)
  }

  /** ¿Hay alguna línea de este producto/pack (independiente de variante)? */
  function countOf(kind: 'product' | 'pack', id: string): number {
    return state.value.lines
      .filter(l => l.kind === kind && l.id === id)
      .reduce((s, l) => s + l.qty, 0)
  }

  /** Resuelve el precio de UNA línea concreta (por índice, para el carrito). */
  function describeLine(line: SelectedLine): LineView | null {
    if (line.kind === 'product') {
      const p = catalog.value.products.get(line.id)
      if (!p) return null
      const tier = resolveTier(p, line.tier)
      const unit = tier ? tier.price : p.base_price
      const consulta = unit == null
      return {
        name: p.name,
        tier: tier?.label ?? line.tier ?? null,
        size: line.size ?? null,
        options: line.options ?? [],
        unit_price: unit,
        line_total: consulta ? null : round2(unit! * line.qty),
        consulta,
        is_rental: !!p.is_rental,
      }
    }
    const pk = catalog.value.packs.get(line.id)
    if (!pk) return null
    const unit = pk.price
    const consulta = unit == null
    return {
      name: pk.name,
      tier: null,
      size: null,
      options: [],
      unit_price: unit,
      line_total: consulta ? null : round2(unit! * line.qty),
      consulta,
      is_rental: false,
    }
  }

  function clear() {
    state.value = emptyState()
  }

  return {
    state,
    products,
    packs,
    productsPending,
    rules,
    quote,
    count,
    totalQty,
    addLine,
    removeAt,
    setQtyAt,
    incAt,
    countOf,
    describeLine,
    clear,
  }
}
