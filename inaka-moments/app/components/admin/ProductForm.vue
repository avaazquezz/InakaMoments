<template>
  <form class="flex flex-col gap-6" @submit.prevent="submit">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-inaka-terra">Nombre <span class="text-inaka-mauve">*</span></label>
        <input v-model="form.name" type="text" required class="rounded-xl border border-inaka-beige bg-white px-4 py-2.5 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-inaka-terra">Categoría <span class="text-inaka-mauve">*</span></label>
        <input v-model="form.category" type="text" list="categorias" required class="rounded-xl border border-inaka-beige bg-white px-4 py-2.5 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
        <datalist id="categorias">
          <option v-for="c in categoriasConocidas" :key="c" :value="c" />
        </datalist>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-semibold text-inaka-terra">Descripción</label>
      <textarea v-model="form.description" rows="3" class="resize-none rounded-xl border border-inaka-beige bg-white px-4 py-2.5 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-inaka-terra">Precio base (€)</label>
        <input v-model.number="basePriceInput" type="number" min="0" step="0.5" placeholder="A consultar si está vacío" class="rounded-xl border border-inaka-beige bg-white px-4 py-2.5 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
      </div>
      <label class="mt-6 flex items-center gap-2">
        <input v-model="form.price_is_from" type="checkbox" class="h-4 w-4 accent-inaka-terra" />
        <span class="text-sm text-inaka-terra">Mostrar "desde"</span>
      </label>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-inaka-terra">Orden</label>
        <input v-model.number="form.sort_order" type="number" class="rounded-xl border border-inaka-beige bg-white px-4 py-2.5 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
      </div>
    </div>

    <!-- Tramos de precio -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-semibold text-inaka-terra">Tramos de precio</label>
      <div v-for="(tier, i) in form.pricing" :key="i" class="flex items-center gap-2">
        <input v-model="tier.label" type="text" placeholder="Etiqueta (p. ej. Pack 2)" class="flex-1 rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
        <input v-model.number="tier.price" type="number" min="0" step="0.5" placeholder="€" class="w-24 rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
        <button type="button" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50" @click="form.pricing.splice(i, 1)">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <button type="button" class="self-start text-xs font-semibold text-inaka-gold hover:underline" @click="form.pricing.push({ label: '', price: 0 })">+ Añadir tramo</button>
    </div>

    <!-- Tamaños -->
    <AdminChipListEditor v-model="form.sizes" label="Tamaños" placeholder="p. ej. 180cm" />
    <!-- Opciones/extras -->
    <AdminChipListEditor v-model="form.options" label="Opciones / extras" placeholder="p. ej. látex" />

    <!-- Ocasiones -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-semibold text-inaka-terra">Ocasiones</label>
      <div class="flex flex-wrap gap-2">
        <label
          v-for="et in EVENT_TYPES"
          :key="et"
          class="cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
          :class="form.event_types.includes(et) ? 'border-inaka-terra bg-inaka-terra text-inaka-cream' : 'border-inaka-beige text-inaka-terra/70 hover:border-inaka-terra/40'"
        >
          <input type="checkbox" :value="et" class="hidden" :checked="form.event_types.includes(et)" @change="toggleEventType(et)" />
          {{ EVENT_TYPE_LABELS[et] }}
        </label>
      </div>
    </div>

    <!-- Alquiler -->
    <div class="rounded-xl border border-inaka-beige p-4">
      <label class="flex items-center gap-2">
        <input v-model="form.is_rental" type="checkbox" class="h-4 w-4 accent-inaka-terra" />
        <span class="text-sm font-semibold text-inaka-terra">Es alquiler de estructura</span>
      </label>
      <div v-if="form.is_rental" class="mt-3 grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-inaka-terra/70">Fianza (€)</label>
          <input v-model.number="form.deposit" type="number" min="0" step="1" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-inaka-terra/70">Stock</label>
          <input v-model.number="form.stock" type="number" min="0" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
        </div>
      </div>
    </div>

    <!-- Imágenes -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-semibold text-inaka-terra">Fotos</label>
      <AdminImageUploader v-model="form.images" bucket="catalog-media" :max="8" />
    </div>

    <label class="flex items-center gap-2">
      <input v-model="form.active" type="checkbox" class="h-4 w-4 accent-inaka-terra" />
      <span class="text-sm text-inaka-terra">Activo (visible en el catálogo público)</span>
    </label>

    <div class="flex items-center gap-3">
      <button type="submit" :disabled="!canSubmit || submitting" class="rounded-xl bg-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-cream shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
        {{ submitting ? 'Guardando…' : 'Guardar' }}
      </button>
      <NuxtLink to="/admin/productos" class="text-sm font-medium text-inaka-terra/60 hover:text-inaka-terra">Cancelar</NuxtLink>
    </div>
  </form>
</template>

<script setup lang="ts">
import { EVENT_TYPES, EVENT_TYPE_LABELS, type EventType } from '~~/shared/eventTypes'

export interface ProductFormData {
  name: string
  category: string
  description: string
  base_price: number | null
  price_is_from: boolean
  pricing: { label: string, price: number }[]
  sizes: string[]
  options: string[]
  event_types: EventType[]
  is_rental: boolean
  deposit: number
  stock: number
  images: string[]
  active: boolean
  sort_order: number
}

const props = defineProps<{
  initial?: Partial<ProductFormData>
  submitting?: boolean
}>()

const emit = defineEmits<{ submit: [ProductFormData] }>()

const categoriasConocidas = ['estructuras', 'globos', 'extras', 'led', 'baby', 'flores', 'detalles', 'mesa-dulce']

const form = reactive<ProductFormData>({
  name: props.initial?.name ?? '',
  category: props.initial?.category ?? '',
  description: props.initial?.description ?? '',
  base_price: props.initial?.base_price ?? null,
  price_is_from: props.initial?.price_is_from ?? true,
  pricing: props.initial?.pricing ? props.initial.pricing.map(t => ({ ...t })) : [],
  sizes: props.initial?.sizes ? [...props.initial.sizes] : [],
  options: props.initial?.options ? [...props.initial.options] : [],
  event_types: props.initial?.event_types ? [...props.initial.event_types] : [],
  is_rental: props.initial?.is_rental ?? false,
  deposit: props.initial?.deposit ?? 0,
  stock: props.initial?.stock ?? 1,
  images: props.initial?.images ? [...props.initial.images] : [],
  active: props.initial?.active ?? true,
  sort_order: props.initial?.sort_order ?? 0,
})

const basePriceInput = computed({
  get: () => form.base_price,
  set: (v: number | null) => { form.base_price = v === null || Number.isNaN(v) ? null : v },
})

function toggleEventType(et: EventType) {
  const idx = form.event_types.indexOf(et)
  if (idx === -1) form.event_types.push(et)
  else form.event_types.splice(idx, 1)
}

const canSubmit = computed(() => form.name.trim().length >= 2 && form.category.trim().length >= 1)

function submit() {
  if (!canSubmit.value) return
  emit('submit', { ...form, pricing: form.pricing.filter(t => t.label.trim()) })
}
</script>
