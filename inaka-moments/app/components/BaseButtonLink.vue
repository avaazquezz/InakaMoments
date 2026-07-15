<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="inline-flex items-center justify-center gap-2 rounded-md px-8 py-4 text-sm font-semibold shadow-sm outline-none transition motion-safe:hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
    :class="variantClasses"
  >
    <slot />
    <Icon v-if="icon" :name="icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
  </NuxtLink>
  <a
    v-else
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center justify-center gap-2 rounded-md px-8 py-4 text-sm font-semibold shadow-sm outline-none transition motion-safe:hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
    :class="variantClasses"
  >
    <slot />
    <Icon v-if="icon" :name="icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
  </a>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  to?: string
  href?: string
  icon?: string
  /** solid: terra sobre fondo claro · accent: gold sobre fondo oscuro · outline: contorno sobre fondo oscuro */
  variant?: 'solid' | 'accent' | 'outline'
}>(), {
  variant: 'solid',
})

const variantClasses = computed(() => ({
  solid: 'bg-inaka-terra text-inaka-cream focus-visible:ring-inaka-gold focus-visible:ring-offset-inaka-cream',
  accent: 'bg-inaka-gold text-inaka-terra focus-visible:ring-inaka-cream focus-visible:ring-offset-inaka-terra',
  outline: 'bg-inaka-cream/10 text-inaka-cream ring-1 ring-inaka-cream/40 focus-visible:ring-inaka-cream focus-visible:ring-offset-inaka-terra',
}[props.variant]))
</script>
