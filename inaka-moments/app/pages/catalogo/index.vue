<template>
  <main>
    <PageHero
      eyebrow="Tú eliges, nosotros creamos"
      title="Catálogo de productos"
      subtitle="Cada elemento tiene su propio precio para que crees la combinación perfecta según tu estilo, presupuesto y tipo de evento. Todos los productos son combinables entre sí."
    />

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
                  <Icon name="lucide:arrow-right" class="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div v-if="!pending && productosFiltrados.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
          <Icon name="lucide:package-search" class="mb-4 h-12 w-12 text-inaka-terra/30" aria-hidden="true" />
          <p class="text-inaka-terra/60 text-lg">No hay productos en esta categoría todavía.</p>
          <button
            type="button"
            class="mt-4 rounded-lg bg-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-cream outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-inaka-gold focus-visible:ring-offset-2"
            @click="categoriaActiva = 'todos'"
          >
            Ver todo el catálogo
          </button>
        </div>
      </div>
    </section>

    <CtaBand
      title="Montaje incluido en todos los precios"
      subtitle="Y si tu pedido supera los 120 €, te llevas un detallito de Inaka Moments acorde a tu evento. Cuéntanos qué tienes en mente y te preparamos una propuesta a medida."
    >
      <BaseButtonLink to="/configurador" variant="accent">Configurar mi presupuesto</BaseButtonLink>
      <BaseButtonLink to="/como-funciona" variant="outline" :icon="undefined">Cómo funciona</BaseButtonLink>
    </CtaBand>
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
