<template>
  <div class="flex min-h-screen flex-col bg-inaka-cream font-sans text-inaka-terra">
    <NuxtPwaManifest />
    <OfflineBanner />
    <TheHeader />
    <div class="flex-1">
      <slot />
    </div>
    <TheFooter />
    <CookieBanner />
  </div>
</template>

<script setup lang="ts">
import { buildLocalBusinessSchema } from '~~/shared/schema'

useCanonical()

const { data: contacto } = useSiteSection('contacto', {
  email: 'nadine.tcae@gmail.com',
  instagram: 'https://www.instagram.com/inaka.moments',
  // Sin teléfono público todavía — se añade aquí en cuanto exista.
  telefono: '',
  horario: {
    disponibilidad: 'Disponibles 24h, los 7 días de la semana',
    mensaje: 'Ofrecemos la máxima calidad de servicio a nuestros clientes en todo momento.',
  },
})

useJsonLd('local-business', () => {
  const openingHours = [
    { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
  ]

  return buildLocalBusinessSchema({
    name: 'Inaka Moments',
    url: 'https://inakamoments.com',
    logoUrl: 'https://inakamoments.com/logo.png',
    email: contacto.value.email,
    telephone: contacto.value.telefono || null,
    addressLocality: 'Abrera',
    addressRegion: 'Barcelona',
    addressCountry: 'ES',
    areaServed: [
      'Abrera', 'Martorell', 'Esparreguera', 'Olesa de Montserrat',
      'Sant Andreu de la Barca', 'Sant Esteve Sesrovires', 'Collbató',
      'Baix Llobregat', 'Barcelona',
    ],
    sameAs: [contacto.value.instagram],
    openingHours,
  })
})
</script>
