import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~~/app/types/database'

/**
 * Cliente Supabase con service_role (bypassa RLS) tipado con el esquema.
 *
 * ⚠️ SOLO para uso en server/api/**. La service_role key nunca debe llegar
 * al cliente. Toda escritura (leads, quotes, admin, storage) pasa por aquí.
 */
export function useSupabaseAdmin(event: H3Event) {
  return serverSupabaseServiceRole<Database>(event)
}
