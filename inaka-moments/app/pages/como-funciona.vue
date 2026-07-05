<template>
  <main>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-inaka-cream py-24 sm:py-32">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-inaka-mauve/10 blur-3xl" />
        <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/10 blur-3xl" />
      </div>
      <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-4">Así de fácil</p>
        <h1 class="text-4xl font-bold text-inaka-terra sm:text-5xl lg:text-6xl mb-6">
          Cómo funciona
        </h1>
        <p class="text-inaka-terra/70 text-lg max-w-2xl mx-auto">
          De la idea al momento inolvidable en cuatro pasos, con precios claros y sin sorpresas.
        </p>
      </div>
    </section>

    <!-- Pasos -->
    <section class="py-16 bg-white">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(paso, i) in pasos"
            :key="paso.titulo"
            class="relative rounded-2xl bg-inaka-cream p-8 ring-1 ring-inaka-nude"
          >
            <span class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-inaka-terra text-base font-bold text-inaka-cream">
              {{ i + 1 }}
            </span>
            <span class="mb-3 block text-3xl" aria-hidden="true">{{ paso.icono }}</span>
            <h2 class="mb-2 text-lg font-bold text-inaka-terra">{{ paso.titulo }}</h2>
            <p class="text-sm leading-relaxed text-inaka-terra/65">{{ paso.descripcion }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Condiciones claras (reglas del negocio desde BD) -->
    <section class="py-16 bg-inaka-cream">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="mb-10 text-center">
          <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-2">Sin letra pequeña</p>
          <h2 class="text-3xl font-bold text-inaka-terra sm:text-4xl">Condiciones claras</h2>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="regla in reglas" :key="regla.titulo" class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-inaka-nude">
            <span class="mb-3 block text-2xl" aria-hidden="true">{{ regla.icono }}</span>
            <h3 class="mb-1.5 font-bold text-inaka-terra">{{ regla.titulo }}</h3>
            <p class="text-sm leading-relaxed text-inaka-terra/65">{{ regla.texto }}</p>
          </div>
        </div>
        <p class="mt-8 text-center">
          <NuxtLink to="/faq" class="inline-flex items-center gap-1 text-sm font-semibold text-inaka-gold hover:underline">
            Más dudas resueltas en las preguntas frecuentes
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </NuxtLink>
        </p>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-inaka-terra text-inaka-cream">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold sm:text-4xl mb-5">¿Empezamos con tu evento?</h2>
        <p class="text-inaka-cream/70 text-lg mb-8 max-w-2xl mx-auto">
          Cuéntanos qué celebras y en 2 minutos tendrás tu solicitud de presupuesto en marcha.
        </p>
        <NuxtLink
          to="/#lead-wizard"
          class="inline-flex items-center gap-2 rounded-md bg-inaka-gold px-8 py-4 text-sm font-semibold text-inaka-terra shadow-sm transition-opacity hover:opacity-90"
        >
          Diseñar mi evento
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Cómo funciona — Inaka Moments',
  meta: [
    { name: 'description', content: 'Cómo trabajamos: eliges del catálogo, pedimos presupuesto, confirmas con la señal y montamos el día del evento. Montaje incluido, condiciones claras.' },
    { property: 'og:title', content: 'Cómo funciona — Inaka Moments' },
  ],
})

// Reglas de negocio del catálogo, editables por la dueña en site_content.settings
const { data: settings } = useSiteSection('settings', {
  desmontaje_precio: 15,
  km_incluidos: 30,
  plus_gasolina: 'a consultar según distancia',
  umbral_detallito: 120,
  antelacion_dias: 30,
  pago_al_agendar: true,
  fianza_alquiler: 'según estructura, reembolsable al comprobar el estado',
})

const pasos = [
  {
    icono: '🛍️',
    titulo: 'Elige lo que te gusta',
    descripcion: 'Explora el catálogo y los packs. Cada elemento tiene su precio para que combines a tu gusto: arcos, columnas, letreros, candy bar…',
  },
  {
    icono: '💬',
    titulo: 'Pide tu presupuesto',
    descripcion: 'Cuéntanos tu ocasión, la fecha y lo que tienes en mente con el formulario de 2 minutos. Te respondemos en menos de 24 h.',
  },
  {
    icono: '📅',
    titulo: 'Confirma tu fecha',
    descripcion: 'Cuando aceptes la propuesta, bloqueamos tu fecha en la agenda. El pago se realiza al momento de agendar.',
  },
  {
    icono: '🎈',
    titulo: 'Nosotros montamos',
    descripcion: 'El día del evento llegamos, montamos y lo dejamos todo perfecto. Tú solo tienes que disfrutar del momento.',
  },
]

const reglas = computed(() => [
  {
    icono: '🔧',
    titulo: 'Montaje incluido',
    texto: `Todos los precios incluyen el montaje. Desmontaje opcional por +${formatEUR(settings.value.desmontaje_precio)}.`,
  },
  {
    icono: '🚗',
    titulo: 'Desplazamiento',
    texto: `Los primeros ${settings.value.km_incluidos} km están incluidos. A partir de ahí se añade un plus de gasolina (${settings.value.plus_gasolina}).`,
  },
  {
    icono: '🎁',
    titulo: 'Detallito de regalo',
    texto: `Si tu pedido supera los ${formatEUR(settings.value.umbral_detallito)}, te llevas un detallito de Inaka Moments acorde a tu evento.`,
  },
  {
    icono: '⏰',
    titulo: 'Reserva con antelación',
    texto: `Agenda tu evento con un mínimo de ${Math.round(settings.value.antelacion_dias / 30)} mes de antelación para que preparemos cada detalle con mimo.`,
  },
  {
    icono: '💳',
    titulo: 'Pago al agendar',
    texto: 'El pago se realiza al momento de agendar: así tu fecha queda bloqueada en nuestra agenda.',
  },
  {
    icono: '🔄',
    titulo: 'Alquiler con fianza',
    texto: `Algunas estructuras pueden alquilarse con fianza (${settings.value.fianza_alquiler}).`,
  },
])
</script>
