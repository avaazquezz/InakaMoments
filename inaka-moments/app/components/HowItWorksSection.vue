<template>
  <section class="py-20 bg-white sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-inaka-gold">Así de fácil</p>
        <h2 class="text-3xl font-bold text-inaka-terra sm:text-4xl">Cómo funciona</h2>
        <p class="mx-auto mt-3 max-w-2xl text-inaka-terra/65">
          De la idea al momento inolvidable en cuatro pasos, con precios claros y sin sorpresas.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(paso, i) in PROCESO_PASOS"
          :key="paso.titulo"
          class="relative rounded-2xl bg-inaka-cream p-7 ring-1 ring-inaka-nude"
        >
          <div class="mb-4 flex items-center gap-3">
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-inaka-terra text-sm font-bold text-inaka-cream">{{ i + 1 }}</span>
            <span class="text-3xl" aria-hidden="true">{{ paso.icono }}</span>
          </div>
          <h3 class="mb-1.5 font-bold text-inaka-terra">{{ paso.titulo }}</h3>
          <p class="text-sm leading-relaxed text-inaka-terra/65">{{ paso.descripcion }}</p>
          <span
            v-if="i < PROCESO_PASOS.length - 1"
            class="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 text-inaka-gold/50 lg:block"
            aria-hidden="true"
          >→</span>
        </div>
      </div>

      <div class="mt-10 text-center">
        <NuxtLink
          to="/como-funciona"
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-inaka-gold hover:underline"
        >
          Ver todos los detalles y condiciones
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// PROCESO_PASOS se auto-importa desde app/utils/content.ts
</script>
