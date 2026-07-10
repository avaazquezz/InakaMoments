/**
 * Red de seguridad adicional: protege TODA ruta bajo /api/admin/** aunque
 * algún endpoint futuro olvide llamar a `requireAdminUser` como primera
 * línea. No sustituye esa llamada explícita (se mantiene en cada handler,
 * autodocumentada) — es cinturón y tirantes.
 */
export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/admin/')) return
  await requireAdminUser(event)
})
