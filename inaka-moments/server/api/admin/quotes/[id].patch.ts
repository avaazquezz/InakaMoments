import { z } from 'zod'
import { round2 } from '~~/shared/configurator'
import { EVENT_TYPES } from '~~/shared/eventTypes'

/**
 * PATCH /api/admin/quotes/[id] — edita datos del cliente/evento, notas y
 * ajustes manuales. NO permite pasar `status` a 'aceptado' (eso solo lo
 * hace POST /accept, que además crea el evento). Si llegan `adjustments`,
 * se recalcula `total` desde el `subtotal` ya guardado — este endpoint no
 * toca `quote_items` (eso es PATCH /items).
 */

const adjustmentSchema = z.object({
  key: z.string().max(40),
  label: z.string().max(120),
  amount: z.number().nullable(),
  note: z.string().max(200).optional(),
})

const updateSchema = z.object({
  client_name: z.string().max(160).optional(),
  client_email: z.string().email().max(200).optional(),
  client_phone: z.string().max(30).optional(),
  event_type: z.enum(EVENT_TYPES).nullable().optional(),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  location: z.string().max(300).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  valid_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  deposit_amount: z.number().min(0).nullable().optional(),
  adjustments: z.array(adjustmentSchema).max(20).optional(),
  status: z.enum(['borrador', 'enviado', 'rechazado', 'caducado']).optional(),
})

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const parsed = updateSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: parsed.error.issues[0]?.message ?? 'Datos no válidos' })
  }
  const body = parsed.data
  const supabase = useSupabaseAdmin(event)

  const update: Record<string, unknown> = { ...body }

  if (body.adjustments) {
    const { data: current, error: fetchErr } = await supabase.from('quotes').select('subtotal').eq('id', id).maybeSingle()
    if (fetchErr || !current) {
      throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Presupuesto no encontrado.' })
    }
    const numeric = body.adjustments.reduce((s, a) => s + (a.amount ?? 0), 0)
    update.total = round2(current.subtotal + numeric)
  }

  const { error } = await supabase.from('quotes').update(update).eq('id', id)
  if (error) {
    console.error('[admin/quotes] error actualizando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido guardar el presupuesto.' })
  }
  return { ok: true }
})
