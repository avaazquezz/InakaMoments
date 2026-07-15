<template>
  <section class="bg-inaka-terra py-20 text-inaka-cream">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
      <p v-if="eyebrow" class="mb-3 text-sm font-semibold uppercase tracking-widest text-inaka-gold">
        {{ eyebrow }}
      </p>
      <h2 class="mb-5 font-display text-3xl font-bold sm:text-4xl">{{ title }}</h2>
      <p v-if="subtitle" class="mx-auto mb-8 max-w-2xl text-lg text-inaka-cream/70">
        {{ subtitle }}
      </p>
      <div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <slot>
          <BaseButtonLink v-if="ctaTo" :to="ctaTo" variant="accent" :icon="ctaIcon">
            {{ ctaLabel }}
          </BaseButtonLink>
        </slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow?: string
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaTo?: string
  ctaIcon?: string
}>(), {
  ctaIcon: 'lucide:arrow-right',
})
</script>
