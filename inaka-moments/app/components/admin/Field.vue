<template>
  <div class="flex flex-col gap-1.5">
    <label
      :for="id"
      class="text-xs font-semibold text-inaka-terra/80"
    >
      {{ label }}<span
        v-if="required"
        class="text-inaka-mauve"
      > *</span>
    </label>
    <slot :id="id" />
  </div>
</template>

<script setup lang="ts">
// Etiqueta + control asociados por id (label for=…), para que lectores de
// pantalla y el clic en la etiqueta funcionen. Uso:
//   <AdminField label="Nombre" required v-slot="{ id }"><input :id="id" …></AdminField>
defineProps<{ label: string, required?: boolean }>()

const id = useId()
</script>
