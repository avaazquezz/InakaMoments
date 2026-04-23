// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/sitemap',
      {
        urls: [
          { loc: '/', changefreq: 'weekly', priority: 1.0 },
          { loc: '/servicios', changefreq: 'monthly', priority: 0.8 },
          { loc: '/galeria', changefreq: 'weekly', priority: 0.9 },
          { loc: '/contacto', changefreq: 'monthly', priority: 0.7 },
          { loc: '/politica-privacidad', changefreq: 'yearly', priority: 0.3 },
          { loc: '/aviso-legal', changefreq: 'yearly', priority: 0.3 },
        ],
      },
    ],
  ],
  runtimeConfig: {
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
})
