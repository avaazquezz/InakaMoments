<template>
  <section v-if="destacados.length" class="py-20 bg-white">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-3">Tú eliges, nosotros creamos</p>
        <h2 class="font-display text-3xl font-bold text-inaka-terra md:text-4xl mb-3">Nuestro catálogo</h2>
        <p class="text-inaka-terra/70 text-base max-w-md mx-auto">
          Cada elemento con su precio, todo combinable. Monta tu decoración a medida.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="p in destacados"
          :key="p.id"
          :to="`/catalogo/${p.slug}`"
          class="group rounded-2xl bg-inaka-cream p-6 ring-1 ring-inaka-nude transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <p class="text-[11px] font-semibold uppercase tracking-widest text-inaka-gold mb-2">
            {{ CATEGORY_LABELS[p.category] ?? p.category }}
          </p>
          <h3 class="font-bold text-inaka-terra leading-snug group-hover:text-inaka-gold transition-colors">{{ p.name }}</h3>
          <p class="mt-3 text-sm font-bold text-inaka-terra">{{ productPriceLabel(p) }}</p>
        </NuxtLink>
      </div>

      <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <BaseButtonLink to="/configurador">Configurar mi presupuesto</BaseButtonLink>
        <NuxtLink
          to="/catalogo"
          class="inline-flex items-center gap-2 rounded-md border border-inaka-terra px-8 py-3.5 text-sm font-semibold text-inaka-terra outline-none transition-colors hover:bg-inaka-nude focus-visible:ring-2 focus-visible:ring-inaka-gold"
        >
          Ver el catálogo completo
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: productos } = useProducts()
const destacados = computed(() => productos.value.slice(0, 4))
</script>
