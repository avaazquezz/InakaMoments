<template>
  <header class="w-full border-b border-inaka-nude bg-inaka-cream sticky top-0 z-50">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <NuxtLink to="/" aria-label="Inaka Moments — inicio" class="relative z-50">
        <NuxtImg
          src="/logo.png"
          alt="Inaka Moments"
          class="h-14 w-auto"
          width="112"
          height="112"
          format="webp"
          loading="eager"
        />
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden items-center gap-6 md:flex">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inaka-gold"
          :class="isActive(link.to) ? 'text-inaka-terra' : 'text-inaka-terra/70 hover:text-inaka-terra'"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Desktop CTA -->
      <div class="hidden md:block">
        <a
          :href="catalogPdfUrl"
          target="_blank"
          rel="noopener"
          class="rounded-md border border-inaka-terra px-4 py-2 text-sm font-medium text-inaka-terra outline-none transition-colors hover:bg-inaka-nude focus-visible:ring-2 focus-visible:ring-inaka-gold"
        >
          Catálogo PDF
        </a>
      </div>

      <!-- Mobile hamburger button -->
      <button
        type="button"
        class="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-inaka-gold md:hidden"
        :aria-expanded="menuAbierto"
        aria-label="Abrir menú de navegación"
        @click="menuAbierto = !menuAbierto"
      >
        <span class="sr-only">Menú</span>
        <div class="flex flex-col justify-center items-center w-5 h-5">
          <span
            class="block h-0.5 w-5 bg-inaka-terra transition-all duration-300"
            :class="menuAbierto ? 'rotate-45 translate-y-[7px]' : 'rotate-0 translate-y-0'"
          />
          <span
            class="block h-0.5 w-5 bg-inaka-terra transition-all duration-300 mt-1.5"
            :class="menuAbierto ? 'opacity-0 -translate-x-2' : 'opacity-100 translate-x-0'"
          />
          <span
            class="block h-0.5 w-5 bg-inaka-terra transition-all duration-300 mt-1.5"
            :class="menuAbierto ? '-rotate-45 -translate-y-[7px]' : 'rotate-0 translate-y-0'"
          />
        </div>
      </button>
    </div>

    <!-- Mobile menu overlay -->
    <Transition name="menu-fade">
      <div
        v-if="menuAbierto"
        class="fixed inset-0 top-[73px] z-40 flex flex-col bg-inaka-cream/98 backdrop-blur-sm md:hidden"
      >
        <nav class="flex flex-col gap-1 px-4 py-6">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="rounded-lg px-4 py-3 text-base font-medium outline-none transition-colors hover:bg-inaka-nude focus-visible:ring-2 focus-visible:ring-inaka-gold"
            :class="isActive(link.to) ? 'text-inaka-terra bg-inaka-nude/60' : 'text-inaka-terra'"
            @click="menuAbierto = false"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
        <div class="border-t border-inaka-nude px-4 py-6">
          <a
            :href="catalogPdfUrl"
            target="_blank"
            rel="noopener"
            class="block w-full rounded-md border border-inaka-terra px-4 py-3 text-center text-sm font-medium text-inaka-terra outline-none transition-colors hover:bg-inaka-nude focus-visible:ring-2 focus-visible:ring-inaka-gold"
            @click="menuAbierto = false"
          >
            Descargar Catálogo PDF
          </a>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { CATALOG_PDF_PATH } from '~~/shared/catalogPdf'

const menuAbierto = ref(false)
const catalogPdfUrl = storagePublicUrl('catalog', CATALOG_PDF_PATH)

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/packs', label: 'Packs' },
  { to: '/configurador', label: 'Presupuesto' },
  { to: '/galeria', label: 'Galería' },
  { to: '/como-funciona', label: 'Cómo funciona' },
  { to: '/contacto', label: 'Contacto' },
]

// Close menu on route change
const route = useRoute()
watch(() => route.path, () => {
  menuAbierto.value = false
})

function isActive(to: string): boolean {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<style scoped>
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.2s ease;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}
</style>
