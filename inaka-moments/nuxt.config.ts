// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap'],
  runtimeConfig: {
    public: {
      emailjsServiceId: process.env.EMAILJS_SERVICE_ID || '',
      emailjsTemplateId: process.env.EMAILJS_TEMPLATE_ID || '',
      emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY || '',
    },
  },
  app: {
    head: {
      title: 'Inaka Moments — Decoración de eventos con alma',
      meta: [
        { name: 'description', content: 'Diseñamos experiencias únicas para bodas, comuniones, cumpleaños y eventos corporativos. Cada detalle cuidado con mimo.' },
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
  // Admin panel = SPA (no SSR, no SEO)
  routeRules: {
    '/admin/**': { ssr: false },
  },
  // Serve uploaded files from the host-mounted uploads directory at runtime
  // (not bundled at build time — we need dynamic content persistence)
  nitro: {
    routes: {
      '/uploads': {
        keepalive: true,
        cache: {
          maxAge: 60 * 60 * 24 * 30, // 30 days cache for uploaded images
        },
      },
    },
  },
  sitemap: {
    hostname: 'https://inakamoments.com',
    routes: [
      { url: '/', changefreq: 'weekly', priority: 1.0 },
      { url: '/servicios', changefreq: 'monthly', priority: 0.8 },
      { url: '/galeria', changefreq: 'weekly', priority: 0.9 },
      { url: '/contacto', changefreq: 'monthly', priority: 0.7 },
      { url: '/politica-privacidad', changefreq: 'yearly', priority: 0.3 },
      { url: '/aviso-legal', changefreq: 'yearly', priority: 0.3 },
    ],
  },
})