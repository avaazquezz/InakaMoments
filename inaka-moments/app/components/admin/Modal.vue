<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[150] flex items-center justify-center p-4"
      @keydown.esc.stop="$emit('close')"
    >
      <div
        class="absolute inset-0 bg-inaka-terra/40 backdrop-blur-sm"
        aria-hidden="true"
        @click="$emit('close')"
      />
      <div
        ref="panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        class="relative max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-xl outline-none"
        :class="{ 'max-w-sm': size === 'sm', 'max-w-md': !size || size === 'md', 'max-w-2xl': size === 'lg' }"
        @keydown.tab="trapTab"
      >
        <h2
          :id="titleId"
          class="mb-4 text-lg font-bold text-inaka-terra"
        >
          {{ title }}
        </h2>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
// Diálogo accesible compartido del panel: role="dialog" + aria-modal, foco
// atrapado dentro, cierre con Escape y devolución del foco al elemento que lo
// abrió. Sustituye a los <Teleport> con overlay artesanal de cada pantalla.
const props = defineProps<{
  open: boolean
  title: string
  size?: 'sm' | 'md' | 'lg'
}>()

defineEmits<{ close: [] }>()

const titleId = useId()
const panel = ref<HTMLElement | null>(null)
let opener: HTMLElement | null = null

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    opener = document.activeElement as HTMLElement | null
    await nextTick()
    const first = panel.value?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? panel.value)?.focus()
  }
  else {
    opener?.focus()
    opener = null
  }
})

function trapTab(e: KeyboardEvent) {
  const items = Array.from(panel.value?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
  if (items.length === 0) {
    e.preventDefault()
    return
  }
  const first = items[0]!
  const last = items[items.length - 1]!
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  }
  else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
</script>
