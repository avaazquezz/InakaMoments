import type { H3Event } from 'h3'
import { EVENT_TYPE_LABELS, type EventType } from '~~/shared/eventTypes'

/**
 * Lógica compartida de solicitudes de reseña — usada tanto por el scheduler
 * automático (server/plugins/review-request-scheduler.ts) como por el envío
 * manual desde el panel (server/api/admin/testimonials/{candidatos,enviar}).
 */

export const AUTO_REVIEW_WINDOW_DAYS = 3

export interface ReviewCandidate {
  quoteId: string
  eventId: string
  clientName: string | null
  clientEmail: string
  eventType: EventType | null
  eventDate: string
}

export interface SendReviewRequestOutcome {
  quoteId: string
  sent: boolean
  reason?: 'email_failed' | 'already_requested' | 'db_error'
}

interface CandidateRow {
  id: string
  event_date: string
  quote_id: string | null
  quotes: {
    id: string
    client_name: string | null
    client_email: string | null
    event_type: EventType | null
    lead_id: string | null
    leads: { email: string } | null
  } | null
}

/**
 * Eventos ya pasados (confirmados/completados) con presupuesto vinculado y
 * sin solicitud de reseña previa (ni respondida ni pendiente de respuesta).
 * `minEventDate`/`maxEventDate` acotan el rango (inclusive) sobre
 * `events.event_date`. Nunca lanza: ante error de BD devuelve `[]`.
 */
export async function findReviewCandidates(
  event: H3Event,
  opts: { minEventDate?: string, maxEventDate?: string } = {},
): Promise<ReviewCandidate[]> {
  const supabase = useSupabaseAdmin(event)

  let query = supabase
    .from('events')
    .select('id, event_date, quote_id, quotes!inner(id, client_name, client_email, event_type, lead_id, leads(email))')
    .in('status', ['confirmado', 'completado'])
    .not('quote_id', 'is', null)
    .order('event_date', { ascending: true })

  if (opts.minEventDate) query = query.gte('event_date', opts.minEventDate)
  if (opts.maxEventDate) query = query.lte('event_date', opts.maxEventDate)

  const [{ data: events, error: eventsErr }, { data: requested, error: requestedErr }] = await Promise.all([
    query,
    supabase.from('testimonials').select('quote_id').not('quote_id', 'is', null),
  ])

  if (eventsErr || requestedErr) {
    console.error('[reviews] error buscando candidatos:', eventsErr ?? requestedErr)
    return []
  }

  const alreadyRequested = new Set((requested ?? []).map(r => r.quote_id))

  const candidates: ReviewCandidate[] = []
  for (const row of (events ?? []) as unknown as CandidateRow[]) {
    const quote = row.quotes
    if (!quote || !row.quote_id || alreadyRequested.has(row.quote_id)) continue

    // events.quote_id → quotes.client_email es la fuente fiable; leads.email
    // (not-null en BD) es el único fallback, ya que events.client_contact
    // puede contener un teléfono en vez de un email.
    const clientEmail = quote.client_email ?? quote.leads?.email ?? null
    if (!clientEmail) {
      console.warn(`[reviews] presupuesto ${row.quote_id} sin email de cliente resoluble — se omite`)
      continue
    }

    candidates.push({
      quoteId: row.quote_id,
      eventId: row.id,
      clientName: quote.client_name,
      clientEmail,
      eventType: quote.event_type,
      eventDate: row.event_date,
    })
  }
  return candidates
}

/**
 * Envía el email de solicitud y, SOLO si sale bien, crea la fila de
 * seguimiento en `testimonials` (email-primero, insert-después): un envío
 * fallido no bloquea permanentemente ese presupuesto, sigue siendo
 * candidato en el próximo intento. El constraint único en `quote_id` es la
 * comprobación de "ya solicitada" (nunca un SELECT previo), igual que el
 * índice de colisión de fecha en `confirmEventDate()`.
 */
export async function sendReviewRequests(
  event: H3Event,
  candidates: ReviewCandidate[],
): Promise<SendReviewRequestOutcome[]> {
  const supabase = useSupabaseAdmin(event)
  const outcomes: SendReviewRequestOutcome[] = []

  for (const c of candidates) {
    const eventTypeLabel = c.eventType ? (EVENT_TYPE_LABELS[c.eventType] ?? c.eventType) : 'evento'
    const token = crypto.randomUUID()

    const sent = await sendReviewRequestEmail({
      clientName: c.clientName ?? 'Cliente',
      clientEmail: c.clientEmail,
      eventTypeLabel,
      eventDate: c.eventDate,
      token,
    })

    if (!sent) {
      outcomes.push({ quoteId: c.quoteId, sent: false, reason: 'email_failed' })
      continue
    }

    const { error } = await supabase.from('testimonials').insert({
      quote_id: c.quoteId,
      token,
      client_email: c.clientEmail,
      author: c.clientName,
      event_type: c.eventType,
      requested_at: new Date().toISOString(),
      published: false,
      sort_order: 999,
    })

    if (error) {
      if (error.code === '23505') {
        outcomes.push({ quoteId: c.quoteId, sent: true, reason: 'already_requested' })
      }
      else {
        console.error(`[reviews] email enviado pero no se pudo registrar la solicitud (quote ${c.quoteId}):`, error)
        outcomes.push({ quoteId: c.quoteId, sent: true, reason: 'db_error' })
      }
      continue
    }

    outcomes.push({ quoteId: c.quoteId, sent: true })
  }

  return outcomes
}
