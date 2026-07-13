<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-center justify-end">
      <button type="button" class="rounded-xl bg-inaka-terra px-4 py-2.5 text-sm font-semibold text-inaka-cream hover:opacity-90" @click="openNew">
        + Nueva reseña
      </button>
    </div>

    <div v-if="pending" class="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude" />
    <AdminEmptyState v-else-if="(data ?? []).length === 0" title="Sin reseñas todavía" message="La sección de reseñas del home aparece sola en cuanto publiques la primera." />

    <div v-else class="flex flex-col gap-3">
      <div v-for="t in data" :key="t.id" class="flex items-start justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-inaka-nude">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <p class="font-semibold text-inaka-terra">{{ t.author }}</p>
            <span v-if="t.rating" class="text-xs text-inaka-gold">{{ '★'.repeat(t.rating) }}{{ '☆'.repeat(5 - t.rating) }}</span>
          </div>
          <p class="mt-1 line-clamp-2 text-sm text-inaka-terra/70">{{ t.quote }}</p>
          <span class="mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="t.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
            {{ t.published ? 'Publicada' : 'Oculta' }}
          </span>
        </div>
        <div class="flex shrink-0 flex-col items-end gap-2">
          <div class="flex gap-1">
            <button type="button" class="flex h-7 w-7 items-center justify-center rounded-full text-inaka-terra/60 hover:bg-inaka-nude/50" @click="move(t, -1)"><svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" /></svg></button>
            <button type="button" class="flex h-7 w-7 items-center justify-center rounded-full text-inaka-terra/60 hover:bg-inaka-nude/50" @click="move(t, 1)"><svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg></button>
          </div>
          <button type="button" class="text-xs font-semibold text-inaka-gold hover:underline" @click="openEdit(t)">Editar</button>
          <button type="button" class="text-xs font-semibold text-red-500 hover:underline" @click="askDelete(t)">Borrar</button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="editing" class="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-inaka-terra/40 backdrop-blur-sm" @click="editing = null" />
        <div class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
          <h2 class="mb-4 text-lg font-bold text-inaka-terra">{{ editing.id ? 'Editar' : 'Nueva' }} reseña</h2>
          <form class="flex flex-col gap-4" @submit.prevent="save">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-inaka-terra">Autor/a</label>
                <input v-model="editing.author" type="text" required class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-inaka-terra">Ocasión</label>
                <select v-model="editing.event_type" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra">
                  <option :value="null">—</option>
                  <option v-for="et in EVENT_TYPES" :key="et" :value="et">{{ EVENT_TYPE_LABELS[et] }}</option>
                </select>
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-inaka-terra">Testimonio</label>
              <textarea v-model="editing.quote" rows="3" required class="resize-none rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-inaka-terra">Puntuación</label>
                <select v-model.number="editing.rating" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra">
                  <option :value="null">—</option>
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} ★</option>
                </select>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-inaka-terra">Origen</label>
                <input v-model="editing.source" type="text" placeholder="Google, Instagram…" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
              </div>
            </div>
            <label class="flex items-center gap-2">
              <input v-model="editing.published" type="checkbox" class="h-4 w-4 accent-inaka-terra" />
              <span class="text-sm text-inaka-terra">Publicada</span>
            </label>
            <div class="mt-2 flex justify-end gap-3">
              <button type="button" class="rounded-lg border border-inaka-beige px-4 py-2 text-sm font-medium text-inaka-terra/70 hover:bg-inaka-nude/50" @click="editing = null">Cancelar</button>
              <button type="submit" :disabled="saving" class="rounded-lg bg-inaka-terra px-4 py-2 text-sm font-semibold text-inaka-cream hover:opacity-90">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <AdminConfirmDialog :open="!!toDelete" title="¿Borrar esta reseña?" danger @cancel="toDelete = null" @confirm="confirmDelete" />
  </div>
</template>

<script setup lang="ts">
import { EVENT_TYPES, EVENT_TYPE_LABELS, type EventType } from '~~/shared/eventTypes'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Reseñas — Panel Inaka Moments' })

interface Testimonial {
  id: string
  author: string
  event_type: EventType | null
  quote: string
  rating: number | null
  source: string | null
  published: boolean
  sort_order: number
}

const { data, pending, refresh } = await useFetch<Testimonial[]>('/api/admin/testimonials')
const toast = useToast()

const editing = ref<Partial<Testimonial> | null>(null)
const saving = ref(false)
const toDelete = ref<Testimonial | null>(null)

function openNew() {
  editing.value = { author: '', event_type: null, quote: '', rating: null, source: '', published: false, sort_order: 0 }
}
function openEdit(t: Testimonial) { editing.value = { ...t } }

async function save() {
  if (!editing.value) return
  saving.value = true
  try {
    if (editing.value.id) await $fetch(`/api/admin/testimonials/${editing.value.id}`, { method: 'PATCH', body: editing.value })
    else await $fetch('/api/admin/testimonials', { method: 'POST', body: editing.value })
    toast.success('Reseña guardada.')
    editing.value = null
    await refresh()
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido guardar.')
  }
  finally {
    saving.value = false
  }
}

function askDelete(t: Testimonial) { toDelete.value = t }
async function confirmDelete() {
  if (!toDelete.value) return
  try {
    await $fetch(`/api/admin/testimonials/${toDelete.value.id}`, { method: 'DELETE' })
    toast.success('Reseña borrada.')
    await refresh()
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido borrar.')
  }
  finally {
    toDelete.value = null
  }
}

async function move(t: Testimonial, dir: -1 | 1) {
  const list = data.value ?? []
  const idx = list.findIndex(x => x.id === t.id)
  const swapIdx = idx + dir
  if (swapIdx < 0 || swapIdx >= list.length) return
  const other = list[swapIdx]!
  try {
    await Promise.all([
      $fetch(`/api/admin/testimonials/${t.id}`, { method: 'PATCH', body: { ...t, sort_order: other.sort_order } }),
      $fetch(`/api/admin/testimonials/${other.id}`, { method: 'PATCH', body: { ...other, sort_order: t.sort_order } }),
    ])
    await refresh()
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido reordenar.')
  }
}
</script>
