/**
 * Email transaccional server-side vía Resend (API REST, sin SDK).
 *
 * Sin NUXT_RESEND_API_KEY configurada → no-op (devuelve false) y el cliente
 * puede usar su fallback (EmailJS). El lead SIEMPRE queda persistido en BD
 * independientemente del resultado del email.
 */

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ═════════════════════════════════════════════════════════════════════════
// Presupuestos del CONFIGURADOR (Fase 3)
// ═════════════════════════════════════════════════════════════════════════

export interface QuoteEmailLine {
  label: string
  qty: number
  unit_price: number | null
  line_total: number | null
}

export interface QuoteEmailAdjustment {
  label: string
  amount: number | null
  note?: string
}

export interface QuoteEmailData {
  quoteId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  eventTypeLabel: string
  eventDate?: string
  location?: string
  invitados?: string
  distanceKm?: number | null
  lines: QuoteEmailLine[]
  adjustments: QuoteEmailAdjustment[]
  itemsSubtotal: number
  total: number
  hasConsulta: boolean
  hasRental: boolean
  message?: string
}

function eur(n: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n)
}

function amountCell(v: number | null, note?: string): string {
  if (v == null) return `<span style="color:#8B3A2A99">${note ? esc(note) : 'a consultar'}</span>`
  return esc(eur(v))
}

function itemsTable(q: QuoteEmailData): string {
  const rows = q.lines
    .map(
      l => `
      <tr style="border-bottom:1px solid #EFE7E0">
        <td style="padding:8px 12px">${esc(l.label)}</td>
        <td style="padding:8px 12px;text-align:center;white-space:nowrap">× ${l.qty}</td>
        <td style="padding:8px 12px;text-align:right;white-space:nowrap;font-weight:600">${amountCell(l.line_total)}</td>
      </tr>`,
    )
    .join('')

  const adj = q.adjustments
    .map(
      a => `
      <tr style="border-bottom:1px solid #EFE7E0;color:#8B3A2A">
        <td style="padding:8px 12px" colspan="2">${esc(a.label)}</td>
        <td style="padding:8px 12px;text-align:right;white-space:nowrap">${amountCell(a.amount, a.note)}</td>
      </tr>`,
    )
    .join('')

  return `
    <table style="width:100%;border-collapse:collapse;background:#FAFAF8;border-radius:12px;overflow:hidden;font-size:14px">
      <thead>
        <tr style="background:#F1E9E2;color:#8B3A2A;text-align:left">
          <th style="padding:8px 12px">Concepto</th>
          <th style="padding:8px 12px;text-align:center">Cant.</th>
          <th style="padding:8px 12px;text-align:right">Importe</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        ${adj}
        <tr style="background:#F1E9E2">
          <td style="padding:10px 12px;font-weight:700;color:#8B3A2A" colspan="2">Total estimado</td>
          <td style="padding:10px 12px;text-align:right;font-weight:800;color:#8B3A2A;white-space:nowrap">${esc(eur(q.total))}${q.hasConsulta ? ' *' : ''}</td>
        </tr>
      </tbody>
    </table>
    ${q.hasConsulta ? '<p style="color:#8B3A2A99;font-size:12px;margin:6px 0 0">* Incluye conceptos «a consultar» que se cerrarán al confirmar.</p>' : ''}`
}

