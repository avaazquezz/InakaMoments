<template>
  <main>
    <!-- 1 · Portada -->
    <HeroSection />

    <!-- 2 · Sobre nosotras -->
    <AboutSection />

    <!-- 3 · Propuesta de valor / condiciones claras -->
    <WhyInakaSection />

    <!-- 4 · Ocasiones (enlaces SEO) -->
    <OccasionsSection />

    <!-- 5 · Catálogo (teaser → configurador) -->
    <CatalogTeaser />

    <!-- 6 · Momentos reales (galería) -->
    <SocialProofGallery />

    <!-- 7 · Cómo funciona -->
    <HowItWorksSection />

    <!-- 8 · Reseñas (se autooculta si no hay publicadas) -->
    <TestimonialsSection />

    <!-- 9 · Zona de servicio (SEO local) -->
    <ServiceAreaSection />

    <!-- 10 · Preguntas frecuentes -->
    <FaqTeaserSection />

    <!-- 11 · Cierre / CTA final -->
    <FinalCtaSection />
  </main>
</template>

<script setup lang="ts">
import { buildFaqPageSchema, buildBusinessReviewsSchema } from '~~/shared/schema'

useHead({
  title: 'Inaka Moments — Decoración de eventos con alma',
  meta: [
    {
      name: 'description',
      content: 'Diseñamos experiencias únicas para cumpleaños, baby showers, bautizos, comuniones y eventos corporativos. Cada detalle cuidado con mimo.',
    },
    { property: 'og:title', content: 'Inaka Moments — Decoración de eventos con alma' },
    { property: 'og:description', content: 'Diseñamos experiencias únicas para cumpleaños, baby showers, bautizos, comuniones y eventos corporativos en Abrera y Barcelona.' },
    { property: 'og:image', content: 'https://inakamoments.com/logo.png' },
  ],
})

// Mismos subconjuntos que renderizan FaqTeaserSection/TestimonialsSection —
// el JSON-LD debe reflejar exactamente el contenido visible en la página.
const { data: faqs } = useFaqs()
const { data: testimonios } = useTestimonials()

useJsonLd('home', () => [
  buildFaqPageSchema(faqs.value.slice(0, 4)),
  buildBusinessReviewsSchema('Inaka Moments', 'https://inakamoments.com', testimonios.value.slice(0, 3)),
].filter((s): s is Record<string, unknown> => s !== null))
</script>
