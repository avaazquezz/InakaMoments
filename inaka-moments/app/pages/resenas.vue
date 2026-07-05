<template>
  <main>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-inaka-cream py-24 sm:py-32">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-inaka-mauve/10 blur-3xl" />
        <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/10 blur-3xl" />
      </div>
      <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-4">Lo que dicen de nosotras</p>
        <h1 class="text-4xl font-bold text-inaka-terra sm:text-5xl lg:text-6xl mb-6">
          Reseñas de clientes
        </h1>
        <p class="text-inaka-terra/70 text-lg max-w-2xl mx-auto">
          La mejor recompensa: las palabras de quienes ya celebraron con Inaka Moments.
        </p>
      </div>
    </section>

    <!-- Reseñas -->
    <section class="py-16 bg-white">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div v-if="pending" class="py-20 text-center text-inaka-terra/50">Cargando…</div>

        <div v-else-if="testimonios.length" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <figure
            v-for="t in testimonios"
            :key="t.id"
            class="flex flex-col rounded-2xl bg-inaka-cream p-8 ring-1 ring-inaka-nude"
          >
            <div v-if="t.rating" class="mb-3 flex gap-0.5" :aria-label="`${t.rating} de 5 estrellas`">
              <svg v-for="s in 5" :key="s" class="h-4 w-4" :class="s <= (t.rating ?? 0) ? 'text-inaka-gold' : 'text-inaka-nude'" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
              </svg>
            </div>
            <blockquote class="flex-1 text-inaka-terra/75 leading-relaxed">"{{ t.quote }}"</blockquote>
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

        <!-- Estado vacío honesto -->
        <div v-else class="mx-auto flex max-w-xl flex-col items-center justify-center py-16 text-center">
          <span class="text-5xl mb-4">⭐</span>
          <h2 class="text-2xl font-bold text-inaka-terra mb-3">Aún estamos recopilando reseñas</h2>
          <p class="text-inaka-terra/60 leading-relaxed mb-8">
            Somos un negocio joven y cada evento cuenta. ¿Celebraste con nosotras?
            Nos haría muchísima ilusión conocer tu experiencia.
          </p>
          <a
            href="https://www.instagram.com/inaka.moments"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-md bg-inaka-terra px-8 py-3.5 text-sm font-semibold text-inaka-cream shadow-sm transition-opacity hover:opacity-90"
          >
            Cuéntanoslo en Instagram
          </a>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-inaka-terra text-inaka-cream">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold sm:text-4xl mb-5">Sé el próximo momento inolvidable</h2>
        <p class="text-inaka-cream/70 text-lg mb-8 max-w-2xl mx-auto">
          Diseñamos tu celebración con el mismo mimo que nos gustaría recibir.
        </p>
        <NuxtLink
          to="/#lead-wizard"
          class="inline-flex items-center gap-2 rounded-md bg-inaka-gold px-8 py-4 text-sm font-semibold text-inaka-terra shadow-sm transition-opacity hover:opacity-90"
        >
          Diseñar mi evento
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Reseñas — Inaka Moments',
  meta: [
    { name: 'description', content: 'Opiniones y reseñas de clientes de Inaka Moments, decoración de eventos con globos en Abrera y Barcelona.' },
    { property: 'og:title', content: 'Reseñas — Inaka Moments' },
  ],
})

const { data: testimonios, pending } = useTestimonials()
</script>
