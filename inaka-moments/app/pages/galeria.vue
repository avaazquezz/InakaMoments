<template>
  <main>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-inaka-cream py-24 sm:py-32">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-inaka-mauve/10 blur-3xl" />
        <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/10 blur-3xl" />
      </div>
      <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-4">Nuestros trabajos</p>
        <h1 class="text-4xl font-bold text-inaka-terra sm:text-5xl lg:text-6xl mb-6">
          Galería de momentos
        </h1>
        <p class="text-inaka-terra/70 text-lg max-w-2xl mx-auto">
          Cada evento que decoramos es una historia única. Explora nuestra colección de trabajos reales.
        </p>
      </div>
    </section>

    <!-- Filters -->
    <section class="sticky top-[73px] z-30 bg-inaka-cream/95 backdrop-blur-sm border-b border-inaka-nude py-4">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button
            v-for="filtro in filtros"
            :key="filtro.value"
            type="button"
            class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
            :class="filtroActivo === filtro.value
              ? 'bg-inaka-terra text-inaka-cream'
              : 'bg-inaka-nude/60 text-inaka-terra/70 hover:bg-inaka-nude'"
            @click="filtroActivo = filtro.value"
          >
            {{ filtro.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- Gallery grid -->
    <section class="py-16 bg-white">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div v-if="pending" class="py-20 text-center text-inaka-terra/50">Cargando galería…</div>

        <TransitionGroup
          v-else
          name="gallery-fade"
          tag="div"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="item in imagenesFiltradas"
            :key="item.id"
            class="group relative overflow-hidden rounded-2xl shadow-md aspect-[4/5] bg-inaka-beige"
          >
            <NuxtImg
              :src="storagePublicUrl('gallery', item.storage_path)"
              :alt="item.alt ?? item.album.title"
              loading="lazy"
              sizes="sm:100vw md:50vw lg:400px"
              class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-inaka-terra/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div class="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
              <span class="text-inaka-cream text-sm font-semibold">{{ item.album.title }}</span>
              <span class="block text-inaka-cream/70 text-xs mt-1">{{ EVENT_TYPE_LABELS[item.album.event_type] ?? item.album.event_type }}</span>
            </div>
          </div>
        </TransitionGroup>

        <!-- Empty state -->
        <div
          v-if="!pending && imagenesFiltradas.length === 0"
          class="flex flex-col items-center justify-center py-20 text-center"
        >
          <span class="text-5xl mb-4">📷</span>
          <p class="text-inaka-terra/60 text-lg">No hay imágenes en esta categoría todavía.</p>
          <button
            type="button"
            class="mt-4 rounded-lg bg-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-cream transition-opacity hover:opacity-90"
            @click="filtroActivo = 'todos'"
          >
            Ver todos
          </button>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-inaka-terra text-inaka-cream">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold sm:text-4xl mb-5">¿Te imaginas tu evento en nuestra galería?</h2>
        <p class="text-inaka-cream/70 text-lg mb-8 max-w-2xl mx-auto">
          Cada celebración es especial. Háblanos de la tuya y diseñamos juntos algo que nadie más tendrá.
        </p>
        <NuxtLink
          to="/configurador"
          class="inline-flex items-center gap-2 rounded-md bg-inaka-gold px-8 py-4 text-sm font-semibold text-inaka-terra shadow-sm transition-opacity hover:opacity-90"
        >
          Configurar mi presupuesto
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Galería — Inaka Moments',
  meta: [
    { name: 'description', content: 'Explora la galería de trabajos de Inaka Moments. Cumpleaños, baby showers, bautizos, comuniones y eventos corporativos decorados con alma.' },
    { property: 'og:title', content: 'Galería — Inaka Moments' },
    { property: 'og:description', content: 'Descubre los trabajos reales de Inaka Moments.' },
    { property: 'og:image', content: '/og-galeria.png' },
  ],
})

const { data: imagenes, pending } = useGalleryImages()

const filtroActivo = ref('todos')

/** Filtros derivados de las ocasiones realmente presentes en la galería. */
const filtros = computed(() => {
  const present = [...new Set(imagenes.value.map(i => i.album.event_type))]
  return [
    { label: 'Todos', value: 'todos' },
    ...present.map(t => ({ value: t, label: EVENT_TYPE_LABELS[t] ?? t })),
  ]
})

const imagenesFiltradas = computed(() =>
  filtroActivo.value === 'todos'
    ? imagenes.value
    : imagenes.value.filter(i => i.album.event_type === filtroActivo.value),
)
</script>

<style scoped>
.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.gallery-fade-enter-from,
.gallery-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
