<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Top bar -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="Inaka Moments" class="h-8 w-auto" />
            <span class="text-gray-400 text-sm">/</span>
            <span class="text-sm font-medium text-gray-700">Panel Admin</span>
          </div>
          <button
            type="button"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            @click="logout"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
function logout() {
  localStorage.removeItem('inaka_admin_token')
  navigateTo('/admin')
}
</script>
