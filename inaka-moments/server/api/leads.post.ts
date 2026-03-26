import { Resend } from 'resend'

interface LeadData {
  tipo: string
  invitados: string
  fecha: string
  espacios: string[]
  estilo: string
  nombre: string
  telefono: string
  email: string
  ideasExtra: string
}

const TIPO_LABELS: Record<string, string> = {
  boda: 'Boda',
  comunion: 'Comunión',
  cumple: 'Cumpleaños',
  empresa: 'Empresa / Corporativo',
}

const ESPACIO_LABELS: Record<string, string> = {
  photocall: 'Photocall',
  mesa_dulce: 'Mesa Dulce',
  centros: 'Centros de Mesa',
  bienvenida: 'Bienvenida',
}

const ESTILO_LABELS: Record<string, string> = {
  boho: 'Boho Chic',
  clasico: 'Clásico Elegante',
  colorido: 'Colorido',
}

function buildEmailHtml(data: LeadData): string {
  const espaciosText = data.espacios.map(e => ESPACIO_LABELS[e] ?? e).join(', ') || '—'
  const fechaText = data.fecha || '—'
  const ideasText = data.ideasExtra || '—'

  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#FAFAF8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF8;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#8B3A2A;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:1px;">✨ Nueva solicitud de presupuesto</h1>
            <p style="margin:6px 0 0;color:#E8D0C8;font-size:14px;">Inaka Moments</p>
          </td>
        </tr>

        <!-- Contact info -->
        <tr>
          <td style="padding:28px 32px 16px;">
            <h2 style="margin:0 0 16px;color:#8B3A2A;font-size:16px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #E8D0C8;padding-bottom:8px;">Datos de contacto</h2>
            <table width="100%" cellpadding="6" cellspacing="0">
              <tr>
                <td style="color:#666;font-size:14px;width:130px;font-weight:bold;">Nombre</td>
                <td style="color:#222;font-size:15px;font-weight:bold;">${data.nombre}</td>
              </tr>
              <tr style="background:#FAFAF8;">
                <td style="color:#666;font-size:14px;font-weight:bold;">WhatsApp</td>
                <td><a href="https://wa.me/${data.telefono.replace(/\s+/g, '')}" style="color:#8B3A2A;font-size:15px;font-weight:bold;text-decoration:none;">📱 ${data.telefono}</a></td>
              </tr>
              <tr>
                <td style="color:#666;font-size:14px;font-weight:bold;">Email</td>
                <td><a href="mailto:${data.email}" style="color:#8B3A2A;font-size:15px;text-decoration:none;">✉️ ${data.email}</a></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Event details -->
        <tr>
          <td style="padding:8px 32px 16px;">
            <h2 style="margin:0 0 16px;color:#8B3A2A;font-size:16px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #E8D0C8;padding-bottom:8px;">Detalles del evento</h2>
            <table width="100%" cellpadding="6" cellspacing="0">
              <tr>
                <td style="color:#666;font-size:14px;width:130px;font-weight:bold;">Tipo</td>
                <td style="color:#222;font-size:14px;">${TIPO_LABELS[data.tipo] ?? data.tipo}</td>
              </tr>
              <tr style="background:#FAFAF8;">
                <td style="color:#666;font-size:14px;font-weight:bold;">Fecha aprox.</td>
                <td style="color:#222;font-size:14px;">${fechaText}</td>
              </tr>
              <tr>
                <td style="color:#666;font-size:14px;font-weight:bold;">Invitados</td>
                <td style="color:#222;font-size:14px;">${data.invitados}</td>
              </tr>
              <tr style="background:#FAFAF8;">
                <td style="color:#666;font-size:14px;font-weight:bold;">Espacios</td>
                <td style="color:#222;font-size:14px;">${espaciosText}</td>
              </tr>
              <tr>
                <td style="color:#666;font-size:14px;font-weight:bold;">Estilo</td>
                <td style="color:#222;font-size:14px;">${ESTILO_LABELS[data.estilo] ?? data.estilo}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Ideas -->
        <tr>
          <td style="padding:8px 32px 28px;">
            <h2 style="margin:0 0 12px;color:#8B3A2A;font-size:16px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #E8D0C8;padding-bottom:8px;">Ideas especiales</h2>
            <p style="margin:0;color:#444;font-size:14px;line-height:1.6;background:#FAFAF8;padding:14px 16px;border-radius:8px;border-left:3px solid #C9A96E;">${ideasText}</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#E8D0C8;padding:16px 32px;text-align:center;">
            <p style="margin:0;color:#8B3A2A;font-size:12px;">Inaka Moments · Abrera, Cataluña · inakamoments@gmail.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`
}

async function saveToAirtable(data: LeadData, config: ReturnType<typeof useRuntimeConfig>) {
  const { airtableToken, airtableBaseId, airtableTableId } = config

  if (!airtableToken || !airtableBaseId || !airtableTableId) return

  const espaciosText = data.espacios.map(e => ESPACIO_LABELS[e] ?? e).join(', ')

  await $fetch(`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${airtableToken}`,
      'Content-Type': 'application/json',
    },
    body: {
      fields: {
        Nombre: data.nombre,
        Email: data.email,
        WhatsApp: data.telefono,
        'Tipo de evento': TIPO_LABELS[data.tipo] ?? data.tipo,
        'Fecha aproximada': data.fecha || '',
        Invitados: data.invitados,
        Espacios: espaciosText,
        Estilo: ESTILO_LABELS[data.estilo] ?? data.estilo,
        'Ideas especiales': data.ideasExtra || '',
        'Fecha de solicitud': new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }),
      },
    },
  })
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LeadData>(event)
  const config = useRuntimeConfig()

  // Validate required fields
  if (!body.nombre || !body.email || !body.telefono) {
    throw createError({ statusCode: 400, statusMessage: 'Nombre, email y teléfono son obligatorios' })
  }

  const errors: string[] = []

  // Send email notification
  if (config.resendApiKey) {
    try {
      const resend = new Resend(config.resendApiKey)
      await resend.emails.send({
        from: config.resendFromEmail as string || 'Inaka Moments <no-reply@inakamoments.com>',
        to: config.notificationEmail as string || 'inakamoments@gmail.com',
        replyTo: body.email,
        subject: `✨ Nueva solicitud — ${body.nombre} (${TIPO_LABELS[body.tipo] ?? body.tipo})`,
        html: buildEmailHtml(body),
      })
    }
    catch (err) {
      console.error('Error sending email:', err)
      errors.push('email')
    }
  }

  // Save to Airtable
  try {
    await saveToAirtable(body, config)
  }
  catch (err) {
    console.error('Error saving to Airtable:', err)
    errors.push('airtable')
  }

  return { ok: true, warnings: errors.length ? errors : undefined }
})
