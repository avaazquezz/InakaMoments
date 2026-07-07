/**
 * Email transaccional server-side vía Resend (API REST, sin SDK).
 *
 * Sin NUXT_RESEND_API_KEY configurada → no-op (devuelve false) y el cliente
 * puede usar su fallback (EmailJS). El lead SIEMPRE queda persistido en BD
 * independientemente del resultado del email.
 */

interface LeadEmailData {
  nombre: string
  email: string
  telefono?: string
  tipo?: string
  fecha?: string
  invitados?: string
  espacios?: string[]
  estilo?: string
  ideas_extra?: string
  source?: string
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function leadHtml(lead: LeadEmailData): string {
  const row = (label: string, value?: string) =>
    value ? `<tr><td style="padding:6px 12px;color:#8B3A2A;font-weight:600">${label}</td><td style="padding:6px 12px">${esc(value)}</td></tr>` : ''

  return `
  <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#3d2320">
    <h2 style="color:#8B3A2A">🎈 Nueva solicitud de presupuesto</h2>
    <table style="width:100%;border-collapse:collapse;background:#FAFAF8;border-radius:12px">
      ${row('Nombre', lead.nombre)}
      ${row('Email', lead.email)}
      ${row('Teléfono', lead.telefono)}
      ${row('Ocasión', lead.tipo)}
      ${row('Fecha', lead.fecha)}
      ${row('Invitados', lead.invitados)}
      ${row('Espacios', lead.espacios?.join(', '))}
      ${row('Estilo', lead.estilo)}
      ${row('Ideas extra', lead.ideas_extra)}
      ${row('Origen', lead.source)}
    </table>
    <p style="color:#8B3A2A99;font-size:13px">El lead está guardado en el panel de Inaka Moments.</p>
  </div>`
}

/** Aviso de nuevo lead a la dueña. Devuelve true si el email salió. */
export async function sendOwnerLeadNotification(lead: LeadEmailData): Promise<boolean> {
  const config = useRuntimeConfig()
  if (!config.resendApiKey) {
    console.warn('[email] NUXT_RESEND_API_KEY no configurada — aviso server-side omitido')
    return false
  }

  try {
    await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.resendApiKey}` },
      body: {
        from: config.emailFrom,
        to: [config.emailBusiness],
        reply_to: lead.email,
        subject: `🎈 Nuevo lead: ${lead.nombre} — ${lead.tipo ?? 'evento'} (${lead.fecha ?? 'sin fecha'})`,
        html: leadHtml(lead),
      },
    })
    return true
  }
  catch (err) {
    console.error('[email] error enviando aviso de lead:', err)
    return false
  }
}
