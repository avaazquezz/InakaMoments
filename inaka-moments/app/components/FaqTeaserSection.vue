<template>
  <section v-if="destacadas.length" class="py-20 bg-white sm:py-24">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-inaka-gold">¿Te queda alguna duda?</p>
        <h2 class="font-display text-3xl font-bold text-inaka-terra sm:text-4xl">Preguntas frecuentes</h2>
      </div>

      <div class="flex flex-col gap-3">
        <details
          v-for="faq in destacadas"
          :key="faq.id"
          class="group rounded-2xl bg-inaka-cream px-6 py-1 ring-1 ring-inaka-nude"
        >
          <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl py-4 font-semibold text-inaka-terra outline-none marker:hidden focus-visible:ring-2 focus-visible:ring-inaka-gold">
            {{ faq.question }}
            <Icon name="lucide:plus" class="h-5 w-5 shrink-0 text-inaka-gold transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
          </summary>
          <p class="pb-5 text-sm leading-relaxed text-inaka-terra/70">{{ faq.answer }}</p>
        </details>
      </div>

      <div class="mt-8 text-center">
        <NuxtLink
          to="/faq"
          class="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-inaka-gold outline-none hover:underline focus-visible:ring-2 focus-visible:ring-inaka-gold"
        >
          Ver todas las preguntas frecuentes
          <Icon name="lucide:arrow-right" class="h-3.5 w-3.5" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: faqs } = useFaqs()
const destacadas = computed(() => faqs.value.slice(0, 4))
</script>
