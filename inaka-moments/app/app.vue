<template>
  <div class="bg-inaka-cream text-inaka-terra min-h-screen font-sans">
    <NuxtRouteAnnouncer />
    <TheHeader />
    <main>
      <HeroSection />

      <AboutSection />

      <SocialProofGallery />

      <section id="lead-wizard" class="flex min-h-screen items-center bg-white py-24">
        <div class="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <div class="mb-10 text-center">
            <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-2">Sin compromiso</p>
            <h2 class="text-3xl font-bold text-inaka-terra sm:text-4xl">Diseña tu evento en 2 minutos</h2>
            <p class="mt-3 text-inaka-terra/60 text-base">Cuéntanos qué tienes en mente y te preparamos una propuesta a medida.</p>
          </div>
          <LeadWizard />
        </div>
      </section>
    </main>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Inaka Moments',
  meta: [
    {
      name: 'description',
      content: 'Diseñamos experiencias únicas para bodas, comuniones, cumpleaños y eventos corporativos. Cada detalle cuidado con mimo.',
    },
  ],
})
</script>
