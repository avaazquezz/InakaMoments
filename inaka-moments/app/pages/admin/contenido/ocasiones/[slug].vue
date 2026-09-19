<template>
  <div class="max-w-2xl">
    <div
      v-if="pending"
      class="h-96 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude"
    />
    <form
      v-else-if="occasion"
      class="flex flex-col gap-5 rounded-2xl bg-white p-6 ring-1 ring-inaka-nude"
      @submit.prevent="save"
    >
      <div class="flex flex-col gap-1.5">
        <label
          for="ocasiones-slug-1"
          class="text-sm font-semibold text-inaka-terra"
        >Título</label>
        <input
          id="ocasiones-slug-1"
          v-model="form.title"
          type="text"
          class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
        >
      </div>

      <div class="flex flex-col gap-1.5">
        <label
          for="ocasiones-slug-2"
          class="text-sm font-semibold text-inaka-terra"
        >Ocasión (event_type)</label>
        <select
          id="ocasiones-slug-2"
          v-model="form.event_type"
          class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
        >
          <option
            v-for="et in EVENT_TYPES"
            :key="et"
            :value="et"
          >
            {{ EVENT_TYPE_LABELS[et] }}
          </option>
        </select>
      </div>

      <div class="flex flex-col gap-1.5">
        <label
          for="ocasiones-slug-3"
          class="text-sm font-semibold text-inaka-terra"
        >Introducción</label>
        <textarea
          id="ocasiones-slug-3"
          v-model="form.intro"
          rows="4"
          class="resize-none rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label
          for="seo-title"
          class="flex items-baseline justify-between text-sm font-semibold text-inaka-terra"
        >
          Título SEO
          <span class="text-xs font-normal text-inaka-terra/80">{{ (form.seo_title ?? '').length }}/60</span>
        </label>
        <input
          id="seo-title"
          v-model="form.seo_title"
          type="text"
          placeholder="Título que aparece en Google (recomendado ≤ 60)"
          class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
        >
      </div>

      <div class="flex flex-col gap-1.5">
        <label
          for="seo-description"
          class="flex items-baseline justify-between text-sm font-semibold text-inaka-terra"
        >
          Meta descripción
          <span class="text-xs font-normal text-inaka-terra/80">{{ (form.seo_description ?? '').length }}/155</span>
        </label>
        <textarea
          id="seo-description"
          v-model="form.seo_description"
          rows="3"
          placeholder="Resumen que aparece bajo el título en Google (recomendado ≤ 155)"
          class="resize-none rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm font-semibold text-inaka-terra">
          Productos destacados
        </p>
        <div class="max-h-56 overflow-y-auto rounded-lg border border-inaka-beige p-2">
          <label
            v-for="p in products"
            :key="p.id"
            class="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-inaka-terra hover:bg-inaka-cream"
          >
            <input
              type="checkbox"
              :value="p.id"
              class="h-4 w-4 accent-inaka-terra"
              :checked="form.featured_product_ids.includes(p.id)"
              @change="toggleProduct(p.id)"
            >
            {{ p.name }}
          </label>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label class="flex items-center gap-2">
          <input
            v-model="form.published"
            type="checkbox"
            class="h-4 w-4 accent-inaka-terra"
          >
          <span class="text-sm text-inaka-terra">Publicada</span>
        </label>
        <div class="flex flex-col gap-1.5">
          <label
            for="ocasiones-slug-4"
            class="text-xs font-semibold text-inaka-terra/70"
          >Orden</label>
          <input
            id="ocasiones-slug-4"
            v-model.number="form.sort_order"
            type="number"
            class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
          >
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="submit"
          :disabled="saving"
          class="rounded-xl bg-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-cream hover:opacity-90"
        >
          {{ saving ? 'Guardando…' : 'Guardar' }}
        </button>
        <NuxtLink
          to="/admin/contenido"
          class="text-sm font-medium text-inaka-terra/60 hover:text-inaka-terra"
        >Volver</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { EVENT_TYPES, EVENT_TYPE_LABELS, type EventType } from '~~/shared/eventTypes'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Editar ocasión — Panel Inaka Moments' })

interface Occasion {
  slug: string
  event_type: EventType
  title: string
  intro: string | null
  seo_title: string | null
  seo_description: string | null
  featured_product_ids: string[]
  published: boolean
  sort_order: number
}
interface AdminProduct { id: string, name: string }

const route = useRoute()
const toast = useToast()

const { data: occasion, pending } = await useFetch<Occasion>(`/api/admin/occasions/${route.params.slug}`)
const { data: products } = await useFetch<AdminProduct[]>('/api/admin/products')

const form = reactive({
  title: '', event_type: 'cumpleanos' as EventType, intro: '', seo_title: '', seo_description: '',
  featured_product_ids: [] as string[], published: false, sort_order: 0,
})

watchEffect(() => {
  if (occasion.value) {
    form.title = occasion.value.title
    form.event_type = occasion.value.event_type
    form.intro = occasion.value.intro ?? ''
    form.seo_title = occasion.value.seo_title ?? ''
    form.seo_description = occasion.value.seo_description ?? ''
    form.featured_product_ids = [...occasion.value.featured_product_ids]
    form.published = occasion.value.published
    form.sort_order = occasion.value.sort_order
  }
})

function toggleProduct(id: string) {
  const idx = form.featured_product_ids.indexOf(id)
  if (idx === -1) form.featured_product_ids.push(id)
  else form.featured_product_ids.splice(idx, 1)
}

const saving = ref(false)
async function save() {
  saving.value = true
  try {
    await $fetch(`/api/admin/occasions/${route.params.slug}`, { method: 'PATCH', body: form })
    toast.success('Ocasión guardada.')
    await navigateTo('/admin/contenido')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido guardar.'))
  }
  finally {
    saving.value = false
  }
}
</script>
