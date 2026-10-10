<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-xs text-inaka-terra/55">
        Pide la reseña con un enlace por WhatsApp, Instagram o email. Al crearlo te propone los clientes con eventos de los últimos 14 días.
      </p>
      <button
        type="button"
        class="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-inaka-terra px-4 py-2.5 text-sm font-semibold text-inaka-cream hover:opacity-90"
        @click="openLink(null)"
      >
        <Icon
          name="lucide:link"
          class="h-4 w-4"
          aria-hidden="true"
        />
        Enlace de reseña
      </button>
    </div>

    <details
      v-if="pendingRequests.length"
      class="group rounded-2xl bg-white ring-1 ring-inaka-nude"
    >
      <summary class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-inaka-terra">
        <span class="flex items-center gap-2">
          <Icon
            name="lucide:hourglass"
            class="h-4 w-4 text-inaka-gold"
            aria-hidden="true"
          />
          Esperando respuesta ({{ pendingRequests.length }})
        </span>
        <Icon
          name="lucide:chevron-down"
          class="h-4 w-4 text-inaka-terra/60 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <ul class="divide-y divide-inaka-nude/70 border-t border-inaka-nude/70">
        <li
          v-for="t in pendingRequests"
          :key="t.id"
          class="flex items-center justify-between gap-3 px-4 py-3"
        >
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-inaka-terra">
              {{ t.author || t.client_email || 'Sin nombre' }}
            </p>
            <p class="text-xs text-inaka-terra/55">
              {{ t.client_email ? 'Email enviado' : 'Enlace creado' }} el {{ formatDate(t.requested_at!) }}{{ t.event_type ? ` · ${EVENT_TYPE_LABELS[t.event_type]}` : '' }}
            </p>
          </div>
          <div class="flex shrink-0 gap-3">
            <button
              type="button"
              class="text-xs font-semibold text-inaka-gold hover:underline"
              @click="openLink(t)"
            >
              Reenviar
            </button>
            <button
              type="button"
              class="text-xs font-semibold text-red-500 hover:underline"
              @click="askDelete(t)"
            >
              Anular
            </button>
          </div>
        </li>
      </ul>
    </details>

    <div
      v-if="pending"
      class="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude"
    />
    <AdminEmptyState
      v-else-if="reviews.length === 0"
      title="Sin reseñas todavía"
      message="Crea un enlace de reseña y envíaselo a tus clientes. La sección de reseñas del home aparece sola en cuanto publiques la primera."
    />

    <div
      v-else
      class="flex flex-col gap-3"
    >
      <div
        v-for="t in reviews"
        :key="t.id"
        class="flex items-start justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-inaka-nude"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <p class="font-semibold text-inaka-terra">
              {{ t.author }}
            </p>
            <span
              v-if="t.rating"
              class="text-xs text-inaka-gold"
            >{{ '★'.repeat(t.rating) }}{{ '☆'.repeat(5 - t.rating) }}</span>
          </div>
          <p class="mt-1 line-clamp-2 text-sm text-inaka-terra/70">
            {{ t.quote }}
          </p>
          <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <label class="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                role="switch"
                class="peer sr-only"
                :checked="t.published"
                :disabled="togglingId === t.id"
                :aria-label="`Publicar en la web la reseña de ${t.author}`"
                @change="togglePublished(t)"
              >
              <span
                class="relative h-6 w-11 shrink-0 rounded-full bg-inaka-nude transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-green-600 peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-inaka-gold peer-focus-visible:ring-offset-2 peer-disabled:opacity-50"
                aria-hidden="true"
              />
              <span
                class="text-xs font-semibold"
                :class="t.published ? 'text-green-700' : 'text-inaka-terra/60'"
              >
                {{ t.published ? 'Publicada en la web' : 'Oculta' }}
              </span>
            </label>
            <span
              v-if="t.responded_at && !t.published"
              class="rounded-full bg-inaka-gold/20 px-2 py-0.5 text-[11px] font-semibold text-inaka-terra"
            >
              Pendiente de aprobar
            </span>
          </div>
        </div>
        <div class="flex shrink-0 flex-col items-end gap-2">
          <div class="flex gap-1">
            <button
              type="button"
              aria-label="Subir"
              class="flex h-7 w-7 items-center justify-center rounded-full text-inaka-terra/80 hover:bg-inaka-nude/50"
              @click="move(t, -1)"
            >
              <svg
                class="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 15l7-7 7 7"
              /></svg>
            </button>
            <button
              type="button"
              aria-label="Bajar"
              class="flex h-7 w-7 items-center justify-center rounded-full text-inaka-terra/80 hover:bg-inaka-nude/50"
              @click="move(t, 1)"
            >
              <svg
                class="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 9l-7 7-7-7"
              /></svg>
            </button>
          </div>
          <button
            type="button"
            class="text-xs font-semibold text-inaka-gold hover:underline"
            @click="openEdit(t)"
          >
            Editar
          </button>
          <button
            type="button"
            class="text-xs font-semibold text-red-500 hover:underline"
            @click="askDelete(t)"
          >
            Borrar
          </button>
        </div>
      </div>
    </div>

    <AdminModal
      :open="!!editing"
      title="Editar reseña"
      size="lg"
      @close="editing = null"
    >
      <form
        v-if="editing"
        class="flex flex-col gap-4"
        @submit.prevent="save"
      >
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminField
            v-slot="{ id }"
            label="Autor/a"
            required
          >
            <input
              :id="id"
              v-model="editing.author"
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
              v-model="editing.event_type"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
            >
              <option :value="null">
                —
              </option>
              <option
                v-for="et in EVENT_TYPES"
                :key="et"
                :value="et"
              >
                {{ EVENT_TYPE_LABELS[et] }}
              </option>
            </select>
          </AdminField>
        </div>
        <AdminField
          v-slot="{ id }"
          label="Testimonio"
          required
        >
          <textarea
            :id="id"
            v-model="editing.quote"
            rows="3"
            required
            class="resize-none rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
          />
        </AdminField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminField
            v-slot="{ id }"
            label="Puntuación"
          >
            <select
              :id="id"
              v-model.number="editing.rating"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
            >
              <option :value="null">
                —
              </option>
              <option
                v-for="n in 5"
                :key="n"
                :value="n"
              >
                {{ n }} ★
              </option>
            </select>
          </AdminField>
          <AdminField
            v-slot="{ id }"
            label="Origen"
          >
            <input
              :id="id"
              v-model="editing.source"
              type="text"
              placeholder="Google, Instagram…"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
            >
          </AdminField>
        </div>
        <label class="flex items-center gap-2">
          <input
            v-model="editing.published"
            type="checkbox"
            class="h-4 w-4 accent-inaka-terra"
          >
          <span class="text-sm text-inaka-terra">Publicada</span>
        </label>
        <div class="mt-2 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            class="rounded-lg border border-inaka-beige px-4 py-2 text-sm font-medium text-inaka-terra/80 hover:bg-inaka-nude/50"
            @click="editing = null"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="rounded-lg bg-inaka-terra px-4 py-2 text-sm font-semibold text-inaka-cream hover:opacity-90"
          >
            Guardar
          </button>
        </div>
      </form>
    </AdminModal>

    <AdminConfirmDialog
      :open="!!toDelete"
      :title="toDelete && isPending(toDelete) ? '¿Anular esta solicitud?' : '¿Borrar esta reseña?'"
      :message="toDelete && isPending(toDelete) ? 'El enlace dejará de funcionar y el cliente ya no podrá dejar su opinión con él.' : undefined"
      :confirm-label="toDelete && isPending(toDelete) ? 'Anular' : 'Borrar'"
      danger
      @cancel="toDelete = null"
      @confirm="confirmDelete"
    />

    <AdminReviewLinkDialog
      :open="linkOpen"
      :existing="linkExisting"
      @close="linkOpen = false"
      @created="refresh"
    />
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
  token: string | null
  client_email: string | null
  requested_at: string | null
  responded_at: string | null
}

