<template>
  <main v-if="pack">
    <section class="py-16 bg-inaka-cream sm:py-24">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav
          class="mb-8 text-sm text-inaka-terra/50"
          aria-label="Migas de pan"
        >
          <NuxtLink
            to="/packs"
            class="rounded outline-none transition-colors hover:text-inaka-terra focus-visible:ring-2 focus-visible:ring-inaka-gold"
          >Packs</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-inaka-terra/80">{{ pack.name }}</span>
        </nav>

        <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-inaka-nude sm:p-12">
          <div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h1 class="font-display text-3xl font-bold text-inaka-terra sm:text-4xl">
              {{ pack.name }}
            </h1>
            <span
              v-if="pack.price != null"
              class="rounded-full bg-inaka-terra px-6 py-2 text-xl font-bold text-inaka-cream"
            >
              {{ formatEUR(pack.price) }}
            </span>
          </div>

          <p class="mb-8 text-lg text-inaka-terra/70 leading-relaxed">
            {{ pack.description }}
          </p>

          <div class="mb-8 rounded-2xl bg-inaka-cream p-6 ring-1 ring-inaka-nude">
            <p class="mb-4 text-sm font-semibold uppercase tracking-widest text-inaka-gold">
              El pack incluye
            </p>
            <ul class="flex flex-col gap-3">
              <li
                v-for="item in packIncludes(pack)"
                :key="item"
                class="flex items-start gap-3 text-inaka-terra/75"
              >
                <span class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-inaka-gold/20">
                  <Icon
                    name="lucide:check"
                    class="h-3 w-3 text-inaka-gold"
                    aria-hidden="true"
                  />
                </span>
                {{ item }}
              </li>
            </ul>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <BaseButtonLink
              :to="`/configurador?addPack=${pack.slug}`"
              :icon="undefined"
            >
              Añadir a mi presupuesto
            </BaseButtonLink>
            <NuxtLink
              to="/catalogo"
              class="rounded-md border border-inaka-terra px-8 py-3.5 text-center text-sm font-semibold text-inaka-terra outline-none transition-colors hover:bg-inaka-nude focus-visible:ring-2 focus-visible:ring-inaka-gold"
            >
              Ver productos sueltos
            </NuxtLink>
          </div>

          <p class="mt-6 text-xs text-inaka-terra/50">
            Montaje incluido · Reserva con mínimo 1 mes de antelación · El pago se realiza al agendar
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { buildPackSchema, buildBreadcrumbSchema } from '~~/shared/schema'

const route = useRoute()
const slug = route.params.slug as string

const { data: pack } = await usePack(slug)

if (!pack.value) {
  throw createError({ statusCode: 404, statusMessage: 'Pack no encontrado', fatal: true })
}

const pageUrl = computed(() => `https://inakamoments.com/packs/${slug}`)
const imagen = computed(() => {
  const imgs = jsonArray(pack.value?.images)
  return imgs.length ? storagePublicUrl('catalog-media', imgs[0]!) : null
})

useHead(() => ({
  title: `${pack.value?.name} — Packs Inaka Moments`,
  meta: [
    { name: 'description', content: `${pack.value?.description ?? ''} ${pack.value?.price != null ? formatEUR(pack.value.price) : ''}. Decoración de eventos en Abrera y Barcelona.` },
    { property: 'og:title', content: `${pack.value?.name} — Inaka Moments` },
    { property: 'og:description', content: pack.value?.description ?? '' },
    { property: 'og:image', content: imagen.value ?? 'https://inakamoments.com/logo.png' },
    { name: 'twitter:image', content: imagen.value ?? 'https://inakamoments.com/logo.png' },
  ],
}))

useJsonLd('pack', () => {
  if (!pack.value) return null
  return [
    buildPackSchema(pack.value, { url: pageUrl.value, imageUrl: imagen.value }),
    buildBreadcrumbSchema([
      { name: 'Packs', url: 'https://inakamoments.com/packs' },
      { name: pack.value.name, url: pageUrl.value },
    ]),
  ]
})
</script>
