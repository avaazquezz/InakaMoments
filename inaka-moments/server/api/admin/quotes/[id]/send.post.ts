import { EVENT_TYPE_LABELS, type EventType } from '~~/shared/eventTypes'

/** POST /api/admin/quotes/[id]/send — reenvía el resumen del presupuesto al cliente. */
export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  const supabase = useSupabaseAdmin(event)

  const [quoteRes, itemsRes] = await Promise.all([
    supabase.from('quotes').select('*').eq('id', id!).maybeSingle(),
    supabase.from('quote_items').select('*').eq('quote_id', id!).order('created_at', { ascending: true }),
  ])

  if (quoteRes.error || !quoteRes.data) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Presupuesto no encontrado.' })
  }
  if (!quoteRes.data.client_email) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'El presupuesto no tiene email de cliente.' })
  }

  const q = quoteRes.data
  const items = itemsRes.data ?? []

  const notified = await sendClientQuoteConfirmation({
    quoteId: q.id,
    clientName: q.client_name ?? '',
    clientEmail: q.client_email,
    clientPhone: q.client_phone ?? undefined,
    eventTypeLabel: q.event_type ? (EVENT_TYPE_LABELS[q.event_type as EventType] ?? q.event_type) : 'Evento',
    eventDate: q.event_date ?? undefined,
    location: q.location ?? undefined,
    distanceKm: q.distance_km,
    lines: items.map(i => ({ label: i.label, qty: i.qty, unit_price: i.unit_price, line_total: i.line_total })),
    adjustments: (q.adjustments as { label: string, amount: number | null, note?: string }[]) ?? [],
    itemsSubtotal: q.subtotal,
    total: q.total,
    hasConsulta: items.some(i => i.line_total == null) || ((q.adjustments as any[]) ?? []).some((a: any) => a.amount == null),
    hasRental: false,
    message: q.notes ?? undefined,
  })

  if (!notified) {
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido enviar el email (revisa que Resend esté configurado).' })
  }

  return { ok: true }
})
