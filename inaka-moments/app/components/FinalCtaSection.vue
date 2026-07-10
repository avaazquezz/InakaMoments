<template>
  <section class="relative overflow-hidden bg-inaka-terra py-24 text-inaka-cream">
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-inaka-mauve/20 blur-3xl" />
      <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/15 blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
      <p class="mb-4 text-sm font-semibold uppercase tracking-widest text-inaka-gold">Tú eliges, nosotros creamos</p>
      <h2 class="text-3xl font-bold sm:text-4xl lg:text-5xl">¿List@ para diseñar tu evento?</h2>
      <p class="mx-auto mt-4 max-w-2xl text-lg text-inaka-cream/75">
        Combina lo que más te guste en el configurador y ve el precio al instante. Sin compromiso: te preparamos una propuesta a medida.
      </p>
      <div class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <NuxtLink
          to="/configurador"
          class="inline-flex items-center gap-2 rounded-md bg-inaka-gold px-8 py-4 text-sm font-semibold text-inaka-terra shadow-sm transition-opacity hover:opacity-90"
        >
          Configurar mi presupuesto
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </NuxtLink>
        <NuxtLink
          to="/contacto"
          class="inline-flex items-center gap-2 rounded-md border border-inaka-cream/40 px-8 py-4 text-sm font-semibold text-inaka-cream transition-colors hover:bg-inaka-cream/10"
        >
          Hablar con nosotras
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Sección puramente presentacional (banda de cierre de la home).
</script>
