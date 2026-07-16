/**
 * Canonical dinámico por ruta. Se llama UNA vez en app/layouts/default.vue —
 * antes cada página heredaba el mismo canonical fijo a la home
 * (`nuxt.config.ts`), lo que hacía que Google tratase el resto del sitio
 * como contenido duplicado.
 */
export function useCanonical() {
  const route = useRoute()
  useHead(() => ({
    link: [{ rel: 'canonical', href: `https://inakamoments.com${route.path}` }],
  }))
}
