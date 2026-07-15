import { z } from 'zod'

/**
 * POST /api/resena/[token] — envío del formulario público de reseña.
 * Defensas: rate-limit por IP, zod, honeypot (sin Turnstile: el enlace solo
 * llega por email a un cliente real, no es un formulario abierto/indexable).
 */

const reviewSubmissionSchema = z.object({
  author: z.string().trim().min(2, 'Cuéntanos cómo te llamas').max(120),
  quote: z.string().trim().min(10, 'Cuéntanos un poco más').max(2000),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  website: z.string().optional().default(''), // honeypot
})

export default defineEventHandler(async (event) => {
  assertRateLimit(event, 'resena-post', { max: 5, windowMs: 10 * 60 * 1000 })

  const token = getRouterParam(event, 'token')
  if (!token) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el enlace.' })

  const parsed = reviewSubmissionSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data

  // Honeypot: los bots lo rellenan; éxito silencioso sin persistir.
  if (body.website !== '') {
    return { ok: true }
  }

  const supabase = useSupabaseAdmin(event)
  const { data: existing, error: fetchErr } = await supabase
    .from('testimonials')
    .select('id, responded_at')
    .eq('token', token)
    .maybeSingle()

  if (fetchErr) {
    console.error('[resena] error consultando token:', fetchErr)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido guardar tu opinión.' })
  }
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Este enlace no es válido.' })
  }
  if (existing.responded_at) {
    throw createError({ statusCode: 409, statusMessage: 'Conflict', message: 'Ya has enviado tu opinión. ¡Gracias!' })
  }

  const { error: updateErr } = await supabase
    .from('testimonials')
    .update({
      author: body.author,
      quote: body.quote,
      rating: body.rating ?? null,
      responded_at: new Date().toISOString(),
    })
    .eq('id', existing.id)

  if (updateErr) {
    console.error('[resena] error guardando respuesta:', updateErr)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido guardar tu opinión.' })
  }

  return { ok: true }
})
