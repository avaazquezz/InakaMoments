<template>
  <main>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-inaka-cream py-24 sm:py-32">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-inaka-mauve/10 blur-3xl" />
        <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/10 blur-3xl" />
      </div>
      <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-4">Resolvemos tus dudas</p>
        <h1 class="text-4xl font-bold text-inaka-terra sm:text-5xl lg:text-6xl mb-6">
          Preguntas frecuentes
        </h1>
        <p class="text-inaka-terra/70 text-lg max-w-2xl mx-auto">
          Todo lo que necesitas saber sobre precios, reservas, montaje y alquiler de estructuras.
        </p>
      </div>
    </section>

    <!-- FAQ agrupadas por categoría -->
    <section class="py-16 bg-white">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div v-if="pending" class="py-20 text-center text-inaka-terra/50">Cargando…</div>

        <div v-else class="flex flex-col gap-10">
          <div v-for="grupo in grupos" :key="grupo.categoria">
            <h2 class="mb-4 text-sm font-semibold uppercase tracking-widest text-inaka-gold">
              {{ grupo.label }}
            </h2>
            <div class="flex flex-col gap-3">
              <details
                v-for="faq in grupo.faqs"
                :key="faq.id"
                class="group rounded-2xl bg-inaka-cream ring-1 ring-inaka-nude open:shadow-sm"
              >
                <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-semibold text-inaka-terra [&::-webkit-details-marker]:hidden">
                  {{ faq.question }}
                  <svg class="h-4 w-4 shrink-0 text-inaka-gold transition-transform group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <p class="px-6 pb-5 text-inaka-terra/70 leading-relaxed">{{ faq.answer }}</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-inaka-terra text-inaka-cream">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold sm:text-4xl mb-5">¿Tienes otra pregunta?</h2>
        <p class="text-inaka-cream/70 text-lg mb-8 max-w-2xl mx-auto">
          Escríbenos sin compromiso y te respondemos en menos de 24 horas.
        </p>
        <NuxtLink
          to="/contacto"
          class="inline-flex items-center gap-2 rounded-md bg-inaka-gold px-8 py-4 text-sm font-semibold text-inaka-terra shadow-sm transition-opacity hover:opacity-90"
        >
          Contactar
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Preguntas frecuentes — Inaka Moments',
  meta: [
    { name: 'description', content: 'Dudas sobre decoración de eventos con globos: montaje incluido, desmontaje, desplazamiento, reservas con antelación, pagos y fianzas de alquiler.' },
    { property: 'og:title', content: 'FAQ — Inaka Moments' },
  ],
})

const { data: faqs, pending } = useFaqs()

const CATEGORIA_LABELS: Record<string, string> = {
  general: 'General',
  precios: 'Precios y extras',
  reservas: 'Reservas y pagos',
}

const grupos = computed(() => {
  const byCat = new Map<string, typeof faqs.value>()
  for (const f of faqs.value) {
    const cat = f.category ?? 'general'
    if (!byCat.has(cat)) byCat.set(cat, [])
    byCat.get(cat)!.push(f)
  }
  return [...byCat.entries()].map(([categoria, items]) => ({
    categoria,
    label: CATEGORIA_LABELS[categoria] ?? categoria,
    faqs: items,
  }))
})
</script>
