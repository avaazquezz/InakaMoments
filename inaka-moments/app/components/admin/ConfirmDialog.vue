<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="open" class="fixed inset-0 z-[150] flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-inaka-terra/40 backdrop-blur-sm" @click="$emit('cancel')" />
        <div class="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <h2 class="text-lg font-bold text-inaka-terra">{{ title }}</h2>
          <p v-if="message" class="mt-2 text-sm text-inaka-terra/70">{{ message }}</p>
          <div class="mt-6 flex justify-end gap-3">
            <button type="button" class="rounded-lg border border-inaka-beige px-4 py-2 text-sm font-medium text-inaka-terra/70 transition-colors hover:bg-inaka-nude/50" @click="$emit('cancel')">
              {{ cancelLabel ?? 'Cancelar' }}
            </button>
            <button
              type="button"
              class="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              :class="danger ? 'bg-red-600' : 'bg-inaka-terra'"
              @click="$emit('confirm')"
            >
              {{ confirmLabel ?? 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}>()

defineEmits<{ confirm: [], cancel: [] }>()
</script>

<style scoped>
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.15s ease;
}
.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}
</style>
