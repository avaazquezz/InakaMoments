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
    disponibilidad: 'Respondemos en menos de 24 horas, todos los días',
    mensaje: 'Ofrecemos la máxima calidad de servicio a nuestros clientes en todo momento.',
  },
})

useJsonLd('local-business', () => {
  // Sin horas de apertura reales que declarar (no hay local físico con
  // horario fijo): mejor omitir openingHoursSpecification que inventar un
  // horario, y "00:00–23:59 todos los días" que Google leía como 24/7 real
  // contradecía directamente "respondemos en menos de 24h" en /contacto.
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
  })
})
</script>
