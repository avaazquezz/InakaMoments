import { formatISODate, todayISO } from '~~/shared/dates'

/**
 * GET /api/admin/dashboard — resumen agregado para la portada del panel.
 *
 * Nota deliberada: sin Stripe (Fase 5) no hay ningún estado de pago
 * verificado, así que aquí NUNCA se habla de "ingresos" — solo de
 * presupuestos aceptados y el importe de señal previsto (un número que la
 * dueña ha fijado manualmente, no dinero confirmado en cuenta).
 */

interface EventoResumen {
  id: string
  title: string
  event_date: string
  event_type: string | null
  status: string
}

function startOfMonthISO(): string {
  const d = new Date()
  return formatISODate(new Date(d.getFullYear(), d.getMonth(), 1))
}

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const supabase = useSupabaseAdmin(event)

  const [leadsNuevos, proximosEventos, presupuestosMes, todosLeads, quoteItems] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'nuevo'),
    supabase.from('events')
      .select('id, title, event_date, event_type, status')
      .gte('event_date', todayISO())
      .neq('status', 'cancelado')
      .order('event_date', { ascending: true })
      .limit(5),
    supabase.from('quotes')
      .select('id, total, deposit_amount')
      .eq('status', 'aceptado')
      .gte('updated_at', startOfMonthISO()),
    supabase.from('leads').select('status'),
    supabase.from('quote_items')
      .select('product_id, qty, quotes!inner(status), product:products(name)')
      .eq('quotes.status', 'aceptado')
      .not('product_id', 'is', null),
  ])

  const funnelOrder = ['nuevo', 'contactado', 'presupuestado', 'ganado', 'perdido'] as const
  const funnelCounts = new Map<string, number>(funnelOrder.map(s => [s, 0]))
  for (const lead of todosLeads.data ?? []) {
    funnelCounts.set(lead.status, (funnelCounts.get(lead.status) ?? 0) + 1)
  }
  const funnel = funnelOrder.map(status => ({ status, count: funnelCounts.get(status) ?? 0 }))

  const productTotals = new Map<string, number>()
  for (const item of quoteItems.data ?? []) {
    const name = (item.product as unknown as { name: string } | null)?.name
    if (!name) continue
    productTotals.set(name, (productTotals.get(name) ?? 0) + item.qty)
  }
  const topProductos = [...productTotals.entries()]
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)

  const presupuestos = presupuestosMes.data ?? []

  return {
    leadsNuevos: leadsNuevos.count ?? 0,
    proximosEventos: (proximosEventos.data ?? []) as EventoResumen[],
    presupuestosAceptadosMes: {
      count: presupuestos.length,
      total: round2(presupuestos.reduce((s, q) => s + (q.total ?? 0), 0)),
      senalPrevista: round2(presupuestos.reduce((s, q) => s + (q.deposit_amount ?? 0), 0)),
    },
    funnel,
    topProductos,
  }
})

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}
