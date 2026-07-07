<template>
  <section class="py-20 bg-inaka-cream sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <!-- Texto -->
        <div>
          <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-inaka-gold">Dónde trabajamos</p>
          <h2 class="text-3xl font-bold text-inaka-terra sm:text-4xl">Llevamos la magia hasta tu evento</h2>
          <p class="mt-4 text-inaka-terra/70 leading-relaxed">
            Tenemos base en <strong class="text-inaka-terra">{{ contacto.ubicacion }}</strong> y nos desplazamos por
            el Baix Llobregat y los alrededores de Barcelona. Los primeros
            <strong class="text-inaka-terra">{{ settings.km_incluidos }} km</strong> están incluidos; más allá,
            solo un pequeño plus de desplazamiento.
          </p>

          <div class="mt-6 flex flex-wrap gap-2">
            <span
              v-for="zona in zonas"
              :key="zona"
              class="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-inaka-terra/80 ring-1 ring-inaka-nude"
            >
              {{ zona }}
            </span>
          </div>

          <p class="mt-6 text-sm text-inaka-terra/55">
            ¿Tu evento es un poco más lejos?
            <NuxtLink to="/contacto" class="font-semibold text-inaka-gold hover:underline">Consúltanos sin compromiso</NuxtLink>, seguro que llegamos.
          </p>
        </div>

        <!-- Tarjeta decorativa -->
        <div class="relative overflow-hidden rounded-3xl bg-white p-10 shadow-sm ring-1 ring-inaka-nude">
          <div class="pointer-events-none absolute inset-0" aria-hidden="true">
            <div class="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-inaka-mauve/15 blur-3xl" />
            <div class="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-inaka-gold/15 blur-3xl" />
          </div>
          <div class="relative flex flex-col items-center gap-4 text-center">
            <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-inaka-cream text-3xl shadow-sm ring-1 ring-inaka-nude" aria-hidden="true">📍</span>
            <p class="text-lg font-bold text-inaka-terra">{{ contacto.ubicacion }}</p>
            <p class="text-sm text-inaka-terra/60">Baix Llobregat · Área metropolitana de Barcelona</p>
            <span class="mt-2 inline-flex items-center gap-2 rounded-full bg-inaka-cream px-4 py-2 text-xs font-semibold text-inaka-terra shadow-sm ring-1 ring-inaka-nude">
              🚗 Primeros {{ settings.km_incluidos }} km incluidos
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: contacto } = useSiteSection('contacto', {
  ubicacion: 'Abrera, Cataluña, España',
})
const { data: settings } = useSiteSection('settings', {
  km_incluidos: 30,
})

const zonas = [
  'Abrera', 'Martorell', 'Esparreguera', 'Olesa de Montserrat',
  'Sant Andreu de la Barca', 'Sant Esteve Sesrovires', 'Collbató',
  'Baix Llobregat', 'Barcelona',
]
</script>