const { data, pending, refresh } = await useFetch<Testimonial[]>('/api/admin/testimonials')
const toast = useToast()

// Solicitud enviada (email o enlace) que el cliente aún no ha contestado.
function isPending(t: Testimonial) { return !!t.requested_at && !t.responded_at }
const reviews = computed(() => (data.value ?? []).filter(t => !isPending(t)))
const pendingRequests = computed(() => (data.value ?? [])
  .filter(isPending)
  .sort((a, b) => b.requested_at!.localeCompare(a.requested_at!)))

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(iso))
}

const linkOpen = ref(false)
const linkExisting = ref<{ token: string, author: string | null } | null>(null)
function openLink(t: Testimonial | null) {
  linkExisting.value = t?.token ? { token: t.token, author: t.author } : null
  linkOpen.value = true
}

const editing = ref<Partial<Testimonial> | null>(null)
const saving = ref(false)
const toDelete = ref<Testimonial | null>(null)

function openEdit(t: Testimonial) { editing.value = { ...t } }

async function save() {
  if (!editing.value) return
  saving.value = true
  try {
    await $fetch(`/api/admin/testimonials/${editing.value.id}`, { method: 'PATCH', body: editing.value })
    toast.success('Reseña guardada.')
    editing.value = null
    await refresh()
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido guardar.'))
  }
  finally {
    saving.value = false
  }
}

// Optimista: el interruptor cambia al instante y se revierte si falla el PATCH.
// `data` es shallowRef (Nuxt 4: deep=false), de ahí el triggerRef tras mutar.
const togglingId = ref<string | null>(null)
async function togglePublished(t: Testimonial) {
  togglingId.value = t.id
  t.published = !t.published
  triggerRef(data)
  try {
    await $fetch(`/api/admin/testimonials/${t.id}`, { method: 'PATCH', body: t })
    toast.success(t.published ? 'Reseña publicada en la web.' : 'Reseña ocultada de la web.')
  }
  catch (err) {
    t.published = !t.published
    triggerRef(data)
    toast.error(apiErrorMessage(err, 'No se ha podido cambiar la publicación.'))
  }
  finally {
    togglingId.value = null
  }
}

function askDelete(t: Testimonial) { toDelete.value = t }
async function confirmDelete() {
  if (!toDelete.value) return
  try {
    await $fetch(`/api/admin/testimonials/${toDelete.value.id}`, { method: 'DELETE' })
    toast.success(isPending(toDelete.value) ? 'Solicitud anulada.' : 'Reseña borrada.')
    await refresh()
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido borrar.'))
  }
  finally {
    toDelete.value = null
  }
}

async function move(t: Testimonial, dir: -1 | 1) {
  const list = reviews.value
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
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido reordenar.'))
  }
}
</script>
