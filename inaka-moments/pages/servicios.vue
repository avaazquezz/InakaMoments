<template>
  <div class="bg-inaka-cream text-inaka-terra min-h-screen font-sans">
    <TheHeader />
    <main>
      <!-- Hero -->
      <section class="relative overflow-hidden bg-inaka-cream py-24 sm:py-32">
        <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div class="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-inaka-mauve/10 blur-3xl" />
          <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/10 blur-3xl" />
        </div>
        <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-4">Lo que hacemos</p>
          <h1 class="text-4xl font-bold text-inaka-terra sm:text-5xl lg:text-6xl mb-6">
            Servicios pensados<br />para cada momento
          </h1>
          <p class="text-inaka-terra/70 text-lg max-w-2xl mx-auto">
            Desde la primera idea hasta el último detalle, acompañamos cada celebración con creatividad, mimo y profesionalidad.
          </p>
        </div>
      </section>

      <!-- Servicios grid -->
      <section class="py-20 bg-white">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">

            <div
              v-for="servicio in servicios"
              :key="servicio.titulo"
              class="group relative overflow-hidden rounded-2xl bg-inaka-cream p-8 shadow-sm ring-1 ring-inaka-nude transition-shadow hover:shadow-md"
            >
              <div class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-inaka-gold/0 via-inaka-gold to-inaka-gold/0 opacity-0 transition-opacity group-hover:opacity-100" />
              <span class="text-4xl mb-5 block">{{ servicio.icono }}</span>
              <h3 class="text-xl font-bold text-inaka-terra mb-3">{{ servicio.titulo }}</h3>
              <p class="text-inaka-terra/65 leading-relaxed">{{ servicio.descripcion }}</p>
              <ul class="mt-4 flex flex-col gap-2">
                <li
                  v-for="item in servicio.incluye"
                  :key="item"
                  class="flex items-start gap-2 text-sm text-inaka-terra/60"
                >
                  <span class="text-inaka-gold mt-0.5">✓</span>
                  {{ item }}
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-20 bg-inaka-terra text-inaka-cream">
        <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl font-bold sm:text-4xl mb-5">¿No encuentras lo que buscas?</h2>
          <p class="text-inaka-cream/70 text-lg mb-8 max-w-2xl mx-auto">
            Cada evento es único. Cuéntanos tu idea y diseñamos juntos algo que supere tus expectativas.
          </p>
          <a
            href="#lead-wizard"
            class="inline-flex items-center gap-2 rounded-md bg-inaka-gold px-8 py-4 text-sm font-semibold text-inaka-terra shadow-sm transition-opacity hover:opacity-90"
          >
            Diseñar mi evento
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </main>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Servicios — Inaka Moments',
  meta: [
    {
      name: 'description',
      content: 'Servicios de decoración de eventos: bodas, comuniones, cumpleaños y eventos corporativos. Cada detalle cuidado con mimo.',
    },
    { property: 'og:title', content: 'Servicios — Inaka Moments' },
    { property: 'og:description', content: 'Descubre todos los servicios de decoración que ofrece Inaka Moments.' },
    { property: 'og:image', content: '/og-servicios.png' },
  ],
})

const servicios = [
  {
    icono: '💍',
    titulo: 'Bodas',
    descripcion: 'Diseñamos bodas que cuentan votre histoire. De la decoración floral a la coordinación del día.',
    incluye: [
      'Decoración floral completa',
      'Centros de mesa personalizados',
      'Photocall y atrezzo',
      'Arcos y fondos ceremony',
      'Coordinación día de la boda',
    ],
  },
  {
    icono: '✝️',
    titulo: 'Comuniones',
    descripcion: 'Celebraciones elegantes para uno de los días más especiales de la familia.',
    incluye: [
      'Decoración del espacio ceremony',
      'Mesa sweet & candy bar',
      'Detalles personalizados para invitados',
      'Photocall temática',
      'Coordinación del evento',
    ],
  },
  {
    icono: '🎂',
    titulo: 'Cumpleaños',
    descripcion: 'Fiestas que transforman cualquier espacio en un lugar mágico para celebrar.',
    incluye: [
      'Decoración temática completa',
      'Globos y estructuras',
      'Mesa dulce personalizada',
      'Photocall y fondo',
      'Ambientación con iluminación',
    ],
  },
  {
    icono: '🏢',
    titulo: 'Eventos corporativos',
    descripcion: 'Profesionalidad y diseño para eventos de empresa que dejan impresión.',
    incluye: [
      'Branding visual del espacio',
      'Decoración institucional',
      'Set-ups para presentaciones',
      'Welcome areas',
      'Ramekins y detalles de hospitalidad',
    ],
  },
  {
    icono: '📸',
    titulo: 'Photocall & Atrezzo',
    descripcion: 'Creamos esquinas mágicas para que cada invitado se lleve el mejor recuerdo.',
    incluye: [
      'Diseños personalizados',
      'Estructuras de globos',
      'Carteles y letreros',
      'Props y accesorios',
      'Instalación y desmontaje',
    ],
  },
  {
    icono: '🌸',
    titulo: 'Decoración temática',
    descripcion: '¿Tienes una idea? La hacemos realidad. Diseños únicos para visiones especiales.',
    incluye: [
      'Asesoramiento de estilo',
      'Propuestas 3D visuales',
      'Coordinación de proveedores',
      'Ejecución completa',
      'Alquiler de elementos decorativos',
    ],
  },
]
</script>
