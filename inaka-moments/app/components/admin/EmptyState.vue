<template>
  <div class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-inaka-beige bg-white px-6 py-14 text-center">
    <span class="flex h-12 w-12 items-center justify-center rounded-full bg-inaka-nude/60 text-inaka-terra/50" v-html="icon ?? defaultIcon" />
    <p class="text-sm font-semibold text-inaka-terra">{{ title }}</p>
    <p v-if="message" class="max-w-xs text-xs text-inaka-terra/50">{{ message }}</p>
    <div v-if="$slots.action" class="mt-1">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  message?: string
  icon?: string
}>()

const defaultIcon = '<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-6-4h6m2 11H7a2 2 0 01-2-2V6a2 2 0 012-2h6l6 6v10a2 2 0 01-2 2z" /></svg>'
</script>
