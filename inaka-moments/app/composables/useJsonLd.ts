/**
 * Inyecta uno o varios bloques `<script type="application/ld+json">` en
 * <head>. `key` debe ser único por sitio de llamada (p.ej. 'home',
 * 'product', 'local-business'): sin él, la hidratación cliente no reconoce
 * el `<script>` ya renderizado en el HTML del servidor y lo duplica; con un
 * `key` COMPARTIDO entre dos llamadas distintas (p.ej. layout y página),
 * unhead trata la segunda como reemplazo de la primera y la primera
 * desaparece. Ninguna de las dos formas de fallo es obvia sin probarlo en
 * el navegador — de ahí este comentario.
 */
export function useJsonLd(key: string, getSchema: () => Record<string, unknown> | Record<string, unknown>[] | null) {
  useHead(() => {
    const schema = getSchema()
    if (!schema) return {}
    const list = Array.isArray(schema) ? schema : [schema]
    if (!list.length) return {}
    return {
      script: list.map((s, i) => ({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(s),
        key: `ld-json-${key}-${i}`,
      })),
    }
  })
}
