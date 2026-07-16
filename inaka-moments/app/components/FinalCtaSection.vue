<template>
  <section class="relative overflow-hidden bg-inaka-terra py-24 text-inaka-cream">
    <div
      class="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <div class="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-inaka-mauve/20 blur-3xl" />
      <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/15 blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
      <p class="mb-4 text-sm font-semibold uppercase tracking-widest text-inaka-gold">
        Tú eliges, nosotros creamos
      </p>
      <h2 class="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
        ¿List@ para diseñar tu evento?
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-lg text-inaka-cream/75">
        Combina lo que más te guste en el configurador y ve el precio al instante. Sin compromiso: te preparamos una propuesta a medida.
      </p>
      <div class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <BaseButtonLink
          to="/configurador"
          variant="accent"
        >
          Configurar mi presupuesto
        </BaseButtonLink>
        <BaseButtonLink
          to="/contacto"
          variant="outline"
          :icon="undefined"
        >
          Hablar con nosotras
        </BaseButtonLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Sección puramente presentacional (banda de cierre de la home).
</script>
