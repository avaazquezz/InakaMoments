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
        class="flex flex-col gap-2 rounded-2xl bg-white p-4 ring-1 ring-inaka-nude transition-shadow hover:shadow-sm"
      >
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
    <Teleport to="body">
      <div
        v-if="creating"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-inaka-terra/40 backdrop-blur-sm"
          @click="creating = false"
        />
        <div class="relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          <h2 class="mb-4 text-lg font-bold text-inaka-terra">
            Nuevo álbum
          </h2>
          <form
            class="flex flex-col gap-4"
            @submit.prevent="createAlbum"
          >
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-inaka-terra">Título</label>
              <input
                v-model="form.title"
                type="text"
                required
                class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
              >
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-inaka-terra">Ocasión</label>
              <select
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
              <label class="text-sm font-semibold text-inaka-terra">Fecha (opcional)</label>
              <input
                v-model="form.event_date"
                type="date"
                class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
              >
            </div>
            <div class="mt-2 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                class="rounded-lg border border-inaka-beige px-4 py-2 text-sm font-medium text-inaka-terra/70 hover:bg-inaka-nude/50"
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
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { EVENT_TYPES, EVENT_TYPE_LABELS, type EventType } from '~~/shared/eventTypes'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Galería — Panel Inaka Moments' })

interface AdminAlbum { id: string, title: string, event_type: EventType, published: boolean, photoCount: number }

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
