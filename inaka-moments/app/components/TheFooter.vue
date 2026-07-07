<template>
  <footer class="relative overflow-hidden bg-inaka-terra text-inaka-cream">

    <!-- Textura decorativa superior -->
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-inaka-gold/40 to-transparent" aria-hidden="true" />

    <!-- Blobs de fondo -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-inaka-mauve/10 blur-3xl" />
      <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/10 blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

      <!-- Bloque principal -->
      <div class="grid grid-cols-1 gap-14 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">

        <!-- Col 1: Marca + tagline (editable: site_content.footer) -->
        <div class="flex flex-col gap-5">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-inaka-gold/70 mb-3">Inaka Moments</p>
            <p class="text-2xl font-bold leading-snug text-inaka-cream">
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
            class="group mt-1 flex w-full max-w-xs items-center gap-4 rounded-2xl border border-inaka-gold/30 bg-gradient-to-r from-inaka-gold/20 to-inaka-mauve/10 px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-inaka-gold/60 hover:shadow-lg"
            aria-label="Síguenos en Instagram"
          >
            <!-- Icono Instagram SVG -->
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-inaka-cream/10 ring-1 ring-inaka-gold/40 transition-transform group-hover:scale-105">
              <svg class="h-6 w-6 text-inaka-gold" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </span>
            <div class="min-w-0">
              <p class="text-sm font-bold leading-tight text-inaka-cream">Síguenos</p>
              <p class="text-sm font-bold leading-tight text-inaka-cream">en Instagram</p>
              <p class="mt-1 text-xs font-medium text-inaka-gold/90">{{ igHandle }}</p>
            </div>
            <svg class="ml-auto h-4 w-4 shrink-0 text-inaka-gold/70 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>

        <!-- Col 2: Ocasiones (SEO interno) -->
        <div>
          <p class="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-inaka-gold/70">Ocasiones</p>
          <ul class="flex flex-col gap-2.5">
            <li v-for="oc in ocasiones" :key="oc.slug">
              <NuxtLink
                :to="`/ocasiones/${oc.slug}`"
                class="text-sm text-inaka-cream/65 transition-colors hover:text-inaka-cream"
              >
                {{ EVENT_TYPE_LABELS[oc.event_type] ?? oc.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 3: Enlaces -->
        <div>
          <p class="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-inaka-gold/70">Enlaces</p>
          <ul class="flex flex-col gap-2.5">
            <li v-for="link in enlaces" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-sm text-inaka-cream/65 transition-colors hover:text-inaka-cream"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 4: Contacto (editable: site_content.contacto) -->
        <div>
          <p class="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-inaka-gold/70">Contacto</p>
          <ul class="flex flex-col gap-4">
            <li>
              <a
                :href="`mailto:${contacto.email}`"
                class="group inline-flex items-start gap-3 text-sm text-inaka-cream/65 transition-colors hover:text-inaka-cream"
              >
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-inaka-gold/60" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                {{ contacto.email }}
              </a>
            </li>
            <li class="inline-flex items-start gap-3 text-sm text-inaka-cream/65">
              <svg class="mt-0.5 h-4 w-4 shrink-0 text-inaka-gold/60" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ contacto.ubicacion }}
            </li>
          </ul>
        </div>

      </div>

      <!-- Divisor -->
      <div class="h-px bg-gradient-to-r from-transparent via-inaka-cream/15 to-transparent" />

      <!-- Bottom bar -->
      <div class="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
        <p class="text-xs text-inaka-cream/40">
          © {{ new Date().getFullYear() }} Inaka Moments x <a href="https://www.vazquezdev.pro" target="_blank" rel="noopener noreferrer" class="transition-colors hover:text-inaka-cream/70 underline underline-offset-2">VazquezDev</a>. Todos los derechos reservados.
        </p>
        <div class="flex items-center gap-5">
          <NuxtLink to="/politica-privacidad" class="text-xs text-inaka-cream/40 transition-colors hover:text-inaka-cream/70">Política de privacidad</NuxtLink>
          <span class="h-3 w-px bg-inaka-cream/20" />
          <NuxtLink to="/aviso-legal" class="text-xs text-inaka-cream/40 transition-colors hover:text-inaka-cream/70">Aviso legal</NuxtLink>
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
