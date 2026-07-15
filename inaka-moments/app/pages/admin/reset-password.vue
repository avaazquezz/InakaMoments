<template>
  <div>
    <!-- Paso 1: pedir email -->
    <template v-if="stage === 'request'">
      <h1 class="mb-1 text-xl font-bold text-inaka-terra">Recuperar contraseña</h1>
      <p class="mb-6 text-sm text-inaka-terra/55">Te enviaremos un enlace para restablecerla.</p>

      <p v-if="linkError" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ linkError }}
      </p>

      <form v-if="!sent" class="flex flex-col gap-4" @submit.prevent="sendReset">
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-sm font-semibold text-inaka-terra">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="tu@email.com"
            class="rounded-xl border border-inaka-beige bg-white px-4 py-3 text-sm text-inaka-terra outline-none transition-all focus:border-inaka-terra"
          />
        </div>
        <button
          type="submit"
          :disabled="!emailValido || isSending"
          class="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-cream shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {{ isSending ? 'Enviando…' : 'Enviar enlace' }}
        </button>
      </form>
      <p v-else class="rounded-xl border border-inaka-nude bg-inaka-cream px-4 py-3 text-sm text-inaka-terra/75">
        Si ese email tiene una cuenta, te hemos enviado un enlace para restablecer la contraseña.
      </p>

      <NuxtLink to="/admin/login" class="mt-5 block text-center text-xs font-medium text-inaka-gold hover:underline">
        Volver a iniciar sesión
      </NuxtLink>
    </template>

    <!-- Paso 2: nueva contraseña (tras volver del enlace del correo) -->
    <template v-else>
      <h1 class="mb-1 text-xl font-bold text-inaka-terra">Nueva contraseña</h1>
      <p class="mb-6 text-sm text-inaka-terra/55">Elige una contraseña nueva para tu cuenta.</p>

      <form class="flex flex-col gap-4" @submit.prevent="updatePassword">
        <div class="flex flex-col gap-1.5">
          <label for="new-password" class="text-sm font-semibold text-inaka-terra">Nueva contraseña</label>
          <input id="new-password" v-model="newPassword" type="password" autocomplete="new-password" class="rounded-xl border border-inaka-beige bg-white px-4 py-3 text-sm text-inaka-terra outline-none transition-all focus:border-inaka-terra" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="confirm-password" class="text-sm font-semibold text-inaka-terra">Confirmar contraseña</label>
          <input id="confirm-password" v-model="confirmPassword" type="password" autocomplete="new-password" class="rounded-xl border border-inaka-beige bg-white px-4 py-3 text-sm text-inaka-terra outline-none transition-all focus:border-inaka-terra" />
        </div>
        <p v-if="updateError" class="text-xs text-red-500">{{ updateError }}</p>
        <button
          type="submit"
          :disabled="!canUpdate || isSending"
          class="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-cream shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {{ isSending ? 'Guardando…' : 'Guardar contraseña' }}
        </button>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin-auth' })
useHead({ title: 'Restablecer contraseña — Panel Inaka Moments' })

const supabase = useSupabaseClient()
const route = useRoute()

const stage = ref<'request' | 'update'>('request')
const isSending = ref(false)

// Supabase devuelve enlaces caducados/inválidos como error en la query Y en
// el hash (?error=...#error=...) — se comprueban ambos para avisar con un
// mensaje claro en vez de dejar la página en silencio sin explicar nada.
const codeExchangeFailed = ref(false)

const linkError = computed(() => {
  const queryCode = route.query.error_code
  if (typeof queryCode === 'string') return errorMessage(queryCode)
  if (import.meta.client) {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const hashCode = hashParams.get('error_code')
    if (hashCode) return errorMessage(hashCode)
  }
  if (codeExchangeFailed.value) return 'Este enlace ya no es válido (puede que ya se haya usado). Pide uno nuevo abajo.'
  return ''
})

function errorMessage(code: string): string {
  if (code === 'otp_expired') return 'Este enlace ha caducado. Pide uno nuevo abajo.'
  return 'Este enlace no es válido. Pide uno nuevo abajo.'
}

// Paso 1
const email = ref('')
const sent = ref(false)
const emailValido = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))

async function sendReset() {
  if (!emailValido.value) return
  isSending.value = true
  await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/admin/reset-password`,
  })
  isSending.value = false
  sent.value = true // mensaje neutro siempre, sin filtrar si el email existe
}

// Paso 2
const newPassword = ref('')
const confirmPassword = ref('')
const updateError = ref('')
const canUpdate = computed(() => newPassword.value.length >= 8 && newPassword.value === confirmPassword.value)

async function updatePassword() {
  if (!canUpdate.value) return
  isSending.value = true
  updateError.value = ''
  const { error } = await supabase.auth.updateUser({ password: newPassword.value })
  isSending.value = false
  if (error) {
    updateError.value = 'No hemos podido actualizar la contraseña. Inténtalo de nuevo.'
    return
  }
  await navigateTo('/admin')
}

// El enlace de INVITACIÓN puede dejar una sesión activa sin disparar
// 'PASSWORD_RECOVERY' — `hasRecoveryLink` exige que la URL traiga de verdad
// las marcas de ese enlace (code / type=invite|recovery). Sin esto, CUALQUIER
// sesión ya abierta en el navegador (p. ej. quien ya había iniciado sesión)
// bastaba para saltarse el email y cambiar la contraseña sin verificación.
const hasRecoveryLink = computed(() => {
  if (typeof route.query.code === 'string') return true
  if (import.meta.client) {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    return hash.get('type') === 'invite' || hash.get('type') === 'recovery'
  }
  return false
})

// Supabase dispara 'PASSWORD_RECOVERY' al aterrizar desde el enlace de
// recuperación, procesando el fragmento #access_token de la URL de forma
// asíncrona nada más cargar la página. El listener se registra ANTES de
// cualquier `await` para no perder el evento por una condición de carrera
// (si se comprobara `getSession()` primero, el evento podría dispararse
// mientras esa llamada está en vuelo, antes de que el listener exista).
onMounted(() => {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') stage.value = 'update'
  })

  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session && hasRecoveryLink.value) stage.value = 'update'
  })

  // Un enlace ya usado (o con un `code` inválido) no dispara PASSWORD_RECOVERY
  // ni deja error_code en la URL — el SDK falla el canje del código en
  // silencio dentro de su propia inicialización (no hay forma de "escuchar"
  // ese fallo). Si hay un `code` en la URL y tras un margen no se resolvió
  // sesión ni evento de recovery, lo tratamos como enlace inválido/caducado.
  if (typeof route.query.code === 'string') {
    setTimeout(() => {
      if (stage.value === 'request' && !linkError.value) codeExchangeFailed.value = true
    }, 2500)
  }
})
</script>
