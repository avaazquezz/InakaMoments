<template>
  <section class="py-20 bg-white sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-inaka-gold">Sin letra pequeña</p>
        <h2 class="text-3xl font-bold text-inaka-terra sm:text-4xl">Por qué elegir Inaka Moments</h2>
        <p class="mx-auto mt-3 max-w-2xl text-inaka-terra/65">
          Precios claros y condiciones honestas desde el primer momento. Esto es lo que siempre está incluido.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="rule in rules"
          :key="rule.titulo"
          class="group flex gap-4 rounded-2xl bg-inaka-cream p-6 ring-1 ring-inaka-nude transition-shadow hover:shadow-md"
        >
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm ring-1 ring-inaka-nude" aria-hidden="true">{{ rule.icono }}</span>
          <div>
            <h3 class="font-bold text-inaka-terra">{{ rule.titulo }}</h3>
            <p class="mt-1 text-sm leading-relaxed text-inaka-terra/65">{{ rule.texto }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { rules } = useBusinessRules()
</script>
