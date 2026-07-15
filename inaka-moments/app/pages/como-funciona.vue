<template>
  <main>
    <PageHero
      eyebrow="Así de fácil"
      title="Cómo funciona"
      subtitle="De la idea al momento inolvidable en cuatro pasos, con precios claros y sin sorpresas."
    />

    <!-- Pasos -->
    <section class="py-16 bg-white">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(paso, i) in pasos"
            :key="paso.titulo"
            class="relative rounded-2xl bg-inaka-cream p-8 ring-1 ring-inaka-nude"
          >
            <span class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-inaka-terra text-base font-bold text-inaka-cream">
              {{ i + 1 }}
            </span>
            <Icon :name="paso.icono" class="mb-3 h-8 w-8 text-inaka-gold" aria-hidden="true" />
            <h2 class="mb-2 font-display text-lg font-bold text-inaka-terra">{{ paso.titulo }}</h2>
            <p class="text-sm leading-relaxed text-inaka-terra/65">{{ paso.descripcion }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Condiciones claras (reglas del negocio desde BD) -->
    <section class="py-16 bg-inaka-cream">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="mb-10 text-center">
          <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-2">Sin letra pequeña</p>
          <h2 class="font-display text-3xl font-bold text-inaka-terra sm:text-4xl">Condiciones claras</h2>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="regla in reglas" :key="regla.titulo" class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-inaka-nude">
            <Icon :name="regla.icono" class="mb-3 h-6 w-6 text-inaka-gold" aria-hidden="true" />
            <h3 class="mb-1.5 font-bold text-inaka-terra">{{ regla.titulo }}</h3>
            <p class="text-sm leading-relaxed text-inaka-terra/65">{{ regla.texto }}</p>
          </div>
        </div>
        <p class="mt-8 text-center">
          <NuxtLink to="/faq" class="inline-flex items-center gap-1 rounded text-sm font-semibold text-inaka-gold outline-none hover:underline focus-visible:ring-2 focus-visible:ring-inaka-gold">
            Más dudas resueltas en las preguntas frecuentes
            <Icon name="lucide:arrow-right" class="h-3.5 w-3.5" aria-hidden="true" />
          </NuxtLink>
        </p>
      </div>
    </section>

    <CtaBand
      title="¿Empezamos con tu evento?"
      subtitle="Cuéntanos qué celebras y en 2 minutos tendrás tu solicitud de presupuesto en marcha."
      cta-label="Configurar mi presupuesto"
      cta-to="/configurador"
    />
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Cómo funciona — Inaka Moments',
  meta: [
    { name: 'description', content: 'Cómo trabajamos: eliges del catálogo, pedimos presupuesto, confirmas con la señal y montamos el día del evento. Montaje incluido, condiciones claras.' },
    { property: 'og:title', content: 'Cómo funciona — Inaka Moments' },
  ],
})

// Pasos del proceso (compartidos con la home) y reglas de negocio (desde
// site_content.settings, editables por la dueña en el admin).
const pasos = PROCESO_PASOS
const { rules: reglas } = useBusinessRules()
</script>
