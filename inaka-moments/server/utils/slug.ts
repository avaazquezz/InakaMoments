/** Convierte un texto libre en un slug URL-safe (minúsculas, sin acentos, guiones). */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos/diacríticos tras la normalización NFD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/**
 * Genera un slug único a partir de un texto, añadiendo `-2`, `-3`... si hace
 * falta. `exists` consulta si un slug concreto ya está en uso (excluyendo,
 * si aplica, el propio registro que se está editando).
 */
export async function uniqueSlug(
  text: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(text) || 'item'
  let candidate = base
  let n = 2
  while (await exists(candidate)) {
    candidate = `${base}-${n}`
    n++
  }
  return candidate
}
