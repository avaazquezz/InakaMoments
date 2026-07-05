<template>
  <main>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-inaka-cream py-24 sm:py-32">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-inaka-mauve/10 blur-3xl" />
        <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/10 blur-3xl" />
      </div>
      <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-4">Tú eliges, nosotros creamos</p>
        <h1 class="text-4xl font-bold text-inaka-terra sm:text-5xl lg:text-6xl mb-6">
          Catálogo de productos
        </h1>
        <p class="text-inaka-terra/70 text-lg max-w-2xl mx-auto">
          Cada elemento tiene su propio precio para que crees la combinación perfecta según tu estilo,
          presupuesto y tipo de evento. Todos los productos son combinables entre sí.
        </p>
      </div>
    </section>

    <!-- Filtros por categoría -->
    <section class="sticky top-[73px] z-30 bg-inaka-cream/95 backdrop-blur-sm border-b border-inaka-nude py-4">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button
            v-for="cat in categorias"
            :key="cat.value"
            type="button"
            class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
            :class="categoriaActiva === cat.value
              ? 'bg-inaka-terra text-inaka-cream'
              : 'bg-inaka-nude/60 text-inaka-terra/70 hover:bg-inaka-nude'"
            @click="categoriaActiva = cat.value"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- Grid de productos -->
    <section class="py-16 bg-white">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div v-if="pending" class="py-20 text-center text-inaka-terra/50">Cargando catálogo…</div>

        <div v-else class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="p in productosFiltrados"
            :key="p.id"
            :to="`/catalogo/${p.slug}`"
            class="group relative flex flex-col overflow-hidden rounded-2xl bg-inaka-cream shadow-sm ring-1 ring-inaka-nude transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <!-- Imagen o placeholder -->
            <div class="relative aspect-[4/3] overflow-hidden bg-inaka-nude/40">
              <NuxtImg
                v-if="productImage(p)"
                :src="productImage(p)!"
                :alt="p.name"
                loading="lazy"
                sizes="sm:100vw md:50vw lg:400px"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div v-else class="flex h-full w-full items-center justify-center">
                <span class="text-6xl opacity-70">{{ categoryEmoji(p.category) }}</span>
              </div>
              <span
                v-if="p.is_rental"
                class="absolute top-3 right-3 rounded-full bg-inaka-terra/90 px-3 py-1 text-[11px] font-semibold text-inaka-cream"
              >
                Opción alquiler
              </span>
            </div>

            <div class="flex flex-1 flex-col gap-2 p-6">
              <p class="text-[11px] font-semibold uppercase tracking-widest text-inaka-gold">
                {{ CATEGORY_LABELS[p.category] ?? p.category }}
              </p>
              <h2 class="text-lg font-bold text-inaka-terra leading-snug">{{ p.name }}</h2>
              <p class="text-sm text-inaka-terra/60 line-clamp-2">{{ p.description }}</p>

              <div class="mt-auto flex items-center justify-between pt-3">
                <span class="text-base font-bold text-inaka-terra">{{ productPriceLabel(p) }}</span>
                <span class="inline-flex items-center gap-1 text-xs font-semibold text-inaka-gold transition-transform group-hover:translate-x-0.5">
                  Ver detalle
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div v-if="!pending && productosFiltrados.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
          <span class="text-5xl mb-4">🎈</span>
          <p class="text-inaka-terra/60 text-lg">No hay productos en esta categoría todavía.</p>
          <button
            type="button"
            class="mt-4 rounded-lg bg-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-cream transition-opacity hover:opacity-90"
            @click="categoriaActiva = 'todos'"
          >
            Ver todo el catálogo
          </button>
        </div>
      </div>
    </section>

    <!-- Nota reglas + CTA -->
    <section class="py-20 bg-inaka-terra text-inaka-cream">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold sm:text-4xl mb-5">Montaje incluido en todos los precios</h2>
        <p class="text-inaka-cream/70 text-lg mb-8 max-w-2xl mx-auto">
          Y si tu pedido supera los 120 €, te llevas un detallito de Inaka Moments acorde a tu evento.
          Cuéntanos qué tienes en mente y te preparamos una propuesta a medida.
        </p>
        <div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <NuxtLink
            to="/#lead-wizard"
            class="inline-flex items-center gap-2 rounded-md bg-inaka-gold px-8 py-4 text-sm font-semibold text-inaka-terra shadow-sm transition-opacity hover:opacity-90"
          >
            Pedir presupuesto
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </NuxtLink>
          <NuxtLink
            to="/como-funciona"
            class="inline-flex items-center gap-2 rounded-md border border-inaka-cream/40 px-8 py-4 text-sm font-semibold text-inaka-cream transition-colors hover:bg-inaka-cream/10"
          >
            Cómo funciona
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Catálogo de productos — Inaka Moments',
  meta: [
    { name: 'description', content: 'Catálogo de decoración con globos: arcos, columnas, aros 360º, wall balloons, letreros LED, candy bar y más. Precios claros y todo combinable. Abrera y Barcelona.' },
    { property: 'og:title', content: 'Catálogo — Inaka Moments' },
    { property: 'og:description', content: 'Tú eliges, nosotros creamos. Descubre todos nuestros productos de decoración de eventos.' },
  ],
})

const { data: productos, pending } = useProducts()

const categoriaActiva = ref('todos')

const categorias = computed(() => {
  const present = [...new Set(productos.value.map(p => p.category))]
  return [
    { value: 'todos', label: 'Todos' },
    ...present.map(c => ({ value: c, label: CATEGORY_LABELS[c] ?? c })),
  ]
})

const productosFiltrados = computed(() =>
  categoriaActiva.value === 'todos'
    ? productos.value
    : productos.value.filter(p => p.category === categoriaActiva.value),
)

function productImage(p: Product): string | null {
  const imgs = jsonArray(p.images)
  return imgs.length ? storagePublicUrl('catalog-media', imgs[0]!) : null
}

function categoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    'estructuras': '🎈', 'globos': '🎈', 'led': '💡', 'baby': '🍼',
    'flores': '🌸', 'extras': '✨', 'detalles': '🎁', 'mesa-dulce': '🍬',
  }
  return map[cat] ?? '🎈'
}
</script>
