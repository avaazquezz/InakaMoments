<template>
  <main>
    <PageHero
      eyebrow="Nuestros trabajos"
      title="Galería de momentos"
      subtitle="Cada evento que decoramos es una historia única. Explora nuestra colección de trabajos reales."
    />

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
          <button
            v-for="grupo in albumesFiltrados"
            :key="grupo.id"
            type="button"
            class="group relative overflow-hidden rounded-2xl shadow-md aspect-[4/5] bg-inaka-beige text-left"
            @click="abrirAlbum(grupo)"
          >
            <NuxtImg
              :src="storagePublicUrl('gallery', grupo.cover.storage_path)"
              :alt="grupo.cover.alt ?? grupo.title"
              loading="lazy"
              sizes="sm:100vw md:50vw lg:400px"
              class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
            />
            <span
              v-if="grupo.images.length > 1"
              class="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-inaka-terra/80 px-2.5 py-1 text-xs font-semibold text-inaka-cream backdrop-blur-sm"
            >
              <Icon name="lucide:images" class="h-3.5 w-3.5" aria-hidden="true" />
              {{ grupo.images.length }}
            </span>
            <div class="absolute inset-0 bg-gradient-to-t from-inaka-terra/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div class="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
              <span class="text-inaka-cream text-sm font-semibold">{{ grupo.title }}</span>
              <span class="block text-inaka-cream/70 text-xs mt-1">{{ EVENT_TYPE_LABELS[grupo.event_type] ?? grupo.event_type }}</span>
            </div>
          </button>
        </TransitionGroup>

        <!-- Empty state -->
        <div
          v-if="!pending && albumesFiltrados.length === 0"
          class="flex flex-col items-center justify-center py-20 text-center"
        >
          <Icon name="lucide:image-off" class="mb-4 h-12 w-12 text-inaka-terra/30" aria-hidden="true" />
          <p class="text-inaka-terra/60 text-lg">No hay imágenes en esta categoría todavía.</p>
          <button
            type="button"
            class="mt-4 rounded-lg bg-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-cream outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-inaka-gold focus-visible:ring-offset-2"
            @click="filtroActivo = 'todos'"
          >
            Ver todos
          </button>
        </div>
      </div>
    </section>

    <CtaBand
      title="¿Te imaginas tu evento en nuestra galería?"
      subtitle="Cada celebración es especial. Háblanos de la tuya y diseñamos juntos algo que nadie más tendrá."
      cta-label="Configurar mi presupuesto"
      cta-to="/configurador"
    />

    <!-- Visor de álbum -->
    <Teleport to="body">
      <Transition name="lightbox-fade">
        <div
          v-if="albumAbierto"
          class="fixed inset-0 z-[150] flex items-center justify-center bg-inaka-terra/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          :aria-label="albumAbierto.title"
          @click.self="cerrarAlbum"
        >
          <button
            type="button"
            class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-inaka-cream hover:bg-white/20"
            aria-label="Cerrar"
            @click="cerrarAlbum"
          >
            <Icon name="lucide:x" class="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            v-if="albumAbierto.images.length > 1"
            type="button"
            class="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-inaka-cream hover:bg-white/20 sm:left-4"
            aria-label="Foto anterior"
            @click="fotoAnterior"
          >
            <Icon name="lucide:chevron-left" class="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            v-if="albumAbierto.images.length > 1"
            type="button"
            class="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-inaka-cream hover:bg-white/20 sm:right-4"
            aria-label="Foto siguiente"
            @click="fotoSiguiente"
          >
            <Icon name="lucide:chevron-right" class="h-6 w-6" aria-hidden="true" />
          </button>

          <figure class="flex max-h-[85vh] w-full max-w-4xl flex-col items-center gap-4">
            <NuxtImg
              :key="fotoActiva.id"
              :src="storagePublicUrl('gallery', fotoActiva.storage_path)"
              :alt="fotoActiva.alt ?? albumAbierto.title"
              width="1600"
              height="1600"
              class="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
            <figcaption class="text-center text-inaka-cream">
              <span class="text-sm font-semibold">{{ albumAbierto.title }}</span>
              <span v-if="albumAbierto.images.length > 1" class="ml-2 text-xs text-inaka-cream/70">
                {{ indiceActivo + 1 }} / {{ albumAbierto.images.length }}
              </span>
            </figcaption>
          </figure>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import type { GalleryItem } from '~/composables/usePublicData'

useHead({
  title: 'Galería — Inaka Moments',
  meta: [
    { name: 'description', content: 'Explora la galería de trabajos de Inaka Moments. Cumpleaños, baby showers, bautizos, comuniones y eventos corporativos decorados con alma.' },
    { property: 'og:title', content: 'Galería — Inaka Moments' },
    { property: 'og:description', content: 'Descubre los trabajos reales de Inaka Moments.' },
    { property: 'og:image', content: '/logo.png' },
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

interface AlbumGrupo { id: string, title: string, event_type: string, images: GalleryItem[], cover: GalleryItem }

/** Agrupa las imágenes (ya ordenadas por sort_order) por álbum; la portada es
 * la marcada como tal en el admin, o la primera si no hay ninguna marcada. */
const albumesFiltrados = computed<AlbumGrupo[]>(() => {
  const grupos = new Map<string, AlbumGrupo>()
  for (const img of imagenesFiltradas.value) {
    let grupo = grupos.get(img.album.id)
    if (!grupo) {
      grupo = { id: img.album.id, title: img.album.title, event_type: img.album.event_type, images: [], cover: img }
      grupos.set(img.album.id, grupo)
    }
    grupo.images.push(img)
    if (img.id === img.album.cover_image_id) grupo.cover = img
  }
  return [...grupos.values()]
})

const albumAbierto = ref<AlbumGrupo | null>(null)
const indiceActivo = ref(0)
const fotoActiva = computed(() => albumAbierto.value!.images[indiceActivo.value])

function abrirAlbum(grupo: AlbumGrupo) {
  albumAbierto.value = grupo
  indiceActivo.value = grupo.images.indexOf(grupo.cover)
}
function cerrarAlbum() {
  albumAbierto.value = null
}
function fotoSiguiente() {
  if (!albumAbierto.value) return
  indiceActivo.value = (indiceActivo.value + 1) % albumAbierto.value.images.length
}
function fotoAnterior() {
  if (!albumAbierto.value) return
  const total = albumAbierto.value.images.length
  indiceActivo.value = (indiceActivo.value - 1 + total) % total
}

function onKeydown(e: KeyboardEvent) {
  if (!albumAbierto.value) return
  if (e.key === 'Escape') cerrarAlbum()
  else if (e.key === 'ArrowRight') fotoSiguiente()
  else if (e.key === 'ArrowLeft') fotoAnterior()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
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

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>
