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
      <div class="grid grid-cols-1 gap-14 py-16 md:grid-cols-3 lg:gap-20">

        <!-- Col 1: Marca + tagline -->
        <div class="flex flex-col gap-5">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-inaka-gold/70 mb-3">Inaka Moments</p>
            <p class="text-2xl font-bold leading-snug text-inaka-cream">
              Cada detalle,<br>
              <span class="text-inaka-gold">una historia.</span>
            </p>
          </div>
          <p class="text-sm leading-relaxed text-inaka-cream/60 max-w-xs">
            Creamos experiencias únicas para los momentos más importantes de tu vida. Con alma, con mimo, con arte.
          </p>
          <!-- Instagram CTA destacado -->
          <a
            href="https://www.instagram.com/inaka.moments"
            target="_blank"
            rel="noopener noreferrer"
            class="group mt-1 inline-flex w-fit items-center gap-3 rounded-xl border border-inaka-cream/15 bg-inaka-cream/5 px-4 py-3 transition-all hover:border-inaka-gold/40 hover:bg-inaka-cream/10"
            aria-label="Síguenos en Instagram"
          >
            <!-- Icono Instagram SVG -->
            <svg class="h-5 w-5 shrink-0 text-inaka-gold transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <div>
              <p class="text-xs font-semibold text-inaka-cream leading-none">@inaka.moments</p>
              <p class="text-[11px] text-inaka-cream/50 mt-0.5">Síguenos en Instagram</p>
            </div>
            <svg class="ml-auto h-3.5 w-3.5 text-inaka-cream/30 transition-transform group-hover:translate-x-0.5 group-hover:text-inaka-gold/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>

        <!-- Col 3: Contacto -->
        <div>
          <p class="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-inaka-gold/70">Contacto</p>
          <ul class="flex flex-col gap-4">
            <li>
              <a
                href="mailto:nadine.tcae@gmail.com"
                class="group inline-flex items-start gap-3 text-sm text-inaka-cream/65 transition-colors hover:text-inaka-cream"
              >
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-inaka-gold/60" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                nadine.tcae@gmail.com
              </a>
            </li>
            <li>

            </li>
            <li class="inline-flex items-start gap-3 text-sm text-inaka-cream/65">
              <svg class="mt-0.5 h-4 w-4 shrink-0 text-inaka-gold/60" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Abrera, Cataluña, España.
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
          <a href="#" class="text-xs text-inaka-cream/40 transition-colors hover:text-inaka-cream/70">Política de privacidad</a>
          <span class="h-3 w-px bg-inaka-cream/20" />
          <a href="#" class="text-xs text-inaka-cream/40 transition-colors hover:text-inaka-cream/70">Aviso legal</a>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
const servicios = [
  'Bodas',
  'Comuniones',
  'Cumpleaños',
  'Eventos corporativos',
  'Decoración temática',
  'Photocall & atrezzo',
]
</script>