function quoteMetaRows(q: QuoteEmailData): string {
  const row = (label: string, value?: string) =>
    value ? `<tr><td style="padding:4px 12px;color:#8B3A2A;font-weight:600">${label}</td><td style="padding:4px 12px">${esc(value)}</td></tr>` : ''
  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px">
      ${row('Nombre', q.clientName)}
      ${row('Email', q.clientEmail)}
      ${row('Teléfono', q.clientPhone)}
      ${row('Ocasión', q.eventTypeLabel)}
      ${row('Fecha', q.eventDate)}
      ${row('Invitados', q.invitados)}
      ${row('Dirección / distancia', q.location
        ? `${q.location}${q.distanceKm != null ? ` (${q.distanceKm} km de Abrera)` : ''}`
        : undefined)}
    </table>`
}

/** Aviso de nuevo presupuesto a la dueña. Devuelve true si el email salió. */
export async function sendOwnerQuoteNotification(q: QuoteEmailData): Promise<boolean> {
  const config = useRuntimeConfig()
  if (!config.resendApiKey) {
    console.warn('[email] NUXT_RESEND_API_KEY no configurada — aviso de presupuesto omitido')
    return false
  }

  try {
    await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.resendApiKey}` },
      body: {
        from: config.emailFrom,
        to: [config.emailBusiness],
        reply_to: q.clientEmail,
        subject: `🎈 Nuevo presupuesto: ${q.clientName} — ${q.eventTypeLabel} (${q.eventDate ?? 'sin fecha'}) · ${eur(q.total)}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#3d2320">
            <h2 style="color:#8B3A2A">🎈 Nueva solicitud de presupuesto (configurador)</h2>
            ${quoteMetaRows(q)}
            ${itemsTable(q)}
            ${q.hasRental ? '<p style="color:#8B3A2A;font-size:13px">Incluye alquiler de estructura → gestionar fianza reembolsable.</p>' : ''}
            ${q.message ? `<p style="margin-top:16px"><strong style="color:#8B3A2A">Mensaje del cliente:</strong><br>${esc(q.message)}</p>` : ''}
            <p style="color:#8B3A2A99;font-size:13px;margin-top:16px">Presupuesto <strong>#${esc(q.quoteId.slice(0, 8))}</strong> guardado en el panel de Inaka Moments.</p>
          </div>`,
      },
    })
    return true
  }
  catch (err) {
    console.error('[email] error enviando aviso de presupuesto:', err)
    return false
  }
}

/** Confirmación al cliente ("hemos recibido tu propuesta"). true si salió. */
export async function sendClientQuoteConfirmation(q: QuoteEmailData): Promise<boolean> {
  const config = useRuntimeConfig()
  if (!config.resendApiKey) {
    console.warn('[email] NUXT_RESEND_API_KEY no configurada — confirmación al cliente omitida')
    return false
  }

  try {
    await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.resendApiKey}` },
      body: {
        from: config.emailFrom,
        to: [q.clientEmail],
        reply_to: config.emailBusiness,
        subject: '🎈 Hemos recibido tu propuesta — Inaka Moments',
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#3d2320">
            <h2 style="color:#8B3A2A">¡Gracias, ${esc(q.clientName.split(' ')[0] || q.clientName)}! 🎈</h2>
            <p style="line-height:1.6">Hemos recibido tu propuesta de decoración para tu <strong>${esc(q.eventTypeLabel.toLowerCase())}</strong>${q.eventDate ? ` del <strong>${esc(q.eventDate)}</strong>` : ''}. Este es el resumen que has configurado:</p>
            ${itemsTable(q)}
            <p style="line-height:1.6;margin-top:16px">Es un <strong>presupuesto orientativo y sujeto a confirmación</strong>. Revisaremos la disponibilidad de tu fecha y te contactaremos en menos de 24 h para cerrar los detalles${q.hasRental ? ', incluida la fianza reembolsable del alquiler de estructura' : ''}.</p>
            <p style="line-height:1.6;color:#8B3A2A"><strong>Recuerda:</strong> el montaje está incluido; para bloquear tu fecha se abona una señal al agendar${q.total >= 120 ? '; y como tu pedido supera los 120 €, te llevas un detallito de Inaka Moments 🎁' : ''}.</p>
            <p style="line-height:1.6;margin-top:20px">Con mimo,<br><strong>Inaka Moments</strong><br><span style="color:#8B3A2A99">Momentos bonitos, recuerdos para siempre.</span></p>
          </div>`,
      },
    })
    return true
  }
  catch (err) {
    console.error('[email] error enviando confirmación al cliente:', err)
    return false
  }
}
