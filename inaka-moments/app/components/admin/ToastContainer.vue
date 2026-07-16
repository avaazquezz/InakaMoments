<template>
  <Teleport to="body">
    <div class="fixed bottom-4 inset-x-4 z-[200] flex flex-col gap-2 sm:inset-x-auto sm:left-auto sm:right-4 sm:w-full sm:max-w-sm">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-start gap-3 rounded-xl border-l-4 bg-white px-4 py-3 shadow-lg"
          :class="borderClass(toast.type)"
        >
          <span
            class="mt-0.5 shrink-0"
            v-html="icon(toast.type)"
          />
          <p class="flex-1 text-sm text-inaka-terra">
            {{ toast.message }}
          </p>
          <button
            type="button"
            class="shrink-0 text-inaka-terra/40 hover:text-inaka-terra"
            aria-label="Cerrar"
            @click="dismiss(toast.id)"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            /></svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Toast } from '~/composables/useToast'

const { toasts, dismiss } = useToast()

function borderClass(type: Toast['type']): string {
  if (type === 'success') return 'border-green-500'
  if (type === 'error') return 'border-red-500'
  return 'border-inaka-gold'
}

function icon(type: Toast['type']): string {
  if (type === 'success') return '<svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>'
  if (type === 'error') return '<svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
  return '<svg class="h-5 w-5 text-inaka-gold" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
