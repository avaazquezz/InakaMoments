<template>
  <!-- Se autooculta: sin testimonios publicados no se renderiza nada. -->
  <section v-if="destacados.length" class="py-20 bg-inaka-cream sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-inaka-gold">Lo que dicen de nosotras</p>
        <h2 class="text-3xl font-bold text-inaka-terra sm:text-4xl">Momentos que dejaron huella</h2>
        <p class="mx-auto mt-3 max-w-2xl text-inaka-terra/65">
          La mejor recompensa: las palabras de quienes ya celebraron con Inaka Moments.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <figure
          v-for="t in destacados"
          :key="t.id"
          class="flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-inaka-nude"
        >
          <div v-if="t.rating" class="mb-3 flex gap-0.5" :aria-label="`${t.rating} de 5 estrellas`">
            <svg v-for="s in 5" :key="s" class="h-4 w-4" :class="s <= (t.rating ?? 0) ? 'text-inaka-gold' : 'text-inaka-nude'" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
            </svg>
          </div>
          <blockquote class="flex-1 leading-relaxed text-inaka-terra/75">"{{ t.quote }}"</blockquote>
          <figcaption class="mt-5 flex items-center gap-3">
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-inaka-mauve/30 text-sm font-bold text-inaka-terra">
              {{ t.author.charAt(0).toUpperCase() }}
            </span>
            <div>
              <p class="text-sm font-semibold text-inaka-terra">{{ t.author }}</p>
              <p v-if="t.event_type" class="text-xs text-inaka-terra/50">{{ EVENT_TYPE_LABELS[t.event_type] }}</p>
            </div>
          </figcaption>
        </figure>
      </div>

      <div v-if="testimonios.length > 3" class="mt-10 text-center">
        <NuxtLink
          to="/resenas"
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-inaka-gold hover:underline"
        >
          Ver todas las reseñas
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: testimonios } = useTestimonials()
const destacados = computed(() => testimonios.value.slice(0, 3))
</script>
