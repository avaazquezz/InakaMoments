<template>
  <main v-if="ocasion">
    <PageHero
      :eyebrow="EVENT_TYPE_LABELS[ocasion.event_type] ?? 'Ocasión'"
      :title="ocasion.title"
      :subtitle="ocasion.intro ?? undefined"
    >
      <BaseButtonLink :to="`/configurador?ocasion=${ocasion.event_type}`">
        {{ ctaLabel }}
      </BaseButtonLink>
    </PageHero>

    <!-- Packs para esta ocasión -->
    <section
      v-if="packsOcasion.length"
      class="py-16 bg-inaka-terra text-inaka-cream"
    >
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 class="mb-8 text-center font-display text-2xl font-bold sm:text-3xl">
          El pack perfecto para esta ocasión
        </h2>
        <div class="mx-auto grid max-w-3xl grid-cols-1 gap-6">
          <NuxtLink
            v-for="pack in packsOcasion"
            :key="pack.id"
            :to="`/packs/${pack.slug}`"
            class="group flex flex-col items-start justify-between gap-4 rounded-2xl bg-inaka-cream/10 p-8 ring-1 ring-inaka-cream/20 transition-colors hover:bg-inaka-cream/15 focus-visible:ring-2 focus-visible:ring-inaka-gold sm:flex-row sm:items-center"
          >
            <div>
              <h3 class="text-xl font-bold">{{ pack.name }}</h3>
              <p class="mt-1 text-sm text-inaka-cream/70">{{ pack.description }}</p>
            </div>
            <span
              v-if="pack.price != null"
              class="shrink-0 rounded-full bg-inaka-gold px-5 py-2 text-base font-bold text-inaka-terra"
            >
              {{ formatEUR(pack.price) }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Productos recomendados -->
    <section class="py-16 bg-white">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 class="mb-8 font-display text-2xl font-bold text-inaka-terra sm:text-3xl">
          Productos recomendados
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="p in productosOcasion"
            :key="p.id"
            :to="`/catalogo/${p.slug}`"
            class="group overflow-hidden rounded-2xl bg-inaka-cream ring-1 ring-inaka-nude transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-inaka-gold"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-inaka-nude/40">
              <NuxtImg
                v-if="productImage(p)"
                :src="productImage(p)!"
                :alt="p.name"
                loading="lazy"
                sizes="sm:100vw md:50vw lg:350px"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <ProductImagePlaceholder
                v-else
                :category="p.category"
              />
            </div>
            <div class="p-6">
              <p class="text-[11px] font-semibold uppercase tracking-widest text-inaka-gold mb-2">
                {{ CATEGORY_LABELS[p.category] ?? p.category }}
              </p>
              <h3 class="font-bold text-inaka-terra group-hover:text-inaka-gold transition-colors">{{ p.name }}</h3>
              <p class="mt-1 text-sm text-inaka-terra/60 line-clamp-2">{{ p.description }}</p>
              <p class="mt-3 text-sm font-bold text-inaka-terra">{{ productPriceLabel(p) }}</p>
            </div>
          </NuxtLink>
        </div>
        <div class="mt-10 text-center">
          <NuxtLink
            to="/catalogo"
            class="inline-flex items-center gap-2 rounded-md border border-inaka-terra px-8 py-3.5 text-sm font-semibold text-inaka-terra transition-colors hover:bg-inaka-nude"
          >
            Ver el catálogo completo
          </NuxtLink>
        </div>
      </div>
    </section>

    <FaqTeaserSection />

    <!-- CTA final -->
    <section class="py-20 bg-inaka-cream">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="mb-5 font-display text-3xl font-bold text-inaka-terra sm:text-4xl">
          Cuéntanos tu idea
        </h2>
        <p class="text-inaka-terra/70 text-lg mb-8 max-w-2xl mx-auto">
          Te asesoramos sin compromiso según tu espacio y presupuesto. Servicio en Abrera,
          Baix Llobregat y alrededores de Barcelona.
        </p>
        <BaseButtonLink
          :to="`/configurador?ocasion=${ocasion.event_type}`"
          :icon="undefined"
        >
          Configurar mi presupuesto
        </BaseButtonLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { buildBreadcrumbSchema, buildFaqPageSchema } from '~~/shared/schema'

const route = useRoute()
const slug = route.params.slug as string

const { data: ocasion } = await useOccasion(slug)

if (!ocasion.value) {
  throw createError({ statusCode: 404, statusMessage: 'Ocasión no encontrada', fatal: true })
}

const { data: productos } = useProducts()
const { data: packs } = usePacks()
const { data: faqs } = useFaqs()

const productosOcasion = computed(() =>
  productos.value.filter(p => productMatchesEventType(p, ocasion.value!.event_type)).slice(0, 6),
)

const packsOcasion = computed(() =>
  packs.value.filter((pk) => {
    const types = jsonArray(pk.event_types)
    return types.length === 0 || types.includes(ocasion.value!.event_type)
  }),
)

// "Diseñar mi cumpleaños/bautizo/..." funciona con toLowerCase() para casi
// todas las ocasiones (son sustantivos), pero "corporativo" es adjetivo —
// única excepción explícita para no leerse mal en español.
const ctaLabel = computed(() => {
  const label = EVENT_TYPE_LABELS[ocasion.value!.event_type] ?? 'evento'
  return ocasion.value!.event_type === 'corporativo' ? 'Diseñar mi evento corporativo' : `Diseñar mi ${label.toLowerCase()}`
})

function productImage(p: Product): string | null {
  const imgs = jsonArray(p.images)
  return imgs.length ? storagePublicUrl('catalog-media', imgs[0]!) : null
}

useHead(() => ({
  title: ocasion.value?.seo_title ?? `${ocasion.value?.title} — Inaka Moments`,
  meta: [
    { name: 'description', content: ocasion.value?.seo_description ?? ocasion.value?.intro ?? '' },
    { property: 'og:title', content: ocasion.value?.seo_title ?? ocasion.value?.title ?? '' },
    { property: 'og:description', content: ocasion.value?.seo_description ?? '' },
    { property: 'og:image', content: 'https://inakamoments.com/logo.png' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
}))

useJsonLd('occasion', () => {
  if (!ocasion.value) return null
  return [
    buildBreadcrumbSchema([
      { name: 'Ocasiones', url: 'https://inakamoments.com/#ocasiones' },
      { name: ocasion.value.title, url: `https://inakamoments.com/ocasiones/${slug}` },
    ]),
    buildFaqPageSchema(faqs.value.slice(0, 4)),
  ]
})
</script>
