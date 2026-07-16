import { defineConfig } from 'vitest/config'

// Sin @nuxt/test-utils: shared/*.ts es código puro (sin composables ni
// contexto Nuxt), no necesita el entorno de Nuxt para testearse.
export default defineConfig({
  test: {
    include: ['shared/**/*.test.ts'],
  },
})
