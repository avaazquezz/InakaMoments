import * as Sentry from '@sentry/nuxt'

// runtimeConfig no está disponible en este punto de arranque del servidor
// (según la documentación de @sentry/nuxt) — se lee la env var directamente.
// DSN vacío (sin cuenta de Sentry configurada todavía) → el SDK queda no-op.
Sentry.init({
  dsn: process.env.NUXT_PUBLIC_SENTRY_DSN || '',
  tracesSampleRate: 1.0,
})
