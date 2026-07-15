<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm font-semibold text-inaka-terra">{{ label }}</label>
    <div class="flex flex-wrap gap-2">
      <span v-for="(item, i) in modelValue" :key="i" class="inline-flex items-center gap-1.5 rounded-full bg-inaka-nude/60 px-3 py-1 text-xs font-medium text-inaka-terra">
        {{ item }}
        <button type="button" class="text-inaka-terra/50 hover:text-red-600" @click="remove(i)">
          <svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </span>
    </div>
    <div class="flex flex-wrap gap-2">
      <input
        v-model="draft"
        type="text"
        :placeholder="placeholder"
        class="min-w-0 flex-1 rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
        @keydown.enter.prevent="add"
      />
      <button type="button" class="shrink-0 rounded-lg border border-inaka-beige px-3 py-2 text-xs font-semibold text-inaka-terra hover:bg-inaka-nude/40" @click="add">Añadir</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string[]
  label: string
  placeholder?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [string[]] }>()

const draft = ref('')

function add() {
  const value = draft.value.trim()
  if (!value) return
  emit('update:modelValue', [...props.modelValue, value])
  draft.value = ''
}

function remove(i: number) {
  const next = [...props.modelValue]
  next.splice(i, 1)
  emit('update:modelValue', next)
}
</script>
