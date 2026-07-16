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
    lunes_viernes: '9:00 — 18:00',
    sabados: '10:00 — 14:00',
    domingos: 'Cerrado',
  },
})

/** "9:00 — 18:00" → { opens: "09:00", closes: "18:00" } (null si está cerrado ese tramo). */
function parseHorario(texto: string): { opens: string, closes: string } | null {
  const match = texto.match(/(\d{1,2}):(\d{2})\s*[—-]\s*(\d{1,2}):(\d{2})/)
  if (!match) return null
  const pad = (h: string, m: string) => `${h.padStart(2, '0')}:${m}`
  return { opens: pad(match[1]!, match[2]!), closes: pad(match[3]!, match[4]!) }
}

useJsonLd('local-business', () => {
  const laborables = parseHorario(contacto.value.horario.lunes_viernes)
  const sabado = parseHorario(contacto.value.horario.sabados)
  const openingHours = [
    ...(laborables ? [{ dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], ...laborables }] : []),
    ...(sabado ? [{ dayOfWeek: ['Saturday'], ...sabado }] : []),
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
