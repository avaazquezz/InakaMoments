<template>
  <div class="min-h-screen bg-[#FAFAF8]">
    <!-- Top bar -->
    <header class="bg-white shadow-sm border-b border-[#D4BFA0] px-6 py-4 flex items-center justify-between">
      <div>
        <h1 class="text-lg font-bold text-[#8B3A2A]">Inaka Moments</h1>
        <p class="text-xs text-[#8B3A2A]/60">Panel de administración</p>
      </div>
      <button
        @click="handleLogout"
        class="text-sm text-[#8B3A2A]/60 hover:text-[#8B3A2A] transition-colors"
      >
        Cerrar sesión
      </button>
    </header>

    <!-- Page content -->
    <main class="p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
function handleLogout() {
  localStorage.removeItem('inaka_token')
  navigateTo('/admin')
}
</script>