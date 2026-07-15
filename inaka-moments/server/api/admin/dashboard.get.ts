import { addDaysISO, formatISODate, todayISO } from '~~/shared/dates'

/**
 * GET /api/admin/dashboard — resumen agregado para la portada del panel.
 *
 * Sin pasarela de pago (Fase 5 usa Bizum manual) no hay "ingresos"
 * automáticos: "reserva prevista" es el % del total (site_content.settings
 * .senal_porcentaje) calculado al aceptar, y "reserva cobrada" es la que la
 * dueña ha marcado `pagado` al ver entrar el Bizum — esta última sigue
 * siendo declarada por ella, no verificada por ninguna pasarela.
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

function startOfPreviousMonthISO(): string {
  const d = new Date()
  return formatISODate(new Date(d.getFullYear(), d.getMonth() - 1, 1))
}

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const supabase = useSupabaseAdmin(event)

  const [
    leadsNuevos, quotesEnviados, testimonialsPendientes, proximosEventos, presupuestosMes, todosLeads, quoteItems,
    presupuestosMesAnterior, depositosPendientes, eventosProximos7Dias, resenasPublicadas,
  ] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'nuevo'),
    supabase.from('quotes').select('id', { count: 'exact', head: true }).eq('status', 'enviado'),
    supabase.from('testimonials').select('id', { count: 'exact', head: true }).not('responded_at', 'is', null).eq('published', false),
    supabase.from('events')
      .select('id, title, event_date, event_type, status')
      .gte('event_date', todayISO())
      .neq('status', 'cancelado')
      .order('event_date', { ascending: true })
      .limit(5),
    supabase.from('quotes')
      .select('id, total, deposit_amount, deposit_status')
      .eq('status', 'aceptado')
      .gte('updated_at', startOfMonthISO()),
    supabase.from('leads').select('status'),
    supabase.from('quote_items')
      .select('product_id, qty, quotes!inner(status), product:products(name)')
      .eq('quotes.status', 'aceptado')
      .not('product_id', 'is', null),
    supabase.from('quotes')
      .select('id, total, deposit_amount, deposit_status')
      .eq('status', 'aceptado')
      .gte('updated_at', startOfPreviousMonthISO())
      .lt('updated_at', startOfMonthISO()),
    supabase.from('rental_bookings')
      .select('id, deposit_amount')
      .eq('deposit_status', 'pagado')
      .lt('date_to', todayISO()),
    supabase.from('events')
      .select('id', { count: 'exact', head: true })
      .neq('status', 'cancelado')
      .gte('event_date', todayISO())
      .lte('event_date', addDaysISO(7)),
    supabase.from('testimonials').select('rating').eq('published', true),
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
  const totalMes = round2(presupuestos.reduce((s, q) => s + (q.total ?? 0), 0))

  const presupuestosAnterior = presupuestosMesAnterior.data ?? []
  const totalMesAnterior = round2(presupuestosAnterior.reduce((s, q) => s + (q.total ?? 0), 0))
  const senalCobradaMes = round2(presupuestos.filter(q => q.deposit_status === 'pagado').reduce((s, q) => s + (q.deposit_amount ?? 0), 0))
  const senalCobradaMesAnterior = round2(presupuestosAnterior.filter(q => q.deposit_status === 'pagado').reduce((s, q) => s + (q.deposit_amount ?? 0), 0))

  const depositos = depositosPendientes.data ?? []

  const ratings = (resenasPublicadas.data ?? []).map(t => t.rating).filter((r): r is number => r != null)

  return {
    leadsNuevos: leadsNuevos.count ?? 0,
    quotesEnviados: quotesEnviados.count ?? 0,
    testimonialsPendientes: testimonialsPendientes.count ?? 0,
    proximosEventos: (proximosEventos.data ?? []) as EventoResumen[],
    eventosProximos7Dias: eventosProximos7Dias.count ?? 0,
    depositosPendientes: {
      count: depositos.length,
      total: round2(depositos.reduce((s, r) => s + (r.deposit_amount ?? 0), 0)),
    },
    resenas: {
      count: (resenasPublicadas.data ?? []).length,
      mediaRating: ratings.length > 0 ? round2(ratings.reduce((s, r) => s + r, 0) / ratings.length) : null,
    },
    presupuestosAceptadosMes: {
      count: presupuestos.length,
      total: totalMes,
      senalPrevista: round2(presupuestos.reduce((s, q) => s + (q.deposit_amount ?? 0), 0)),
      senalCobrada: senalCobradaMes,
      ticketMedio: presupuestos.length > 0 ? round2(totalMes / presupuestos.length) : null,
    },
    presupuestosAceptadosMesAnterior: {
      count: presupuestosAnterior.length,
      total: totalMesAnterior,
      senalCobrada: senalCobradaMesAnterior,
    },
    funnel,
    topProductos,
  }
})

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}
