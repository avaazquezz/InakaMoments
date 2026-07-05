<template>
  <div class="flex min-h-screen flex-col bg-inaka-cream font-sans text-inaka-terra">
    <TheHeader />
    <main class="flex flex-1 items-center justify-center py-24">
      <div class="px-4 text-center">
        <p class="mb-6 text-8xl font-bold text-inaka-gold/30">{{ error.statusCode }}</p>
        <h1 class="mb-4 text-3xl font-bold text-inaka-terra sm:text-4xl">
          {{ error.statusCode === 404 ? 'Página no encontrada' : 'Algo ha salido mal' }}
        </h1>
        <p class="mx-auto mb-10 max-w-md text-lg text-inaka-terra/60">
          {{ error.statusCode === 404
            ? 'Lo sentimos, la página que buscas no existe o ha sido movida.'
            : 'Ha ocurrido un error inesperado. Vuelve al inicio e inténtalo de nuevo.' }}
        </p>
        <div class="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            class="rounded-md bg-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-cream shadow-sm transition-opacity hover:opacity-90"
            @click="clearError({ redirect: '/' })"
          >
            Volver al inicio
          </button>
          <button
            type="button"
            class="rounded-md border border-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-terra transition-colors hover:bg-inaka-nude"
            @click="clearError({ redirect: '/contacto' })"
          >
            Contactar
          </button>
        </div>
      </div>
    </main>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

useHead({
  title: 'Página no encontrada | Inaka Moments',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})
</script>
