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
useHead({
  title: 'Inaka Moments — Decoración de eventos con alma',
  meta: [
    {
      name: 'description',
      content: 'Diseñamos experiencias únicas para cumpleaños, baby showers, bautizos, comuniones y eventos corporativos. Cada detalle cuidado con mimo.',
    },
  ],
})
</script>
