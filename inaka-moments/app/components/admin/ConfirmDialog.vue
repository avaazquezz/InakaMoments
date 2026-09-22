<template>
  <AdminModal
    :open="open"
    :title="title"
    size="sm"
    @close="$emit('cancel')"
  >
    <p
      v-if="message"
      class="text-sm text-inaka-terra/80"
    >
      {{ message }}
    </p>
    <div class="mt-6 flex flex-wrap justify-end gap-3">
      <button
        type="button"
        class="rounded-lg border border-inaka-beige px-4 py-2 text-sm font-medium text-inaka-terra/80 transition-colors hover:bg-inaka-nude/50"
        @click="$emit('cancel')"
      >
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
  </AdminModal>
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
