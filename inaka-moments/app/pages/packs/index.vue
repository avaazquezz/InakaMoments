<template>
  <main>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-inaka-cream py-24 sm:py-32">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-inaka-mauve/10 blur-3xl" />
        <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/10 blur-3xl" />
      </div>
      <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-4">Todo pensado, todo incluido</p>
        <h1 class="text-4xl font-bold text-inaka-terra sm:text-5xl lg:text-6xl mb-6">
          Packs completos
        </h1>
        <p class="text-inaka-terra/70 text-lg max-w-2xl mx-auto">
          Combinaciones cerradas de nuestros productos favoritos, listas para montar el día de tu evento
          a un precio redondo.
        </p>
      </div>
    </section>

    <!-- Packs -->
    <section class="py-16 bg-white">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div v-if="pending" class="py-20 text-center text-inaka-terra/50">Cargando packs…</div>

        <div v-else-if="packs.length" class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <NuxtLink
            v-for="pack in packs"
            :key="pack.id"
            :to="`/packs/${pack.slug}`"
            class="group relative flex flex-col overflow-hidden rounded-3xl bg-inaka-cream p-8 shadow-sm ring-1 ring-inaka-nude transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-inaka-gold/0 via-inaka-gold to-inaka-gold/0 opacity-0 transition-opacity group-hover:opacity-100" />
            <div class="mb-4 flex items-start justify-between gap-4">
              <h2 class="text-2xl font-bold text-inaka-terra">{{ pack.name }}</h2>
              <span v-if="pack.price != null" class="shrink-0 rounded-full bg-inaka-terra px-4 py-1.5 text-sm font-bold text-inaka-cream">
                {{ formatEUR(pack.price) }}
              </span>
            </div>
            <p class="mb-5 text-inaka-terra/65 leading-relaxed">{{ pack.description }}</p>
            <ul class="mb-6 flex flex-col gap-2">
              <li
                v-for="item in packIncludes(pack)"
                :key="item"
                class="flex items-start gap-2 text-sm text-inaka-terra/60"
              >
                <span class="text-inaka-gold mt-0.5">✓</span>
                {{ item }}
              </li>
            </ul>
            <span class="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-inaka-gold transition-transform group-hover:translate-x-0.5">
              Ver pack completo
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
          </NuxtLink>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
          <span class="text-5xl mb-4">🎁</span>
          <p class="text-inaka-terra/60 text-lg">Estamos preparando nuevos packs. ¡Vuelve pronto!</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-inaka-terra text-inaka-cream">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold sm:text-4xl mb-5">¿Prefieres montarlo a tu manera?</h2>
        <p class="text-inaka-cream/70 text-lg mb-8 max-w-2xl mx-auto">
          Todos los productos del catálogo se pueden combinar entre sí. Elige los que más te gusten
          en el configurador y ve el precio al instante.
        </p>
        <div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <NuxtLink
            to="/configurador"
            class="inline-flex items-center gap-2 rounded-md bg-inaka-gold px-8 py-4 text-sm font-semibold text-inaka-terra shadow-sm transition-opacity hover:opacity-90"
          >
            Configurar mi presupuesto
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </NuxtLink>
          <NuxtLink
            to="/catalogo"
            class="inline-flex items-center gap-2 rounded-md border border-inaka-cream/40 px-8 py-4 text-sm font-semibold text-inaka-cream transition-colors hover:bg-inaka-cream/10"
          >
            Explorar el catálogo
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Packs completos — Inaka Moments',
  meta: [
    { name: 'description', content: 'Packs cerrados de decoración con globos, como el Pack Baby "Dulce Espera" por 130€: cajas BABY, osito, cartel LED, arco y guirnalda. Abrera y Barcelona.' },
    { property: 'og:title', content: 'Packs — Inaka Moments' },
    { property: 'og:description', content: 'Combinaciones completas listas para tu evento a precio redondo.' },
  ],
})

const { data: packs, pending } = usePacks()
</script>
