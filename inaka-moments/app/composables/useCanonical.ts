/**
 * Canonical + og:url dinámicos por ruta. Se llama UNA vez en
 * app/layouts/default.vue — antes cada página heredaba el mismo canonical
 * y og:url fijos a la home (`nuxt.config.ts`), lo que hacía que Google
 * tratase el resto del sitio como contenido duplicado y que compartir
 * cualquier producto/pack en WhatsApp/Instagram mostrase la preview de la
 * home en vez de la del enlace real.
 */
export function useCanonical() {
  const route = useRoute()
  useHead(() => {
    const url = `https://inakamoments.com${route.path}`
    return {
      link: [{ rel: 'canonical', href: url }],
      meta: [{ property: 'og:url', content: url }],
    }
  })
}
