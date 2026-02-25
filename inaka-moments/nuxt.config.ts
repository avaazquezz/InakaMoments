// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'Inaka Moments — Decoración de eventos con alma',
      meta: [
        { name: 'description', content: 'Diseñamos experiencias únicas para bodas, comuniones, cumpleaños y eventos corporativos. Cada detalle cuidado con mimo.' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },
})
