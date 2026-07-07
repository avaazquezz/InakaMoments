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
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-inaka-terra">WhatsApp</p>
                    <a :href="waLink" target="_blank" rel="noopener noreferrer" class="text-inaka-terra/65 hover:text-inaka-terra transition-colors">
                      {{ waDisplay }}
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23975.5633677133!2d1.8989255!3d41.5171106!2m3!1f0!2f0!3f0!3m1!1i1!3e0"
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

    <!-- Formulario rápido (LeadWizard) -->
    <section id="lead-wizard" class="scroll-mt-24 bg-inaka-cream py-20 sm:py-24">
      <div class="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div class="mb-10 text-center">
          <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-inaka-gold">Sin compromiso</p>
          <h2 class="text-3xl font-bold text-inaka-terra sm:text-4xl">Cuéntanos tu evento en 2 minutos</h2>
          <p class="mt-3 text-base text-inaka-terra/60">
            ¿Prefieres no configurar precios ahora? Déjanos los datos y te preparamos una propuesta a medida.
            ¿Ya sabes lo que quieres?
            <NuxtLink to="/configurador" class="font-semibold text-inaka-gold hover:underline">Móntalo en el configurador</NuxtLink>.
          </p>
        </div>
        <LeadWizard />
      </div>
    </section>

    <!-- CTA final -->
    <section class="py-20 bg-inaka-terra text-inaka-cream">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold sm:text-4xl mb-5">¿Tienes prisa?</h2>
        <p class="text-inaka-cream/70 text-lg mb-8 max-w-2xl mx-auto">
          Si prefieres resolverlo directamente, escríbenos por WhatsApp y te respondemos al momento.
        </p>
        <a
          :href="waLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-8 py-4 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.06 6.988 2.916a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Escribir por WhatsApp
        </a>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Datos de contacto editables por la dueña (site_content.contacto)
const { data: contacto } = useSiteSection('contacto', {
  email: 'nadine.tcae@gmail.com',
  whatsapp: '+34000000000',
  ubicacion: 'Abrera, Cataluña, España',
  instagram: 'https://www.instagram.com/inaka.moments',
  horario: {
    lunes_viernes: '9:00 — 18:00',
    sabados: '10:00 — 14:00',
    domingos: 'Cerrado',
  },
})

const waLink = computed(() => `https://wa.me/${contacto.value.whatsapp.replace(/\D/g, '')}`)
const waDisplay = computed(() => contacto.value.whatsapp.replace(/^(\+\d{2})(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3 $4'))
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
