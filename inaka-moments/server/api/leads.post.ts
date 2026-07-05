import { z } from 'zod'

/**
 * POST /api/leads — captura pública de leads (LeadWizard).
 *
 * Defensas en orden:
 *   1. Rate-limit por IP (5 peticiones / 10 min)
 *   2. Validación estricta con zod (incl. consentimiento RGPD obligatorio)
 *   3. Honeypot ("website"): si viene relleno, es un bot → 200 silencioso
 *   4. Cloudflare Turnstile verificado server-side
 * Después: inserción con service_role (RLS bloquea cualquier otra vía)
 * y aviso a la dueña por email (Resend). Devuelve { ok, notified } para
 * que el cliente decida si dispara su fallback (EmailJS).
 */

const leadSchema = z.object({
  nombre: z.string().trim().min(2, 'Nombre demasiado corto').max(120),
  email: z.string().trim().email('Email no válido').max(200),
  telefono: z.string().trim().min(7).max(30).optional().or(z.literal('')),
  tipo: z.string().max(40).optional().or(z.literal('')),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  invitados: z.string().max(40).optional().or(z.literal('')),
  espacios: z.array(z.string().max(40)).max(10).default([]),
  estilo: z.string().max(40).optional().or(z.literal('')),
  ideas_extra: z.string().max(2000).optional().or(z.literal('')),
  consent: z.literal(true, { message: 'Debes aceptar la política de privacidad' }),
  website: z.string().optional().default(''), // honeypot: debe llegar vacío
  turnstileToken: z.string().min(1, 'Verificación anti-spam requerida'),
  source: z.string().max(60).default('lead-wizard'),
  utm: z.record(z.string(), z.string().max(200)).default({}),
})

export default defineEventHandler(async (event) => {
  // 1 ─ Rate limit por IP
  assertRateLimit(event, 'leads', { max: 5, windowMs: 10 * 60 * 1000 })

  // 2 ─ Validación
  const parsed = leadSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: parsed.error.issues[0]?.message ?? 'Datos no válidos',
    })
  }
  const body = parsed.data

  // 3 ─ Honeypot: los bots lo rellenan; respondemos éxito sin persistir
  if (body.website !== '') {
    return { ok: true, notified: true }
  }

  // 4 ─ Turnstile (verificación server-side del token)
  const turnstile = await verifyTurnstileToken(body.turnstileToken, event)
  if (!turnstile.success) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'No hemos podido verificar que eres humano. Recarga la página e inténtalo de nuevo.',
    })
  }

  // 5 ─ Persistencia (service_role — única vía de escritura, RLS bloquea el resto)
  const supabase = useSupabaseAdmin(event)
  const { error } = await supabase.from('leads').insert({
    nombre: body.nombre,
    email: body.email,
    telefono: body.telefono || null,
    tipo: body.tipo || null,
    fecha: body.fecha || null,
    invitados: body.invitados || null,
    espacios: body.espacios,
    estilo: body.estilo || null,
    ideas_extra: body.ideas_extra || null,
    source: body.source,
    utm: body.utm,
  })

  if (error) {
    console.error('[leads] error insertando lead:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'No hemos podido registrar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.',
    })
  }

  // 6 ─ Aviso a la dueña (best-effort; el lead ya está a salvo en BD)
  const notified = await sendOwnerLeadNotification({
    nombre: body.nombre,
    email: body.email,
    telefono: body.telefono || undefined,
    tipo: body.tipo || undefined,
    fecha: body.fecha || undefined,
    invitados: body.invitados || undefined,
    espacios: body.espacios,
    estilo: body.estilo || undefined,
    ideas_extra: body.ideas_extra || undefined,
    source: body.source,
  })

  return { ok: true, notified }
})
