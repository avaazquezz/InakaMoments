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
    <div
      ref="carouselRef"
      class="carousel flex overflow-x-auto gap-6 pb-6 px-6 md:px-12 select-none"
      :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseLeave"
    >
      <div
        v-for="item in gallery"
        :key="item.id"
        class="shrink-0 w-64 sm:w-72 md:w-80 snap-center relative group overflow-hidden rounded-2xl shadow-md aspect-[4/5] bg-inaka-beige"
      >
        <img
          :src="item.src"
          :alt="item.alt"
          loading="lazy"
          draggable="false"
          class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 pointer-events-none"
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
const carouselRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

let startX = 0
let scrollStart = 0
let lastX = 0
let lastTime = 0
let velocity = 0
let rafId: number | null = null

const FRICTION = 0.93
const MIN_VELOCITY = 0.4

function cancelMomentum() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function onMouseDown(e: MouseEvent) {
  if (!carouselRef.value) return
  cancelMomentum()
  isDragging.value = true
  startX = e.pageX
  lastX = e.pageX
  lastTime = performance.now()
  scrollStart = carouselRef.value.scrollLeft
  velocity = 0
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value || !carouselRef.value) return
  e.preventDefault()
  const now = performance.now()
  const dt = now - lastTime
  if (dt > 0) {
    // Velocity en px/ms normalizado a ~16ms (un frame)
    velocity = ((lastX - e.pageX) / dt) * 16
  }
  lastX = e.pageX
  lastTime = now
  carouselRef.value.scrollLeft = scrollStart + (startX - e.pageX)
}

function onMouseUp() {
  if (!isDragging.value) return
  isDragging.value = false
  launchMomentum()
}

function onMouseLeave() {
  if (!isDragging.value) return
  isDragging.value = false
  launchMomentum()
}

function launchMomentum() {
  if (!carouselRef.value || Math.abs(velocity) < MIN_VELOCITY) return
  const el = carouselRef.value

  const tick = () => {
    velocity *= FRICTION
    if (Math.abs(velocity) < MIN_VELOCITY) {
      velocity = 0
      rafId = null
      return
    }
    el.scrollLeft += velocity
    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)
}

onUnmounted(() => cancelMomentum())

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
  -webkit-overflow-scrolling: touch;
  will-change: scroll-position;
}
.carousel::-webkit-scrollbar {
  display: none;
}
</style>
