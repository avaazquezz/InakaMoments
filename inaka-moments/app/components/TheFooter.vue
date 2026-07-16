<template>
  <footer class="relative overflow-hidden bg-inaka-terra text-inaka-cream">
    <!-- Textura decorativa superior -->
    <div
      class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-inaka-gold/40 to-transparent"
      aria-hidden="true"
    />

    <!-- Blobs de fondo -->
    <div
      class="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div class="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-inaka-mauve/10 blur-3xl" />
      <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/10 blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <!-- Bloque principal -->
      <div class="grid grid-cols-1 gap-14 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
        <!-- Col 1: Marca + tagline (editable: site_content.footer) -->
        <div class="flex flex-col gap-5">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-inaka-gold/70 mb-3">
              Inaka Moments
            </p>
            <p class="font-display text-2xl font-bold leading-snug text-inaka-cream">
              {{ footer.tagline_titulo }}<br>
              <span class="text-inaka-gold">{{ footer.tagline_span }}</span>
            </p>
          </div>
          <p class="text-sm leading-relaxed text-inaka-cream/60 max-w-xs">
            {{ footer.tagline_sub }}
          </p>
          <!-- Instagram CTA destacado -->
          <a
            :href="contacto.instagram"
            target="_blank"
            rel="noopener noreferrer"
            class="group mt-1 flex w-full max-w-xs items-center gap-4 rounded-2xl border border-inaka-gold/30 bg-gradient-to-r from-inaka-gold/20 to-inaka-mauve/10 px-5 py-4 shadow-sm outline-none transition-all hover:-translate-y-0.5 hover:border-inaka-gold/60 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-inaka-gold focus-visible:ring-offset-2 focus-visible:ring-offset-inaka-terra"
            aria-label="Síguenos en Instagram"
          >
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-inaka-cream/10 ring-1 ring-inaka-gold/40 transition-transform group-hover:scale-105">
              <Icon
                name="lucide:instagram"
                class="h-6 w-6 text-inaka-gold"
                aria-hidden="true"
              />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-bold leading-tight text-inaka-cream">Síguenos</p>
              <p class="text-sm font-bold leading-tight text-inaka-cream">en Instagram</p>
              <p class="mt-1 text-xs font-medium text-inaka-gold/90">{{ igHandle }}</p>
            </div>
            <Icon
              name="lucide:arrow-right"
              class="ml-auto h-4 w-4 shrink-0 text-inaka-gold/70 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>

        <!-- Col 2: Ocasiones (SEO interno) -->
        <div>
          <p class="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-inaka-gold/70">
            Ocasiones
          </p>
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="oc in ocasiones"
              :key="oc.slug"
            >
              <NuxtLink
                :to="`/ocasiones/${oc.slug}`"
                class="rounded text-sm text-inaka-cream/65 outline-none transition-colors hover:text-inaka-cream focus-visible:ring-2 focus-visible:ring-inaka-gold"
              >
                {{ EVENT_TYPE_LABELS[oc.event_type] ?? oc.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 3: Enlaces -->
        <div>
          <p class="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-inaka-gold/70">
            Enlaces
          </p>
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="link in enlaces"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                class="rounded text-sm text-inaka-cream/65 outline-none transition-colors hover:text-inaka-cream focus-visible:ring-2 focus-visible:ring-inaka-gold"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 4: Contacto (editable: site_content.contacto) -->
        <div>
          <p class="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-inaka-gold/70">
            Contacto
          </p>
          <ul class="flex flex-col gap-4">
            <li>
              <a
                :href="`mailto:${contacto.email}`"
                class="group inline-flex items-start gap-3 rounded text-sm text-inaka-cream/65 outline-none transition-colors hover:text-inaka-cream focus-visible:ring-2 focus-visible:ring-inaka-gold"
              >
                <Icon
                  name="lucide:mail"
                  class="mt-0.5 h-4 w-4 shrink-0 text-inaka-gold/60"
                  aria-hidden="true"
                />
                {{ contacto.email }}
              </a>
            </li>
            <li class="inline-flex items-start gap-3 text-sm text-inaka-cream/65">
              <Icon
                name="lucide:map-pin"
                class="mt-0.5 h-4 w-4 shrink-0 text-inaka-gold/60"
                aria-hidden="true"
              />
              {{ contacto.ubicacion }}
            </li>
            <li v-if="contacto.telefono">
              <a
                :href="`tel:${contacto.telefono}`"
                class="group inline-flex items-start gap-3 rounded text-sm text-inaka-cream/65 outline-none transition-colors hover:text-inaka-cream focus-visible:ring-2 focus-visible:ring-inaka-gold"
              >
                <Icon
                  name="lucide:phone"
                  class="mt-0.5 h-4 w-4 shrink-0 text-inaka-gold/60"
                  aria-hidden="true"
                />
                {{ contacto.telefono }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Divisor -->
      <div class="h-px bg-gradient-to-r from-transparent via-inaka-cream/15 to-transparent" />

      <!-- Bottom bar -->
      <div class="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
        <p class="text-xs text-inaka-cream/40">
          © {{ new Date().getFullYear() }} Inaka Moments x <a
            href="https://www.vazquezdev.pro"
            target="_blank"
            rel="noopener noreferrer"
            class="transition-colors hover:text-inaka-cream/70 underline underline-offset-2"
          >VazquezDev</a>. Todos los derechos reservados.
        </p>
        <div class="flex items-center gap-5">
          <NuxtLink
            to="/politica-privacidad"
            class="rounded text-xs text-inaka-cream/40 outline-none transition-colors hover:text-inaka-cream/70 focus-visible:ring-2 focus-visible:ring-inaka-gold"
          >Política de privacidad</NuxtLink>
          <span class="h-3 w-px bg-inaka-cream/20" />
          <NuxtLink
            to="/aviso-legal"
            class="rounded text-xs text-inaka-cream/40 outline-none transition-colors hover:text-inaka-cream/70 focus-visible:ring-2 focus-visible:ring-inaka-gold"
          >Aviso legal</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Contenido editable por la dueña + enlaces SEO internos
const { data: footer } = useSiteSection('footer', {
  tagline_titulo: 'Cada detalle,',
  tagline_span: 'una historia.',
  tagline_sub: 'Creamos experiencias únicas para los momentos más importantes de tu vida. Con alma, con mimo, con arte.',
})

const { data: contacto } = useSiteSection('contacto', {
  email: 'nadine.tcae@gmail.com',
  ubicacion: 'Abrera, Cataluña, España',
  instagram: 'https://www.instagram.com/inaka.moments',
  // Sin teléfono público todavía — se añade aquí en cuanto exista.
  telefono: '',
})
const igHandle = computed(() => `@${contacto.value.instagram.split('/').filter(Boolean).pop()}`)

const { data: ocasiones } = useOccasions()

const enlaces = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/packs', label: 'Packs' },
  { to: '/galeria', label: 'Galería' },
  { to: '/como-funciona', label: 'Cómo funciona' },
  { to: '/faq', label: 'Preguntas frecuentes' },
  { to: '/resenas', label: 'Reseñas' },
  { to: '/contacto', label: 'Contacto' },
]
</script>
