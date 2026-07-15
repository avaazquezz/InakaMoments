import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@nuxtjs/turnstile',
    [
      '@nuxtjs/sitemap',
      {
        // Sitemap estático por ahora; en Fase 8 pasa a dinámico (BD).
        urls: [
          { loc: '/', changefreq: 'weekly', priority: 1.0 },
          { loc: '/catalogo', changefreq: 'weekly', priority: 0.9 },
          { loc: '/configurador', changefreq: 'monthly', priority: 0.9 },
          { loc: '/packs', changefreq: 'monthly', priority: 0.8 },
          { loc: '/galeria', changefreq: 'weekly', priority: 0.8 },
          { loc: '/como-funciona', changefreq: 'monthly', priority: 0.7 },
          { loc: '/faq', changefreq: 'monthly', priority: 0.6 },
          { loc: '/resenas', changefreq: 'monthly', priority: 0.5 },
          { loc: '/contacto', changefreq: 'monthly', priority: 0.7 },
          { loc: '/ocasiones/cumpleanos', changefreq: 'monthly', priority: 0.8 },
          { loc: '/ocasiones/baby-shower', changefreq: 'monthly', priority: 0.8 },
          { loc: '/ocasiones/bautizos', changefreq: 'monthly', priority: 0.8 },
          { loc: '/ocasiones/comuniones', changefreq: 'monthly', priority: 0.8 },
          { loc: '/ocasiones/graduaciones', changefreq: 'monthly', priority: 0.8 },
          { loc: '/ocasiones/despedidas', changefreq: 'monthly', priority: 0.8 },
          { loc: '/ocasiones/jubilaciones', changefreq: 'monthly', priority: 0.8 },
          { loc: '/ocasiones/corporativo', changefreq: 'monthly', priority: 0.8 },
          { loc: '/politica-privacidad', changefreq: 'yearly', priority: 0.3 },
          { loc: '/aviso-legal', changefreq: 'yearly', priority: 0.3 },
        ],
      },
    ],
  ],
  vite: {
    // @emailjs/browser solo lo importa configurador.vue; sin esto, Vite lo
    // descubre en caliente la primera vez y fuerza un reload completo de
    // página (dev) — se nota como "el primer click en Presupuesto se cuelga".
    optimizeDeps: { include: ['@emailjs/browser'] },
  },
  routeRules: {
    // La antigua página de servicios queda absorbida por el catálogo
    '/servicios': { redirect: { to: '/catalogo', statusCode: 301 } },
    // El panel /admin va sin SSR: es privado (sin SEO que ganar) y así se
    // evita el problema clásico de Nuxt donde las llamadas `useFetch` a
    // rutas propias durante el render de servidor NO reenvían las cookies
    // de la petición original — provocaba 401 en /api/admin/** aunque el
    // navegador ya tuviera sesión. Con ssr:false, todo el fetch de datos
    // ocurre en el cliente, donde el navegador sí adjunta la cookie.
    '/admin/**': { ssr: false },
  },
  // Supabase: URL y claves se leen de SUPABASE_URL / SUPABASE_KEY /
  // SUPABASE_SERVICE_KEY (esta última SOLO servidor, nunca llega al cliente).
  supabase: {
    // Solo el panel /admin requiere sesión; la web pública queda libre.
    redirectOptions: {
      login: '/admin/login',
      // No usamos OAuth/magic-link (solo email+password), así que esta ruta
      // de callback nunca se visita de verdad — login.vue/reset-password.vue
      // hacen su propio navigateTo('/admin') tras autenticar. Se apunta a
      // /admin/login (ya excluida) para no dejarla como '/admin': el
      // middleware global del módulo excluye SIEMPRE [login, callback, ...
      // exclude] de la comprobación de sesión, así que con callback:'/admin'
      // la ruta raíz del panel quedaba sin protección de redirect (bug real,
      // corregido aquí).
      callback: '/admin/login',
      include: ['/admin(/*)?'],
      exclude: ['/admin/login', '/admin/reset-password'],
    },
    types: '~~/app/types/database.ts',
  },
  image: {
    // Dominios remotos que IPX puede optimizar (placeholders + Supabase Storage)
    domains: ['picsum.photos', 'kdjsbvvmcilbcycgxygo.supabase.co'],
  },
  turnstile: {
    // Clave de TEST de Cloudflare (siempre pasa). En producción define
    // NUXT_PUBLIC_TURNSTILE_SITE_KEY con la clave real del dominio.
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
  },
  runtimeConfig: {
    // ── Solo servidor (override en runtime con NUXT_<KEY>) ──
    turnstile: {
      // Secreto de TEST (siempre pasa). Producción: NUXT_TURNSTILE_SECRET_KEY.
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA',
    },
    resendApiKey: '',                        // NUXT_RESEND_API_KEY (si vacío → sin email server-side)
    emailFrom: 'Inaka Moments <onboarding@resend.dev>', // NUXT_EMAIL_FROM (dominio verificado en prod)
    emailBusiness: 'nadine.tcae@gmail.com',  // NUXT_EMAIL_BUSINESS (aviso de nuevos leads)
    public: {
      emailjsServiceId: '',
      emailjsTemplateId: '',
      emailjsPublicKey: '',
      emailjsRecipient: 'nadine.tcae@gmail.com',
    },
  },
  app: {
    head: {
      title: 'Inaka Moments — Decoración de eventos con alma',
      meta: [
        { name: 'description', content: 'Diseñamos experiencias únicas para cumpleaños, baby showers, bautizos, comuniones y eventos corporativos. Cada detalle cuidado con mimo.' },
        { property: 'og:site_name', content: 'Inaka Moments' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://inakamoments.com' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'canonical', href: 'https://inakamoments.com' },
      ],
    },
  },
})
