<template>
  <div>
    <h1 class="mb-1 text-xl font-bold text-inaka-terra">Panel Inaka Moments</h1>
    <p class="mb-6 text-sm text-inaka-terra/55">Inicia sesión para gestionar el negocio.</p>

    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <div class="flex flex-col gap-1.5">
        <label for="email" class="text-sm font-semibold text-inaka-terra">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="tu@email.com"
          class="rounded-xl border bg-white px-4 py-3 text-sm text-inaka-terra outline-none transition-all"
          :class="touched.email && !emailValido ? 'border-red-300 ring-1 ring-red-200' : email ? 'border-inaka-terra ring-1 ring-inaka-terra/20' : 'border-inaka-beige focus:border-inaka-terra'"
          @blur="touched.email = true"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="password" class="text-sm font-semibold text-inaka-terra">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="••••••••"
          class="rounded-xl border bg-white px-4 py-3 text-sm text-inaka-terra outline-none transition-all"
          :class="touched.password && !password ? 'border-red-300 ring-1 ring-red-200' : password ? 'border-inaka-terra ring-1 ring-inaka-terra/20' : 'border-inaka-beige focus:border-inaka-terra'"
          @blur="touched.password = true"
        />
      </div>

      <div v-if="submitError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ submitError }}
      </div>

      <button
        type="submit"
        :disabled="!canSubmit || isSending"
        class="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-cream shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg v-if="isSending" class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        {{ isSending ? 'Entrando…' : 'Entrar' }}
      </button>
    </form>

    <NuxtLink to="/admin/reset-password" class="mt-5 block text-center text-xs font-medium text-inaka-gold hover:underline">
      ¿Olvidaste tu contraseña?
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin-auth' })
useHead({ title: 'Iniciar sesión — Panel Inaka Moments' })

const supabase = useSupabaseClient()

const email = ref('')
const password = ref('')
const touched = reactive({ email: false, password: false })
const isSending = ref(false)
const submitError = ref('')

const emailValido = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
const canSubmit = computed(() => emailValido.value && password.value.length > 0)

async function submit() {
  touched.email = true
  touched.password = true
  if (!canSubmit.value) return

  isSending.value = true
  submitError.value = ''
  const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
  isSending.value = false

  if (error) {
    submitError.value = error.message === 'Invalid login credentials'
      ? 'Email o contraseña incorrectos.'
      : 'No hemos podido iniciar sesión. Inténtalo de nuevo.'
    return
  }

  await navigateTo('/admin')
}
</script>
