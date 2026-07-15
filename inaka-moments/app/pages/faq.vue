<template>
  <main>
    <PageHero
      eyebrow="Resolvemos tus dudas"
      title="Preguntas frecuentes"
      subtitle="Todo lo que necesitas saber sobre precios, reservas, montaje y alquiler de estructuras."
    />

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
                <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-4 font-semibold text-inaka-terra outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-inaka-gold">
                  {{ faq.question }}
                  <Icon name="lucide:chevron-down" class="h-4 w-4 shrink-0 text-inaka-gold transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p class="px-6 pb-5 text-inaka-terra/70 leading-relaxed">{{ faq.answer }}</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CtaBand
      title="¿Tienes otra pregunta?"
      subtitle="Escríbenos sin compromiso y te respondemos en menos de 24 horas."
      cta-label="Contactar"
      cta-to="/contacto"
    />
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
