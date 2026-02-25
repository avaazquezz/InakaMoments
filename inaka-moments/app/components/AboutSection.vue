<template>
  <section class="relative overflow-hidden bg-inaka-cream py-32">

    <!-- Fondo decorativo: blobs suaves -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-inaka-nude/40 blur-3xl" />
      <div class="absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-inaka-mauve/20 blur-3xl" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-inaka-gold/5 blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

      <!-- Encabezado centrado -->
      <div class="mb-20 text-center">
        <span class="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-inaka-gold">
          <span class="h-px w-8 bg-inaka-gold/60 inline-block" />
          Nuestra historia
          <span class="h-px w-8 bg-inaka-gold/60 inline-block" />
        </span>
        <h2 class="mt-5 text-4xl font-bold leading-tight text-inaka-terra sm:text-5xl lg:text-6xl">
          Cada momento,<br>
          <em class="not-italic text-inaka-mauve">una obra de arte.</em>
        </h2>
      </div>

      <!-- Layout principal: dos columnas -->
      <div class="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 items-start">

        <!-- Columna izquierda: cita + decoración -->
        <div class="relative">
          <!-- Marco decorativo con comillas grandes -->
          <div class="relative rounded-3xl bg-gradient-to-br from-inaka-nude/60 to-inaka-beige/40 p-10 shadow-sm ring-1 ring-inaka-nude">
            <!-- Comilla decorativa -->
            <svg class="absolute -top-5 -left-3 h-16 w-16 text-inaka-gold/30" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M10 8C6.134 8 3 11.134 3 15v9h9v-9H6c0-2.206 1.794-4 4-4V8zm13 0c-3.866 0-7 3.134-7 7v9h9v-9h-6c0-2.206 1.794-4 4-4V8z"/>
            </svg>

            <blockquote class="relative z-10">
              <p class="text-xl font-medium leading-relaxed text-inaka-terra/90 sm:text-2xl">
                "Nació de la pasión por transformar espacios en recuerdos. De la creencia de que los detalles lo son todo."
              </p>
              <footer class="mt-6 flex items-center gap-4">
                <div class="h-10 w-10 rounded-full bg-inaka-mauve/30 ring-2 ring-inaka-mauve/40 flex items-center justify-center">
                  <span class="text-sm font-bold text-inaka-terra">IM</span>
                </div>
                <div>
                  <p class="text-sm font-semibold text-inaka-terra">Inaka Moments</p>
                  <p class="text-xs text-inaka-terra/50">Fundado con amor</p>
                </div>
              </footer>
            </blockquote>
          </div>

          <!-- Tarjeta flotante de credencial -->
          <div class="mt-8 flex items-center gap-5 rounded-2xl bg-white px-7 py-5 shadow-md ring-1 ring-inaka-nude/80">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-inaka-gold/15">
              <!-- Icono estrella -->
              <svg class="h-6 w-6 text-inaka-gold" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-inaka-terra">Eventos diseñados a medida</p>
              <p class="text-xs text-inaka-terra/55 mt-0.5">Bodas · Comuniones · Cumpleaños · Corporativos</p>
            </div>
          </div>
        </div>

        <!-- Columna derecha: texto descriptivo -->
        <div class="flex flex-col gap-7">
          <p class="text-lg leading-relaxed text-inaka-terra/75">
            En <strong class="font-semibold text-inaka-terra">Inaka Moments</strong> creemos que los eventos más especiales de tu vida merecen ser vividos con todos los sentidos. Somos un equipo de decoradoras y coordinadoras apasionadas por crear atmósferas únicas que hablen de ti y de quienes amas.
          </p>
          <p class="text-base leading-relaxed text-inaka-terra/65">
            Desde una boda íntima en el campo hasta una celebración corporativa de gran escala, cada proyecto lo abordamos con la misma dedicación: escucharte, entender tu visión y convertirla en algo que supere tus expectativas. Cada flor, cada vela, cada detalle tiene un propósito.
          </p>

          <!-- Separador decorativo -->
          <div class="flex items-center gap-4">
            <div class="h-px flex-1 bg-inaka-nude" />
            <svg class="h-5 w-5 text-inaka-gold/60" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10 1l1.39 4.26H16l-3.7 2.69 1.41 4.32L10 9.59l-3.71 2.68 1.41-4.32L4 5.26h4.61L10 1z"/>
            </svg>
            <div class="h-px flex-1 bg-inaka-nude" />
          </div>

          <p class="text-base leading-relaxed text-inaka-terra/65">
            Nos guiamos por una filosofía sencilla: <em class="font-medium text-inaka-terra not-italic">el lujo está en los detalles</em>. Por eso no trabajamos con plantillas, sino con historias. La tuya es la que da forma a cada propuesta que diseñamos.
          </p>

          <!-- CTA sutil -->
          <div class="pt-2">
            <a
              href="#contacto"
              class="group inline-flex items-center gap-2 text-sm font-semibold text-inaka-gold transition-gap hover:gap-3"
            >
              Conoce cómo trabajamos
              <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Pilares / valores -->
      <div class="mt-24 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div
          v-for="pilar in pilares"
          :key="pilar.titulo"
          class="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-inaka-nude transition-shadow hover:shadow-md"
        >
          <!-- Línea de acento superior -->
          <div class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-inaka-gold/0 via-inaka-gold to-inaka-gold/0 opacity-0 transition-opacity group-hover:opacity-100" />

          <div class="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-inaka-nude/70 transition-colors group-hover:bg-inaka-gold/15">
            <component :is="pilar.icono" class="h-5 w-5 text-inaka-terra/70 transition-colors group-hover:text-inaka-gold" />
          </div>
          <h3 class="mb-2 text-base font-bold text-inaka-terra">{{ pilar.titulo }}</h3>
          <p class="text-sm leading-relaxed text-inaka-terra/60">{{ pilar.descripcion }}</p>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'

function makeIcon(paths: string[]) {
  return defineComponent({
    render() {
      return h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', viewBox: '0 0 24 24', 'aria-hidden': 'true' },
        paths.map(d => h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d }))
      )
    },
  })
}

const IconCreatividad = makeIcon([
  'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
])

const IconDetalle = makeIcon([
  'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
])

const IconAmor = makeIcon([
  'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
])

const pilares = [
  {
    titulo: 'Creatividad sin límites',
    descripcion: 'Cada evento es un lienzo en blanco. Exploramos ideas, tendencias y referencias para crear algo que nunca hayas visto antes.',
    icono: IconCreatividad,
  },
  {
    titulo: 'Obsesión por el detalle',
    descripcion: 'Los grandes momentos se construyen con pequeños detalles. Cuidamos cada elemento como si fuese el más importante del evento.',
    icono: IconDetalle,
  },
  {
    titulo: 'Hecho con amor',
    descripcion: 'Ponemos corazón en todo lo que hacemos. Tu celebración se convierte en nuestra misión y la vivimos contigo desde el primer momento.',
    icono: IconAmor,
  },
]
</script>
