// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    // Server-only secrets (never exposed to the client)
    resendApiKey: process.env.RESEND_API_KEY ?? '',
    resendFromEmail: process.env.RESEND_FROM_EMAIL ?? '',
    notificationEmail: process.env.NOTIFICATION_EMAIL ?? '',
    airtableToken: process.env.AIRTABLE_TOKEN ?? '',
    airtableBaseId: process.env.AIRTABLE_BASE_ID ?? '',
    airtableTableId: process.env.AIRTABLE_TABLE_ID ?? '',
  },

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
