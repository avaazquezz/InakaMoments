import * as Sentry from '@sentry/nuxt'

// DSN vacío (sin cuenta de Sentry configurada todavía) → el SDK queda no-op.
Sentry.init({
  dsn: useRuntimeConfig().public.sentry.dsn,
  tracesSampleRate: 1.0,
})
