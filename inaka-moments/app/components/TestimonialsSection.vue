<template>
  <!-- Se autooculta: sin testimonios publicados no se renderiza nada. -->
  <section v-if="destacados.length" class="py-20 bg-inaka-cream sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-inaka-gold">Lo que dicen de nosotras</p>
        <h2 class="font-display text-3xl font-bold text-inaka-terra sm:text-4xl">Momentos que dejaron huella</h2>
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
            <Icon
              v-for="s in 5"
              :key="s"
              name="lucide:star"
              class="h-4 w-4"
              :class="s <= (t.rating ?? 0) ? 'text-inaka-gold' : 'text-inaka-nude'"
              aria-hidden="true"
            />
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
          class="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-inaka-gold outline-none hover:underline focus-visible:ring-2 focus-visible:ring-inaka-gold"
        >
          Ver todas las reseñas
          <Icon name="lucide:arrow-right" class="h-3.5 w-3.5" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: testimonios } = useTestimonials()
const destacados = computed(() => testimonios.value.slice(0, 3))
</script>
