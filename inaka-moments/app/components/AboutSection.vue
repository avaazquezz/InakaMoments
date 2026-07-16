<template>
  <section class="relative overflow-hidden bg-inaka-cream py-32">
    <!-- Fondo decorativo: blobs suaves -->
    <div
      class="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
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
        <h2 class="mt-5 font-display text-4xl font-bold leading-tight text-inaka-terra sm:text-5xl lg:text-6xl">
          {{ about.titulo_principal }}<br>
          <em class="not-italic text-inaka-mauve">{{ about.titulo_secundario }}</em>
        </h2>
      </div>

      <!-- Layout principal: dos columnas -->
      <div class="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 items-start">
        <!-- Columna izquierda: cita + decoración -->
        <div class="relative">
          <!-- Marco decorativo con comillas grandes -->
          <div class="relative rounded-3xl bg-gradient-to-br from-inaka-nude/60 to-inaka-beige/40 p-10 shadow-sm ring-1 ring-inaka-nude">
            <!-- Comilla decorativa -->
            <Icon
              name="lucide:quote"
              class="absolute -top-5 -left-3 h-16 w-16 text-inaka-gold/30"
              aria-hidden="true"
            />

            <blockquote class="relative z-10">
              <p class="text-xl font-medium leading-relaxed text-inaka-terra/90 sm:text-2xl">
                "{{ about.quote }}"
              </p>
              <footer class="mt-6 flex items-center gap-4">
                <div class="h-10 w-10 rounded-full bg-inaka-mauve/30 ring-2 ring-inaka-mauve/40 flex items-center justify-center">
                  <span class="text-sm font-bold text-inaka-terra">IM</span>
                </div>
                <div>
                  <p class="text-sm font-semibold text-inaka-terra">
                    Inaka Moments
                  </p>
                  <p class="text-xs text-inaka-terra/50">
                    Fundado con amor
                  </p>
                </div>
              </footer>
            </blockquote>
          </div>

          <!-- Tarjeta flotante de credencial -->
          <div class="mt-8 flex items-center gap-5 rounded-2xl bg-white px-7 py-5 shadow-md ring-1 ring-inaka-nude/80">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-inaka-gold/15">
              <Icon
                name="lucide:star"
                class="h-6 w-6 text-inaka-gold"
                aria-hidden="true"
              />
            </div>
            <div>
              <p class="text-sm font-semibold text-inaka-terra">
                Eventos diseñados a medida
              </p>
              <p class="text-xs text-inaka-terra/55 mt-0.5">
                Cumpleaños · Baby Showers · Comuniones · Corporativos
              </p>
            </div>
          </div>
        </div>

        <!-- Columna derecha: texto descriptivo -->
        <div class="flex flex-col gap-7">
          <p class="text-lg leading-relaxed text-inaka-terra/75">
            En <strong class="font-semibold text-inaka-terra">Inaka Moments</strong> creemos que los eventos más especiales de tu vida merecen ser vividos con todos los sentidos. Somos un equipo de decoradoras y coordinadoras apasionadas por crear atmósferas únicas que hablen de ti y de quienes amas.
          </p>
          <p class="text-base leading-relaxed text-inaka-terra/65">
            Desde un baby shower íntimo hasta una celebración corporativa de gran escala, cada proyecto lo abordamos con la misma dedicación: escucharte, entender tu visión y convertirla en algo que supere tus expectativas. Cada flor, cada vela, cada detalle tiene un propósito.
          </p>

          <!-- Separador decorativo -->
          <div class="flex items-center gap-4">
            <div class="h-px flex-1 bg-inaka-nude" />
            <Icon
              name="lucide:sparkle"
              class="h-5 w-5 text-inaka-gold/60"
              aria-hidden="true"
            />
            <div class="h-px flex-1 bg-inaka-nude" />
          </div>

          <p class="text-base leading-relaxed text-inaka-terra/65">
            Nos guiamos por una filosofía sencilla: <em class="font-medium text-inaka-terra not-italic">el lujo está en los detalles</em>. Por eso no trabajamos con plantillas, sino con historias. La tuya es la que da forma a cada propuesta que diseñamos.
          </p>

          <!-- CTA sutil -->
          <div class="pt-2">
            <NuxtLink
              to="/contacto"
              class="group inline-flex items-center gap-2 rounded text-sm font-semibold text-inaka-gold outline-none transition-gap hover:gap-3 focus-visible:ring-2 focus-visible:ring-inaka-gold"
            >
              Conoce cómo trabajamos
              <Icon
                name="lucide:arrow-right"
                class="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </NuxtLink>
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
            <Icon
              :name="pilar.icono"
              class="h-5 w-5 text-inaka-terra/70 transition-colors group-hover:text-inaka-gold"
              aria-hidden="true"
            />
          </div>
          <h3 class="mb-2 text-base font-bold text-inaka-terra">
            {{ pilar.titulo }}
          </h3>
          <p class="text-sm leading-relaxed text-inaka-terra/60">
            {{ pilar.descripcion }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Textos editables por la dueña (site_content.about); defaults = copy actual
const { data: about } = useSiteSection('about', {
  titulo_principal: 'Cada momento,',
  titulo_secundario: 'una obra de arte.',
  quote: 'Nació de la pasión por transformar espacios en recuerdos. De la creencia de que los detalles lo son todo.',
})

const pilares = [
  {
    titulo: 'Creatividad sin límites',
    descripcion: 'Cada evento es un lienzo en blanco. Exploramos ideas, tendencias y referencias para crear algo que nunca hayas visto antes.',
    icono: 'lucide:sparkles',
  },
  {
    titulo: 'Obsesión por el detalle',
    descripcion: 'Los grandes momentos se construyen con pequeños detalles. Cuidamos cada elemento como si fuese el más importante del evento.',
    icono: 'lucide:gem',
  },
  {
    titulo: 'Hecho con amor',
    descripcion: 'Ponemos corazón en todo lo que hacemos. Tu celebración se convierte en nuestra misión y la vivimos contigo desde el primer momento.',
    icono: 'lucide:heart',
  },
]
</script>
