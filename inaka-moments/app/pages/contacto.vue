<template>
  <main>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-inaka-cream py-24 sm:py-32">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-inaka-mauve/10 blur-3xl" />
        <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/10 blur-3xl" />
      </div>
      <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-4">Contacto</p>
        <h1 class="text-4xl font-bold text-inaka-terra sm:text-5xl lg:text-6xl mb-6">
          Hablemos de tu evento
        </h1>
        <p class="text-inaka-terra/70 text-lg max-w-2xl mx-auto">
          Estamos aquí para ayudarte a diseñar la celebración perfecta. Escríbenos y respondemos en menos de 24 horas.
        </p>
      </div>
    </section>

    <!-- Info + Mapa -->
    <section class="py-20 bg-white">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-16 lg:grid-cols-2">

          <!-- Info contacto -->
          <div class="flex flex-col gap-10">
            <div>
              <h2 class="text-2xl font-bold text-inaka-terra mb-6">Datos de contacto</h2>
              <ul class="flex flex-col gap-5">
                <li class="flex items-start gap-4">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-inaka-gold/15">
                    <svg class="h-5 w-5 text-inaka-gold" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-inaka-terra">Email</p>
                    <a :href="`mailto:${contacto.email}`" class="text-inaka-terra/65 hover:text-inaka-terra transition-colors">
                      {{ contacto.email }}
                    </a>
                  </div>
                </li>
                <li class="flex items-start gap-4">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-inaka-gold/15">
                    <svg class="h-5 w-5 text-inaka-gold" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-inaka-terra">Ubicación</p>
                    <p class="text-inaka-terra/65">{{ contacto.ubicacion }}</p>
                  </div>
                </li>
                <li class="flex items-start gap-4">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-inaka-gold/15">
                    <svg class="h-5 w-5 text-inaka-gold" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-inaka-terra">Instagram</p>
                    <a :href="contacto.instagram" target="_blank" rel="noopener noreferrer" class="text-inaka-terra/65 hover:text-inaka-terra transition-colors">
                      {{ igHandle }}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Horario -->
            <div>
              <h3 class="text-lg font-bold text-inaka-terra mb-4">Horario de atención</h3>
              <div class="rounded-xl bg-inaka-cream p-6 ring-1 ring-inaka-nude">
                <div class="flex justify-between items-center py-2 border-b border-inaka-nude last:border-0">
                  <span class="text-sm text-inaka-terra/70">Lunes — Viernes</span>
                  <span class="text-sm font-semibold text-inaka-terra">{{ contacto.horario.lunes_viernes }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-inaka-nude last:border-0">
                  <span class="text-sm text-inaka-terra/70">Sábados</span>
                  <span class="text-sm font-semibold text-inaka-terra">{{ contacto.horario.sabados }}</span>
                </div>
                <div class="flex justify-between items-center py-2 last:border-0">
                  <span class="text-sm text-inaka-terra/70">Domingos</span>
                  <span class="text-sm text-inaka-terra/50">{{ contacto.horario.domingos }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Mapa decorativo -->
          <div class="rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-inaka-beige relative">
            <iframe
              src="https://www.google.com/maps?q=41.5171106,1.8989255&z=13&output=embed"
              width="100%"
              height="100%"
              style="border:0;"
              :allowfullscreen="true"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Ubicación Inaka Moments — Abrera, Cataluña"
              class="absolute inset-0"
            />
          </div>

        </div>
      </div>
    </section>

    <!-- CTA Configurador -->
    <section class="bg-inaka-cream py-20 sm:py-24">
      <div class="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl bg-inaka-terra px-8 py-14 text-center text-inaka-cream shadow-lg sm:px-14">
          <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-inaka-gold">Sin compromiso</p>
          <h2 class="text-3xl font-bold sm:text-4xl">¿Listo para presupuestar tu evento?</h2>
          <p class="mx-auto mt-4 max-w-xl text-lg text-inaka-cream/70">
            Elige tus productos, ajusta cantidades y recibe tu presupuesto orientativo al instante con nuestro configurador.
          </p>
          <NuxtLink
            to="/configurador"
            class="mt-8 inline-flex items-center gap-2 rounded-xl bg-inaka-gold px-8 py-4 text-sm font-semibold text-inaka-terra shadow-sm transition-opacity hover:opacity-90"
          >
            Ir al configurador
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="py-20 bg-inaka-terra text-inaka-cream">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold sm:text-4xl mb-5">¿Tienes prisa?</h2>
        <p class="text-inaka-cream/70 text-lg mb-8 max-w-2xl mx-auto">
          Si prefieres resolverlo directamente, escríbenos por Instagram y te respondemos al momento.
        </p>
        <a
          :href="contacto.instagram"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] px-8 py-4 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Escribir por Instagram
        </a>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Datos de contacto editables por la dueña (site_content.contacto)
const { data: contacto } = useSiteSection('contacto', {
  email: 'nadine.tcae@gmail.com',
  ubicacion: 'Abrera, Cataluña, España',
  instagram: 'https://www.instagram.com/inaka.moments',
  horario: {
    lunes_viernes: '9:00 — 18:00',
    sabados: '10:00 — 14:00',
    domingos: 'Cerrado',
  },
})

const igHandle = computed(() => `@${contacto.value.instagram.split('/').filter(Boolean).pop()}`)

useHead({
  title: 'Contacto — Inaka Moments',
  meta: [
    {
      name: 'description',
      content: 'Contacta con Inaka Moments para diseñar tu evento. Estamos en Abrera, Cataluña. Respondemos en menos de 24 horas.',
    },
    { property: 'og:title', content: 'Contacto — Inaka Moments' },
    { property: 'og:description', content: 'Contacta con Inaka Moments. Estamos aquí para ayudarte a diseñar la celebración perfecta.' },
    { property: 'og:image', content: '/og-contacto.png' },
  ],
})
</script>
