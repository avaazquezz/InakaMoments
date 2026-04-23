<template>
  <div class="min-h-screen bg-gradient-to-br from-[#8B3A2A] to-[#5c1f14] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Inaka Moments</h1>
        <p class="text-[#E8D0C8]/70 text-sm">Panel de administración</p>
      </div>

      <!-- Login card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <h2 class="text-xl font-semibold text-[#8B3A2A] mb-6 text-center">Acceder</h2>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-2">Contraseña</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] focus:ring-2 focus:ring-[#8B3A2A]/20 outline-none transition-all text-[#5c1f14]"
              :disabled="loading"
            />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {{ error }}
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-[#8B3A2A] hover:bg-[#5c1f14] text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
            :disabled="loading"
          >
            {{ loading ? 'Verificando...' : 'Entrar' }}
          </button>
        </form>
      </div>

      <p class="text-center text-[#E8D0C8]/50 text-xs mt-6">© Inaka Moments 2026</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!password.value) {
    error.value = 'Introduce la contraseña'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<{ token: string }>('/api/admin/login', {
      method: 'POST',
      body: { password: password.value },
    })
    // Store token in localStorage
    localStorage.setItem('inaka_token', res.token)
    // Navigate to dashboard
    await navigateTo('/admin/dashboard')
  } catch (e: any) {
    error.value = e?.data?.message || 'Contraseña incorrecta'
  } finally {
    loading.value = false
  }
}
</script>