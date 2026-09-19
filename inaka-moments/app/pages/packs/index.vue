<template>
  <main>
    <PageHero
      eyebrow="Todo pensado, todo incluido"
      title="Packs completos"
      subtitle="Combinaciones cerradas de nuestros productos favoritos, listas para montar el día de tu evento a un precio redondo."
    />

    <!-- Packs -->
    <section class="py-16 bg-white">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          v-if="pending"
          class="py-20 text-center text-inaka-terra/50"
        >
          Cargando packs…
        </div>

        <div
          v-else-if="packs.length"
          class="grid grid-cols-1 gap-8"
          :class="packs.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-xl'"
        >
          <NuxtLink
            v-for="pack in packs"
            :key="pack.id"
            :to="`/packs/${pack.slug}`"
            class="group relative flex flex-col overflow-hidden rounded-3xl bg-inaka-cream shadow-sm ring-1 ring-inaka-nude transition-all hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-inaka-gold"
          >
            <div class="absolute inset-x-0 top-0 z-10 h-0.5 bg-gradient-to-r from-inaka-gold/0 via-inaka-gold to-inaka-gold/0 opacity-0 transition-opacity group-hover:opacity-100" />
            <div class="relative aspect-[16/9] overflow-hidden bg-inaka-nude/40">
              <NuxtImg
                v-if="packImage(pack)"
                :src="packImage(pack)!"
                :alt="pack.name"
                loading="lazy"
                sizes="sm:100vw md:50vw lg:500px"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <ProductImagePlaceholder v-else />
            </div>
            <div class="flex flex-1 flex-col p-8">
              <div class="mb-4 flex items-start justify-between gap-4">
                <h2 class="text-2xl font-bold text-inaka-terra">{{ pack.name }}</h2>
                <span
                  v-if="pack.price != null"
                  class="shrink-0 rounded-full bg-inaka-terra px-4 py-1.5 text-sm font-bold text-inaka-cream"
                >
                  {{ formatEUR(pack.price) }}
                </span>
              </div>
              <p class="mb-5 text-inaka-terra/65 leading-relaxed">{{ pack.description }}</p>
              <ul class="mb-6 flex flex-col gap-2">
                <li
                  v-for="item in packIncludes(pack)"
                  :key="item"
                  class="flex items-start gap-2 text-sm text-inaka-terra/60"
                >
                  <Icon
                    name="lucide:check"
                    class="mt-0.5 h-4 w-4 shrink-0 text-inaka-gold"
                    aria-hidden="true"
                  />
                  {{ item }}
                </li>
              </ul>
              <span class="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-inaka-gold transition-transform group-hover:translate-x-0.5">
                Ver pack completo
                <Icon
                  name="lucide:arrow-right"
                  class="h-4 w-4"
                  aria-hidden="true"
                />
              </span>
            </div>
          </NuxtLink>
        </div>

        <div
          v-else
          class="flex flex-col items-center justify-center py-20 text-center"
        >
          <Icon
            name="lucide:gift"
            class="mb-4 h-12 w-12 text-inaka-terra/30"
            aria-hidden="true"
          />
          <p class="text-inaka-terra/60 text-lg">
            Estamos preparando nuevos packs. ¡Vuelve pronto!
          </p>
        </div>
      </div>
    </section>

    <CtaBand
      title="¿Prefieres montarlo a tu manera?"
      subtitle="Todos los productos del catálogo se pueden combinar entre sí. Elige los que más te gusten en el configurador y ve el precio al instante."
    >
      <BaseButtonLink
        to="/configurador"
        variant="accent"
      >
        Configurar mi presupuesto
      </BaseButtonLink>
      <BaseButtonLink
        to="/catalogo"
        variant="outline"
        :icon="undefined"
      >
        Explorar el catálogo
      </BaseButtonLink>
    </CtaBand>
  </main>
</template>

<script setup lang="ts">
import { buildItemListSchema } from '~~/shared/schema'

useHead({
  title: 'Packs completos — Inaka Moments',
  meta: [
    { name: 'description', content: 'Packs cerrados de decoración con globos, como el Pack Baby "Dulce Espera" por 130€: cajas BABY, osito, cartel LED, arco y guirnalda. Abrera y Barcelona.' },
    { property: 'og:title', content: 'Packs — Inaka Moments' },
    { property: 'og:description', content: 'Combinaciones completas listas para tu evento a precio redondo.' },
    { property: 'og:image', content: 'https://inakamoments.com/logo.png' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})

const { data: packs, pending } = usePacks()

useJsonLd('packs-list', () => buildItemListSchema(
  packs.value.map(pk => ({ name: pk.name, url: `https://inakamoments.com/packs/${pk.slug}` })),
))

function packImage(pack: Pack): string | null {
  const imgs = jsonArray(pack.images)
  return imgs.length ? storagePublicUrl('catalog-media', imgs[0]!) : null
}
</script>
