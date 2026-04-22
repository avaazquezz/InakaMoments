<template>
  <div class="bg-inaka-cream text-inaka-terra min-h-screen font-sans flex flex-col">
    <TheHeader />
    <main class="flex-1 flex items-center justify-center py-24">
      <div class="text-center px-4">
        <p class="text-8xl font-bold text-inaka-gold/30 mb-6">404</p>
        <h1 class="text-3xl font-bold text-inaka-terra sm:text-4xl mb-4">
          Página no encontrada
        </h1>
        <p class="text-inaka-terra/60 text-lg mb-10 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink
            to="/"
            class="rounded-md bg-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-cream shadow-sm transition-opacity hover:opacity-90"
          >
            Volver al inicio
          </NuxtLink>
          <NuxtLink
            to="/contacto"
            class="rounded-md border border-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-terra transition-colors hover:bg-inaka-nude"
          >
            Contactar
          </NuxtLink>
        </div>
      </div>
    </main>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '404 — Página no encontrada | Inaka Moments',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
})
</script>
