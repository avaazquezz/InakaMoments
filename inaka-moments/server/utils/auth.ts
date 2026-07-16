import type { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import type { JwtPayload } from '@supabase/supabase-js'

/**
 * Exige una sesión de Supabase Auth válida Y (si está configurada) que el
 * email esté en NUXT_ADMIN_ALLOWED_EMAILS (coma-separado). Sin esa variable,
 * no se restringe. Debe ser la primera línea de todo endpoint
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

  const allowed = useRuntimeConfig(event)
    .adminAllowedEmails.split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean)

  if (allowed.length && !allowed.includes(user.email?.toLowerCase() ?? '')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Esta cuenta no tiene acceso al panel de administración.',
    })
  }

  return user
}
