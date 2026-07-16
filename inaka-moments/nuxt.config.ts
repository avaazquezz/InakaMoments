import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/turnstile',
    '@vite-pwa/nuxt',
    '@nuxt/eslint',
    '@sentry/nuxt/module',
    [
      '@nuxtjs/sitemap',
      {
        // Sin esto, el módulo autodescubre TODAS las páginas del proyecto,
        // incluido /admin/** (panel privado) — se colaban 15 rutas del
        // panel (login, productos/nuevo, etc.) en el sitemap público.
        exclude: ['/admin/**'],
        // Fuente dinámica (productos/packs activos) — ver server/api/__sitemap__/urls.ts.
        // Se fusiona sola con la lista estática de abajo (páginas fijas + ocasiones).
        sources: ['/api/__sitemap__/urls'],
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
  ssr: true,
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Inaka Moments — Decoración de eventos con alma',
      meta: [
        { name: 'description', content: 'Diseñamos experiencias únicas para cumpleaños, baby showers, bautizos, comuniones y eventos corporativos. Cada detalle cuidado con mimo.' },
        { property: 'og:site_name', content: 'Inaka Moments' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://inakamoments.com' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'theme-color', content: '#8B3A2A' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Inaka Moments' },
      ],
      link: [
        // Canonical dinámico por ruta: ver app/composables/useCanonical.ts,
        // llamado desde app/layouts/default.vue. Fijarlo aquí a la home
        // hacía que Google tratase el resto del sitio como duplicado.
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      // Umami Cloud: sin NUXT_PUBLIC_UMAMI_WEBSITE_ID (sin cuenta creada
      // todavía) no se inyecta el script — ni en dev ni en prod.
      script: process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID
        ? [{ 'src': 'https://cloud.umami.is/script.js', 'defer': true, 'data-website-id': process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID }]
        : [],
    },
  },
  css: [
    '@fontsource/fraunces/400.css',
    '@fontsource/fraunces/500.css',
    '@fontsource/fraunces/600.css',
    '@fontsource/fraunces/700.css',
    '@fontsource/inter/400.css',
    '@fontsource/inter/500.css',
    '@fontsource/inter/600.css',
    '@fontsource/inter/700.css',
  ],
  runtimeConfig: {
    // ── Solo servidor (override en runtime con NUXT_<KEY>) ──
    turnstile: {
      // Secreto de TEST (siempre pasa). Producción: NUXT_TURNSTILE_SECRET_KEY.
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA',
    },
    resendApiKey: '', // NUXT_RESEND_API_KEY (si vacío → sin email server-side)
    emailFrom: 'Inaka Moments <onboarding@resend.dev>', // NUXT_EMAIL_FROM (dominio verificado en prod)
    emailBusiness: 'nadine.tcae@gmail.com', // NUXT_EMAIL_BUSINESS (aviso de nuevos leads)
    adminAllowedEmails: '', // NUXT_ADMIN_ALLOWED_EMAILS (coma-separado; vacío = sin restricción)
    public: {
      emailjsServiceId: '',
      emailjsTemplateId: '',
      emailjsPublicKey: '',
      emailjsRecipient: 'nadine.tcae@gmail.com',
      sentry: {
        dsn: process.env.NUXT_PUBLIC_SENTRY_DSN || '', // vacío → SDK no-op, sin cuenta de Sentry todavía
      },
      umamiWebsiteId: process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID || '', // vacío → no se carga el script
    },
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
    // ponytail: se intentó swr/isr en páginas públicas para caché de Nitro,
    // pero el driver de cache en fs (unstorage) rompe con EISDIR al escribir
    // '.nuxt/cache/nuxt/payload' en este entorno Docker (volumen bind-mount)
    // en cuanto hay más de una variante de una misma ruta — 500 real,
    // reproducible con cualquier query string. Revertido: sin caché de
    // rutas por ahora. Retomar si hace falta, probando primero fuera de
    // Docker o con otro storage driver (redis/memory) para el cache de Nitro.
  },
  sourcemap: { client: 'hidden' },
  compatibilityDate: '2025-07-15',
  vite: {
    // @emailjs/browser solo lo importa configurador.vue; sin esto, Vite lo
    // descubre en caliente la primera vez y fuerza un reload completo de
    // página (dev) — se nota como "el primer click en Presupuesto se cuelga".
    optimizeDeps: { include: ['@emailjs/browser'] },
  },
  eslint: {
    config: {
      // El estilo del proyecto ya coincide con los defaults de stylistic
      // (comillas simples, sin punto y coma, indent 2) — sin Prettier
      // como segundo binario para evitar reglas contradictorias.
      stylistic: true,
    },
  },
  icon: {
    // Una sola colección explícita (no el paquete genérico @iconify/json,
    // que arrastra miles de colecciones) — mantiene el bundle acotado.
    serverBundle: { collections: ['lucide'] },
  },
  image: {
    // Dominios remotos que IPX puede optimizar (placeholders + Supabase Storage)
    domains: ['picsum.photos', 'kdjsbvvmcilbcycgxygo.supabase.co'],
  },
  // PWA de la web pública. El manifest se inyecta a mano con <NuxtPwaManifest/>
  // (el módulo NO lo inyecta solo) — así el panel /admin puede usar su propio
  // manifest estático (`public/admin-manifest.webmanifest`) sin colisionar,
  // ver app/layouts/default.vue y app/layouts/admin.vue.
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Inaka Moments',
      short_name: 'Inaka Moments',
      description: 'Decoración de eventos con globos: catálogo, packs y presupuesto al instante.',
      lang: 'es',
      theme_color: '#8B3A2A',
      background_color: '#FAFAF8',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
        { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      // Amplía los patrones por defecto (js/css/html) para precachear también
      // iconos y fuentes autoalojadas.
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      runtimeCaching: [
        // Datos de negocio del panel: nunca servir nada obsoleto sin avisar.
        {
          urlPattern: ({ url }) => url.pathname.startsWith('/api/admin/'),
          handler: 'NetworkOnly',
        },
        // Resto de la API pública (quotes, resena, geocode): red primero,
        // con fallback de caché muy corto si no hay conexión.
        {
          urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 6,
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        // Páginas públicas navegadas: quedan disponibles offline si ya se
        // visitaron. El panel /admin queda fuera a propósito (depende de
        // sesión + datos frescos, no de una experiencia offline real).
        {
          urlPattern: ({ request, url }) => request.mode === 'navigate' && !url.pathname.startsWith('/admin'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages-cache',
            networkTimeoutSeconds: 6,
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: ({ request }) => request.destination === 'image',
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: ({ request }) => request.destination === 'font',
          handler: 'CacheFirst',
          options: {
            cacheName: 'fonts-cache',
            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
    },
  },
  // Sin DSN configurado (NUXT_PUBLIC_SENTRY_DSN vacío) el SDK no envía nada.
  sentry: {
    sourceMapsUploadOptions: {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },
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
  turnstile: {
    // Clave de TEST de Cloudflare (siempre pasa). En producción define
    // NUXT_PUBLIC_TURNSTILE_SITE_KEY con la clave real del dominio.
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
  },
})
