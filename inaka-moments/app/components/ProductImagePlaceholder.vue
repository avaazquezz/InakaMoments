<template>
  <div class="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-inaka-nude/60 to-inaka-beige/50 text-inaka-terra/50">
    <Icon
      :name="icon"
      class="h-9 w-9"
      aria-hidden="true"
    />
    <span class="text-[10px] font-semibold uppercase tracking-wide">Foto próximamente</span>
  </div>
</template>

<script setup lang="ts">
// Placeholder de marca para producto/pack sin foto todavía — usado en las 4
// páginas del catálogo (home, /catalogo, /packs, /ocasiones) en vez de que
// cada una trate la ausencia de imagen de forma distinta (nada, un emoji
// suelto...). Sustituir por la foto real desde /admin en cuanto exista;
// mientras tanto, no afirma tener "trabajos reales" que no existen.
const props = defineProps<{ category?: string | null }>()

const CATEGORY_ICONS: Record<string, string> = {
  'estructuras': 'lucide:party-popper',
  'globos': 'lucide:party-popper',
  'led': 'lucide:lightbulb',
  'baby': 'lucide:baby',
  'flores': 'lucide:flower-2',
  'extras': 'lucide:sparkles',
  'detalles': 'lucide:gift',
  'mesa-dulce': 'lucide:cake-slice',
}

const icon = computed(() => (props.category && CATEGORY_ICONS[props.category]) || 'lucide:image')
</script>
