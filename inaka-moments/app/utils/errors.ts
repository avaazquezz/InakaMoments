/**
 * Mensaje de error de un `$fetch` fallido (Nitro envuelve el `message` del
 * `createError` del servidor en `err.data.message`), con fallback si el
 * error no trae esa forma. Evita `catch (err: any)` repetido en cada
 * formulario del admin.
 */
export function apiErrorMessage(err: unknown, fallback: string): string {
  return (err as { data?: { message?: string } })?.data?.message ?? fallback
}
