<template>
  <main v-if="producto">
    <!-- Migas + detalle -->
    <section class="py-16 bg-inaka-cream sm:py-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav class="mb-8 text-sm text-inaka-terra/50" aria-label="Migas de pan">
          <NuxtLink to="/catalogo" class="hover:text-inaka-terra transition-colors">Catálogo</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-inaka-terra/80">{{ producto.name }}</span>
        </nav>

        <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <!-- Imagen -->
          <div class="relative overflow-hidden rounded-3xl bg-inaka-nude/40 shadow-md aspect-[4/3]">
            <NuxtImg
              v-if="imagen"
              :src="imagen"
              :alt="producto.name"
              sizes="sm:100vw lg:600px"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full w-full items-center justify-center">
              <span class="text-8xl opacity-70">🎈</span>
            </div>
            <span
              v-if="producto.is_rental"
              class="absolute top-4 right-4 rounded-full bg-inaka-terra/90 px-4 py-1.5 text-xs font-semibold text-inaka-cream"
            >
              Opción alquiler de estructura
            </span>
          </div>

          <!-- Info -->
          <div class="flex flex-col gap-5">
            <p class="text-xs font-semibold uppercase tracking-widest text-inaka-gold">
              {{ CATEGORY_LABELS[producto.category] ?? producto.category }}
            </p>
            <h1 class="text-3xl font-bold text-inaka-terra sm:text-4xl">{{ producto.name }}</h1>
            <p class="text-2xl font-bold text-inaka-terra">{{ productPriceLabel(producto) }}</p>
            <p class="text-inaka-terra/70 leading-relaxed">{{ producto.description }}</p>

            <!-- Tramos de precio -->
            <div v-if="tiers.length" class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
              <p class="mb-3 text-sm font-semibold text-inaka-terra">Precios</p>
              <ul class="flex flex-col gap-2">
                <li v-for="t in tiers" :key="t.label" class="flex items-center justify-between text-sm">
                  <span class="text-inaka-terra/70">{{ t.label }}</span>
                  <span class="font-bold text-inaka-terra">{{ formatEUR(t.price) }}</span>
                </li>
              </ul>
            </div>

            <!-- Tamaños y opciones -->
            <div v-if="sizes.length || options.length" class="flex flex-col gap-3">
              <div v-if="sizes.length" class="flex flex-wrap items-center gap-2">
                <span class="text-sm font-semibold text-inaka-terra">Tamaños:</span>
                <span v-for="s in sizes" :key="s" class="rounded-full bg-inaka-nude/60 px-3 py-1 text-xs font-medium text-inaka-terra/80">{{ s }}</span>
              </div>
              <div v-if="options.length" class="flex flex-wrap items-center gap-2">
                <span class="text-sm font-semibold text-inaka-terra">Opciones:</span>
                <span v-for="o in options" :key="o" class="rounded-full bg-inaka-gold/15 px-3 py-1 text-xs font-medium text-inaka-terra/80">{{ o }}</span>
              </div>
            </div>

            <!-- Alquiler / fianza -->
            <div v-if="producto.is_rental" class="flex gap-3 rounded-xl bg-inaka-gold/10 border border-inaka-gold/25 px-4 py-3">
              <svg class="mt-0.5 h-4 w-4 shrink-0 text-inaka-gold" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p class="text-xs text-inaka-terra/70 leading-relaxed">
                La estructura puede alquilarse abonando una <strong>fianza reembolsable</strong>,
                que se devuelve al finalizar el evento tras comprobar el estado del material. Consúltanos.
              </p>
            </div>

            <!-- CTA -->
            <div class="mt-2 flex flex-col gap-3 sm:flex-row">
              <NuxtLink
                :to="`/configurador?add=${producto.slug}`"
                class="rounded-md bg-inaka-terra px-8 py-3.5 text-center text-sm font-semibold text-inaka-cream shadow-sm transition-opacity hover:opacity-90"
              >
                Añadir a mi presupuesto
              </NuxtLink>
              <NuxtLink
                to="/catalogo"
                class="rounded-md border border-inaka-terra px-8 py-3.5 text-center text-sm font-semibold text-inaka-terra transition-colors hover:bg-inaka-nude"
              >
                Seguir explorando
              </NuxtLink>
            </div>

            <p class="text-xs text-inaka-terra/50">
              Montaje incluido · Desmontaje opcional +15 € · Pedidos &gt;120 € incluyen un detallito 🎁
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Relacionados -->
    <section v-if="relacionados.length" class="py-16 bg-white">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 class="mb-8 text-2xl font-bold text-inaka-terra">También te puede gustar</h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <NuxtLink
            v-for="p in relacionados"
            :key="p.id"
            :to="`/catalogo/${p.slug}`"
            class="group rounded-2xl bg-inaka-cream p-6 ring-1 ring-inaka-nude transition-all hover:shadow-md"
          >
            <h3 class="font-bold text-inaka-terra group-hover:text-inaka-gold transition-colors">{{ p.name }}</h3>
            <p class="mt-1 text-sm text-inaka-terra/60 line-clamp-2">{{ p.description }}</p>
            <p class="mt-3 text-sm font-bold text-inaka-terra">{{ productPriceLabel(p) }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: producto } = await useProduct(slug)

if (!producto.value) {
  throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado', fatal: true })
}

const { data: todos } = useProducts()

const imagen = computed(() => {
  const imgs = jsonArray(producto.value!.images)
  return imgs.length ? storagePublicUrl('catalog-media', imgs[0]!) : null
})
const tiers = computed(() => productTiers(producto.value!))
const sizes = computed(() => productSizes(producto.value!))
const options = computed(() => productOptions(producto.value!))

const relacionados = computed(() =>
  todos.value
    .filter(p => p.category === producto.value!.category && p.slug !== slug)
    .slice(0, 3),
)

useHead(() => ({
  title: `${producto.value?.name} — Catálogo Inaka Moments`,
  meta: [
    { name: 'description', content: `${producto.value?.description ?? ''} ${productPriceLabel(producto.value!)}. Decoración de eventos en Abrera y Barcelona.` },
    { property: 'og:title', content: `${producto.value?.name} — Inaka Moments` },
    { property: 'og:description', content: producto.value?.description ?? '' },
  ],
}))
</script>
