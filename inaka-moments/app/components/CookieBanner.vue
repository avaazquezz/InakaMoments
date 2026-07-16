<template>
  <Transition name="cookie-slide">
    <div
      v-if="visible"
      class="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6"
      role="dialog"
      aria-label="Aviso de cookies"
    >
      <div class="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl bg-inaka-terra p-6 text-inaka-cream shadow-2xl ring-1 ring-inaka-gold/30 sm:flex-row sm:items-center">
        <p class="flex-1 text-sm leading-relaxed text-inaka-cream/85">
          🍪 Esta web solo utiliza <strong>cookies esenciales</strong> para su funcionamiento
          (no usamos cookies publicitarias ni de rastreo). Más información en nuestra
          <NuxtLink
            to="/politica-privacidad"
            class="rounded font-semibold text-inaka-gold outline-none hover:underline focus-visible:ring-2 focus-visible:ring-inaka-gold"
          >política de privacidad</NuxtLink>.
        </p>
        <button
          type="button"
          class="shrink-0 rounded-md bg-inaka-gold px-6 py-2.5 text-sm font-semibold text-inaka-terra outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-inaka-cream focus-visible:ring-offset-2 focus-visible:ring-offset-inaka-terra"
          @click="accept"
        >
          Entendido
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
/**
 * Banner informativo de cookies (solo esenciales por ahora).
 * Cuando se añada analítica (Fase 8), evolucionará a gestor de consentimiento
 * opt-in por categorías.
 */
const STORAGE_KEY = 'inaka-cookies-ack'
const visible = ref(false)

onMounted(() => {
  visible.value = localStorage.getItem(STORAGE_KEY) !== '1'
})

function accept() {
  localStorage.setItem(STORAGE_KEY, '1')
  visible.value = false
}
</script>

<style scoped>
.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.cookie-slide-enter-from,
.cookie-slide-leave-to {
  transform: translateY(1rem);
  opacity: 0;
}
</style>
