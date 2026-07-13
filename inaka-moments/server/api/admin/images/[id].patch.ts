import { z } from 'zod'

const updateSchema = z.object({
  alt: z.string().max(200).optional().or(z.literal('')),
  featured: z.boolean().optional(),
  sort_order: z.number().int().optional(),
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

  const { error } = await supabase
    .from('gallery_images')
    .update({ ...body, alt: body.alt || null })
    .eq('id', id)

  if (error) {
    console.error('[admin/images] error actualizando:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'No se ha podido guardar la foto.' })
  }
  return { ok: true }
})
