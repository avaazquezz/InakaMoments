<template>
  <section class="relative overflow-hidden bg-inaka-cream py-24 sm:py-32">
    <div
      class="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      <div class="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-inaka-mauve/10 blur-3xl" />
      <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/10 blur-3xl" />
    </div>
    <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
      <p
        v-if="eyebrow"
        class="mb-4 text-sm font-semibold uppercase tracking-widest text-inaka-gold"
      >
        {{ eyebrow }}
      </p>
      <h1 class="mb-6 font-display text-4xl font-bold text-inaka-terra sm:text-5xl lg:text-6xl">
        <slot name="title">
          {{ title }}
        </slot>
      </h1>
      <p
        v-if="subtitle"
        class="mx-auto max-w-2xl text-lg text-inaka-terra/70"
      >
        {{ subtitle }}
      </p>
      <div
        v-if="$slots.default"
        class="mt-8"
      >
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title?: string
  subtitle?: string
}>()
</script>
