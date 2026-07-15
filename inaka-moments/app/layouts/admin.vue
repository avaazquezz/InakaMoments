<template>
  <div class="flex min-h-screen bg-inaka-cream font-sans text-inaka-terra">
    <OfflineBanner />
    <!-- Sidebar (desktop) -->
    <aside class="hidden w-64 shrink-0 flex-col border-r border-inaka-beige bg-white md:flex md:sticky md:top-0 md:h-screen">
      <div class="flex h-16 items-center gap-2 border-b border-inaka-beige px-5">
        <NuxtLink to="/admin" class="flex items-center gap-2">
          <img src="/logo.png" alt="Inaka Moments" class="h-9 w-auto" />
          <span class="text-sm font-bold text-inaka-terra">Panel</span>
        </NuxtLink>
      </div>
      <nav class="flex-1 overflow-y-auto px-3 py-4">
        <template v-for="item in navItems" :key="item.to">
          <p v-if="item.sectionLabel" class="mb-1.5 mt-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-inaka-terra/40 first:mt-0">
            {{ item.sectionLabel }}
          </p>
          <NuxtLink
            :to="item.to"
            class="mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
            :class="isActive(item.to) ? 'bg-inaka-terra text-inaka-cream' : 'text-inaka-terra/70 hover:bg-inaka-nude/50 hover:text-inaka-terra'"
          >
            <span class="shrink-0" v-html="item.icon" />
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>
      <div class="border-t border-inaka-beige p-3">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-inaka-terra/60 transition-colors hover:bg-inaka-nude/50 hover:text-inaka-terra"
          @click="signOut"
        >
          <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- Contenido -->
    <div class="flex min-h-screen min-w-0 flex-1 flex-col">
      <!-- Cabecera -->
      <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-inaka-beige bg-white px-4 sm:px-6">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg text-inaka-terra md:hidden"
            :aria-expanded="menuAbierto"
            aria-label="Abrir menú"
            @click="menuAbierto = !menuAbierto"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 class="text-base font-bold text-inaka-terra sm:text-lg">{{ currentTitle }}</h1>
        </div>
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-inaka-terra/60 hover:bg-inaka-nude/50 md:hidden"
          aria-label="Cerrar sesión"
          @click="signOut"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </header>

      <main class="flex-1 p-4 sm:p-6">
        <slot />
      </main>
    </div>

    <!-- Menú móvil -->
    <Transition name="menu-fade">
      <div v-if="menuAbierto" class="fixed inset-0 z-40 flex flex-col bg-white md:hidden">
        <div class="flex h-16 items-center justify-between border-b border-inaka-beige px-4">
          <span class="text-sm font-bold text-inaka-terra">Panel</span>
          <button type="button" class="flex h-9 w-9 items-center justify-center rounded-lg text-inaka-terra" aria-label="Cerrar menú" @click="menuAbierto = false">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav class="flex-1 overflow-y-auto px-3 py-4">
          <template v-for="item in navItems" :key="item.to">
            <p v-if="item.sectionLabel" class="mb-1.5 mt-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-inaka-terra/40 first:mt-0">
              {{ item.sectionLabel }}
            </p>
            <NuxtLink
              :to="item.to"
              class="mb-0.5 flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors"
              :class="isActive(item.to) ? 'bg-inaka-terra text-inaka-cream' : 'text-inaka-terra/70 hover:bg-inaka-nude/50'"
              @click="menuAbierto = false"
            >
              <span class="shrink-0" v-html="item.icon" />
              {{ item.label }}
            </NuxtLink>
          </template>
        </nav>
      </div>
    </Transition>

    <AdminToastContainer />
  </div>
</template>

<script setup lang="ts">
// Manifest propio del panel: `/admin-manifest.webmanifest` (scope /admin/,
// nombre "Inaka Moments — Panel") en vez de `<NuxtPwaManifest/>` (el de la
// web pública) — cada layout monta solo el suyo, sin colisión entre ambos.
useHead({
  link: [{ rel: 'manifest', href: '/admin-manifest.webmanifest' }],
  meta: [{ name: 'apple-mobile-web-app-title', content: 'Inaka Panel' }],
})

const route = useRoute()
const supabase = useSupabaseClient()
const menuAbierto = ref(false)

watch(() => route.path, () => { menuAbierto.value = false })

interface NavItem { to: string, label: string, icon: string, sectionLabel?: string }

const ICON = {
  dashboard: '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h8v8H3v-8zm10 3h8v5h-8v-5z" /></svg>',
  box: '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" /></svg>',
  gift: '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12v9H4v-9M2 7h20v5H2V7zm10 0v14M12 7c-1-3-5-5-5-2.5S9 7 12 7zm0 0c1-3 5-5 5-2.5S15 7 12 7z" /></svg>',
  photo: '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 5h16v14H4V5zm2 12l4.5-6 3 4L16 11l4 6M9 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>',
  doc: '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 3h7l5 5v13H7V3zm7 0v5h5M9 12h6M9 16h6" /></svg>',
  star: '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3l2.7 5.9 6.3.6-4.7 4.4 1.3 6.3L12 17l-5.6 3.2 1.3-6.3-4.7-4.4 6.3-.6L12 3z" /></svg>',
  users: '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1m18 0v-1a4 4 0 00-3-3.87M14 7a4 4 0 11-8 0 4 4 0 018 0zm6 3a3 3 0 11-2-5.6" /></svg>',
  receipt: '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6" /></svg>',
  calendar: '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 3v4M16 3v4M4 9h16M5 6h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1z" /></svg>',
  archive: '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5h18v4H3V5zm1 4h16v10H4V9zm5 3h6" /></svg>',
}

const navItems: NavItem[] = [
  { to: '/admin', label: 'Inicio', icon: ICON.dashboard },
  { to: '/admin/productos', label: 'Productos', icon: ICON.box, sectionLabel: 'Catálogo' },
  { to: '/admin/packs', label: 'Packs', icon: ICON.gift },
  { to: '/admin/galeria', label: 'Galería', icon: ICON.photo, sectionLabel: 'Contenido' },
  { to: '/admin/contenido', label: 'Contenido y ajustes', icon: ICON.doc },
  { to: '/admin/resenas', label: 'Reseñas', icon: ICON.star },
  { to: '/admin/leads', label: 'Clientes', icon: ICON.users, sectionLabel: 'Negocio' },
  { to: '/admin/presupuestos', label: 'Presupuestos', icon: ICON.receipt },
  { to: '/admin/agenda', label: 'Agenda', icon: ICON.calendar },
  { to: '/admin/inventario', label: 'Inventario alquiler', icon: ICON.archive },
]

function isActive(to: string): boolean {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}

const currentTitle = computed(() => {
  if (route.path === '/admin') return 'Inicio'
  const match = navItems
    .filter(i => i.to !== '/admin' && route.path.startsWith(i.to))
    .sort((a, b) => b.to.length - a.to.length)[0]
  return match?.label ?? 'Panel'
})

async function signOut() {
  await supabase.auth.signOut()
  await navigateTo('/admin/login')
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
