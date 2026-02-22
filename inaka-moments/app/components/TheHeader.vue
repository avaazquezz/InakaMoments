<template>
  <header class="w-full border-b border-inaka-nude bg-inaka-cream">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <NuxtLink to="/" aria-label="Inaka Moments — inicio">
        <img
          src="/logo.png"
          alt="Inaka Moments"
          class="h-14 w-auto"
          loading="eager"
        />
      </NuxtLink>

      <!-- Navigation -->
      <nav class="hidden items-center gap-6 md:flex">
        <NuxtLink
          to="/"
          class="text-sm font-medium text-inaka-terra/70 transition-colors hover:text-inaka-terra"
        >
          Inicio
        </NuxtLink>
        <NuxtLink
          to="/servicios"
          class="text-sm font-medium text-inaka-terra/70 transition-colors hover:text-inaka-terra"
        >
          Servicios
        </NuxtLink>
        <NuxtLink
          to="/galeria"
          class="text-sm font-medium text-inaka-terra/70 transition-colors hover:text-inaka-terra"
        >
          Galería
        </NuxtLink>
        <NuxtLink
          to="/contacto"
          class="text-sm font-medium text-inaka-terra/70 transition-colors hover:text-inaka-terra"
        >
          Contacto
        </NuxtLink>
      </nav>

      <!-- CTA -->
      <a
        href="/catalogo.pdf"
        target="_blank"
        rel="noopener noreferrer"
        class="rounded-md border border-inaka-terra px-4 py-2 text-sm font-medium text-inaka-terra transition-colors hover:bg-inaka-nude"
      >
        Catálogo PDF
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>
