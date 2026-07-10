import type { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import type { JwtPayload } from '@supabase/supabase-js'

/**
 * Exige una sesión de Supabase Auth válida. Modelo de un único admin: no hay
 * tabla de roles — cualquier usuario autenticado ES la dueña (solo ella
 * tendrá credenciales). Debe ser la primera línea de todo endpoint
 * `server/api/admin/**` (además de la red de `server/middleware/admin-guard.ts`).
 */
export async function requireAdminUser(event: H3Event): Promise<JwtPayload> {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Debes iniciar sesión para acceder al panel.',
    })
  }
  return user
}
