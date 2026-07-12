<template>
  <form class="flex flex-col gap-6" @submit.prevent="submit">
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-semibold text-inaka-terra">Nombre <span class="text-inaka-mauve">*</span></label>
      <input v-model="form.name" type="text" required class="rounded-xl border border-inaka-beige bg-white px-4 py-2.5 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-semibold text-inaka-terra">Descripción</label>
      <textarea v-model="form.description" rows="3" class="resize-none rounded-xl border border-inaka-beige bg-white px-4 py-2.5 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-inaka-terra">Precio (€)</label>
        <input v-model.number="priceInput" type="number" min="0" step="0.5" placeholder="A consultar si está vacío" class="rounded-xl border border-inaka-beige bg-white px-4 py-2.5 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-inaka-terra">Orden</label>
        <input v-model.number="form.sort_order" type="number" class="rounded-xl border border-inaka-beige bg-white px-4 py-2.5 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
      </div>
    </div>

    <AdminChipListEditor v-model="form.includes" label="Incluye" placeholder="p. ej. Arco orgánico 200cm" />

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
      <NuxtLink to="/admin/packs" class="text-sm font-medium text-inaka-terra/60 hover:text-inaka-terra">Cancelar</NuxtLink>
    </div>
  </form>
</template>

<script setup lang="ts">
import { EVENT_TYPES, EVENT_TYPE_LABELS, type EventType } from '~~/shared/eventTypes'

export interface PackFormData {
  name: string
  description: string
  price: number | null
  includes: string[]
  event_types: EventType[]
  images: string[]
  active: boolean
  sort_order: number
}

const props = defineProps<{
  initial?: Partial<PackFormData>
  submitting?: boolean
}>()

const emit = defineEmits<{ submit: [PackFormData] }>()

const form = reactive<PackFormData>({
  name: props.initial?.name ?? '',
  description: props.initial?.description ?? '',
  price: props.initial?.price ?? null,
  includes: props.initial?.includes ? [...props.initial.includes] : [],
  event_types: props.initial?.event_types ? [...props.initial.event_types] : [],
  images: props.initial?.images ? [...props.initial.images] : [],
  active: props.initial?.active ?? true,
  sort_order: props.initial?.sort_order ?? 0,
})

const priceInput = computed({
  get: () => form.price,
  set: (v: number | null) => { form.price = v === null || Number.isNaN(v) ? null : v },
})

function toggleEventType(et: EventType) {
  const idx = form.event_types.indexOf(et)
  if (idx === -1) form.event_types.push(et)
  else form.event_types.splice(idx, 1)
}

const canSubmit = computed(() => form.name.trim().length >= 2)

function submit() {
  if (!canSubmit.value) return
  emit('submit', { ...form })
}
</script>
