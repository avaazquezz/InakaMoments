<template>
  <!-- sin overflow-hidden para que el scroll lateral funcione -->
  <section class="py-20 bg-inaka-cream">

    <!-- Header -->
    <div class="text-center px-4 mb-12">
      <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-3">
        Momentos reales
      </p>
      <h2 class="text-3xl font-bold text-inaka-terra md:text-4xl mb-3">
        Magia en la vida real
      </h2>
      <p class="text-inaka-terra/70 text-base max-w-md mx-auto">
        Explora algunos de los momentos Inaka que hemos creado.
      </p>
    </div>

    <!-- Carousel -->
    <div class="carousel flex overflow-x-auto gap-6 pb-6 px-6 md:px-12 snap-x snap-mandatory cursor-grab active:cursor-grabbing">
      <div
        v-for="item in gallery"
        :key="item.id"
        class="shrink-0 w-64 sm:w-72 md:w-80 snap-center relative group overflow-hidden rounded-2xl shadow-md aspect-[4/5] bg-inaka-beige"
      >
        <img
          :src="item.src"
          :alt="item.alt"
          loading="lazy"
          class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
        />

        <!-- Overlay label -->
        <div
          class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-inaka-terra/70 to-transparent px-5 py-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
        >
          <span class="text-inaka-cream text-sm font-semibold tracking-wide drop-shadow">
            {{ item.alt }}
          </span>
        </div>
      </div>

      <!-- Tarjeta final CTA -->
      <div class="shrink-0 w-64 sm:w-72 md:w-80 snap-center flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-inaka-beige aspect-[4/5] px-6 text-center">
        <span class="text-4xl">✨</span>
        <p class="text-sm font-semibold text-inaka-terra leading-snug">
          ¿Te imaginas tu evento así de especial?
        </p>
        <button
          type="button"
          class="rounded-lg bg-inaka-terra px-5 py-2.5 text-xs font-semibold text-inaka-cream transition-opacity hover:opacity-90"
        >
          Diseñar el mío
        </button>
      </div>
    </div>

    <!-- Scroll hint -->
    <div class="flex items-center justify-center gap-2 mt-5 text-xs text-inaka-terra/40 select-none">
      <span>←</span>
      <span>Desliza para explorar</span>
      <span>→</span>
    </div>

  </section>
</template>

<script setup lang="ts">
const gallery = ref([
  {
    id: 1,
    src: 'https://picsum.photos/seed/boda-boho/800/1000',
    alt: 'Boda Boho',
  },
  {
    id: 2,
    src: 'https://picsum.photos/seed/comunion-clasica/800/1000',
    alt: 'Comunión Clásica',
  },
  {
    id: 3,
    src: 'https://picsum.photos/seed/cumple-colorido/800/1000',
    alt: 'Cumpleaños Colorido',
  },
  {
    id: 4,
    src: 'https://picsum.photos/seed/evento-corp/800/1000',
    alt: 'Evento Corporativo',
  },
  {
    id: 5,
    src: 'https://picsum.photos/seed/boda-elegante/800/1000',
    alt: 'Boda Elegante',
  },
])
</script>

<style scoped>
.carousel {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.carousel::-webkit-scrollbar {
  display: none;
}
</style>
