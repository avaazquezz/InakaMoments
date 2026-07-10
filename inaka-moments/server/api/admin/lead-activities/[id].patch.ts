import { z } from 'zod'

const updateSchema = z.object({ done: z.boolean().optional(), note: z.string().max(2000).optional() })

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Falta el identificador.' })

  const parsed = updateSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Datos no válidos.' })
  }
  const supabase = useSupabaseAdmin(event)
  const { error } = await supabase.from('lead_activities').update(parsed.data).eq('id', id)

  if (error) {
    console.error('[admin/lead-activities] error actualizando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido guardar la actividad.' })
  }
  return { ok: true }
})
