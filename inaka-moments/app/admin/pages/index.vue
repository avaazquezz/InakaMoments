<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <!-- Logo header -->
      <div class="text-center mb-8">
        <img src="/logo.png" alt="Inaka Moments" class="h-16 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-800">Panel de administración</h1>
        <p class="text-gray-500 text-sm mt-1">Inaka Moments</p>
      </div>

      <!-- Login card -->
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <form @submit.prevent="login" class="flex flex-col gap-4">
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-500"
              :disabled="loading"
              autocomplete="current-password"
            />
          </div>

          <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="!password || loading"
            class="w-full rounded-lg bg-gray-800 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Verificando…' : 'Entrar' }}
          </button>
        </form>
      </div>

      <p class="text-center text-xs text-gray-400 mt-6">
        © {{ new Date().getFullYear() }} Inaka Moments · <a href="/" class="hover:underline">Ver web</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const password = ref('')
const loading = ref(false)
const error = ref('')

async function login() {
  if (!password.value || loading.value) return
  loading.value = true
  error.value = ''

  try {
    const res = await $fetch<{ token: string }>('/api/admin/login', {
      method: 'POST',
      body: { password: password.value },
    })
    // Store token in localStorage
    localStorage.setItem('inaka_admin_token', res.token)
    // Redirect to dashboard
    await navigateTo('/admin/dashboard')
  } catch (e: any) {
    error.value = e?.data?.message || 'Contraseña incorrecta'
    password.value = ''
  } finally {
    loading.value = false
  }
}
</script>
