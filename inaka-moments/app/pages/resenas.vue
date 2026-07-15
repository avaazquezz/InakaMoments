<template>
  <main>
    <PageHero
      eyebrow="Lo que dicen de nosotras"
      title="Reseñas de clientes"
      subtitle="La mejor recompensa: las palabras de quienes ya celebraron con Inaka Moments."
    />

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
              <Icon
                v-for="s in 5"
                :key="s"
                name="lucide:star"
                class="h-4 w-4"
                :class="s <= (t.rating ?? 0) ? 'text-inaka-gold' : 'text-inaka-nude'"
                aria-hidden="true"
              />
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
          <Icon name="lucide:star" class="mb-4 h-12 w-12 text-inaka-gold/40" aria-hidden="true" />
          <h2 class="mb-3 font-display text-2xl font-bold text-inaka-terra">Aún estamos recopilando reseñas</h2>
          <p class="text-inaka-terra/60 leading-relaxed mb-8">
            Somos un negocio joven y cada evento cuenta. ¿Celebraste con nosotras?
            Nos haría muchísima ilusión conocer tu experiencia.
          </p>
          <BaseButtonLink href="https://www.instagram.com/inaka.moments" :icon="undefined">
            Cuéntanoslo en Instagram
          </BaseButtonLink>
        </div>
      </div>
    </section>

    <CtaBand
      title="Sé el próximo momento inolvidable"
      subtitle="Diseñamos tu celebración con el mismo mimo que nos gustaría recibir."
      cta-label="Configurar mi presupuesto"
      cta-to="/configurador"
    />
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
