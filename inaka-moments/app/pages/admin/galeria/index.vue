<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-center justify-end">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-xl bg-inaka-terra px-4 py-2.5 text-sm font-semibold text-inaka-cream hover:opacity-90"
        @click="creating = true"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4v16m8-8H4"
        /></svg>
        Nuevo álbum
      </button>
    </div>

    <div
      v-if="pending"
      class="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude"
    />
    <AdminEmptyState
      v-else-if="(data ?? []).length === 0"
      title="Sin álbumes todavía"
      message="Crea el primero para empezar a subir fotos."
    />

    <div
      v-else
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <NuxtLink
        v-for="a in data"
        :key="a.id"
        :to="`/admin/galeria/${a.id}`"
        class="flex flex-col gap-3 overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-inaka-nude transition-shadow hover:shadow-sm"
      >
        <div class="relative -m-4 mb-0 aspect-video overflow-hidden bg-inaka-nude/40">
          <NuxtImg
            v-if="a.coverPath"
            :src="storagePublicUrl('gallery', a.coverPath)"
            :alt="a.title"
            width="300"
            height="169"
            format="webp"
            loading="lazy"
            class="h-full w-full object-cover"
          />
          <ProductImagePlaceholder v-else />
        </div>
        <div class="flex items-start justify-between gap-2">
          <p class="font-bold text-inaka-terra">{{ a.title }}</p>
          <span
            class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            :class="a.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
          >
            {{ a.published ? 'Publicado' : 'Borrador' }}
          </span>
        </div>
        <p class="text-xs text-inaka-terra/50">{{ EVENT_TYPE_LABELS[a.event_type] ?? a.event_type }} · {{ a.photoCount }} foto{{ a.photoCount === 1 ? '' : 's' }}</p>
      </NuxtLink>
    </div>

    <!-- Modal crear álbum -->
    <AdminModal
      :open="creating"
      title="Nuevo álbum"
      size="sm"
      @close="creating = false"
    >
      <form
        class="flex flex-col gap-4"
        @submit.prevent="createAlbum"
      >
        <AdminField
          v-slot="{ id }"
          label="Título"
          required
        >
          <input
            :id="id"
            v-model="form.title"
            type="text"
            required
            class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
          >
        </AdminField>
        <AdminField
          v-slot="{ id }"
          label="Ocasión"
        >
          <select
            :id="id"
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
        </AdminField>
        <AdminField
          v-slot="{ id }"
          label="Fecha (opcional)"
        >
          <input
            :id="id"
            v-model="form.event_date"
            type="date"
            class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
          >
        </AdminField>
        <div class="mt-2 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            class="rounded-lg border border-inaka-beige px-4 py-2 text-sm font-medium text-inaka-terra/80 hover:bg-inaka-nude/50"
            @click="creating = false"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="rounded-lg bg-inaka-terra px-4 py-2 text-sm font-semibold text-inaka-cream hover:opacity-90"
          >
            Crear
          </button>
        </div>
      </form>
    </AdminModal>
  </div>
</template>

<script setup lang="ts">
import { EVENT_TYPES, EVENT_TYPE_LABELS, type EventType } from '~~/shared/eventTypes'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Galería — Panel Inaka Moments' })

interface AdminAlbum { id: string, title: string, event_type: EventType, published: boolean, photoCount: number, coverPath: string | null }

const { data, pending, refresh } = await useFetch<AdminAlbum[]>('/api/admin/albums')
const toast = useToast()

const creating = ref(false)
const submitting = ref(false)
const form = reactive({ title: '', event_type: 'cumpleanos' as EventType, event_date: '' })

async function createAlbum() {
  if (!form.title.trim()) return
  submitting.value = true
  try {
    await $fetch('/api/admin/albums', { method: 'POST', body: form })
    toast.success('Álbum creado.')
    creating.value = false
    form.title = ''
    form.event_date = ''
    await refresh()
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido crear el álbum.'))
  }
  finally {
    submitting.value = false
  }
}
</script>
