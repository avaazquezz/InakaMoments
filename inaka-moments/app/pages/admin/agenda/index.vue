<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold"
          :class="view === 'calendario' ? 'bg-inaka-terra text-inaka-cream' : 'bg-inaka-nude/60 text-inaka-terra/70'"
          @click="view = 'calendario'"
        >
          Calendario
        </button>
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold"
          :class="view === 'lista' ? 'bg-inaka-terra text-inaka-cream' : 'bg-inaka-nude/60 text-inaka-terra/70'"
          @click="view = 'lista'"
        >
          Lista
        </button>
      </div>
      <button
        type="button"
        class="shrink-0 rounded-xl bg-inaka-terra px-4 py-2.5 text-sm font-semibold text-inaka-cream hover:opacity-90"
        @click="openNew()"
      >
        + Nuevo evento
      </button>
    </div>

    <div
      v-if="pending"
      class="h-96 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude"
    />

    <AdminCalendar
      v-else-if="view === 'calendario'"
      :year="year"
      :month="month"
      :events="calendarEvents"
      @update:month="onMonthChange"
      @day-click="onDayClick"
      @event-click="onEventClick"
    />

    <div
      v-else
      class="overflow-hidden rounded-2xl bg-white ring-1 ring-inaka-nude"
    >
      <AdminEmptyState
        v-if="(data ?? []).length === 0"
        title="Sin eventos"
      />
      <div
        v-else
        class="overflow-x-auto"
      >
        <table class="w-full text-left text-sm">
          <thead class="bg-inaka-cream text-xs uppercase tracking-wide text-inaka-terra/50">
            <tr>
              <th class="px-4 py-3">
                Título
              </th><th class="px-4 py-3">
                Fecha
              </th><th class="px-4 py-3">
                Estado
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-inaka-nude/70">
            <tr
              v-for="ev in sortedEvents"
              :key="ev.id"
              class="cursor-pointer hover:bg-inaka-cream/50"
              @click="openEdit(ev)"
            >
              <td class="px-4 py-3 font-medium text-inaka-terra">
                {{ ev.title }}
              </td>
              <td class="px-4 py-3 text-inaka-terra/60">
                {{ ev.event_date }}
              </td>
              <td class="px-4 py-3">
                <AdminStatusBadge
                  :status="ev.status"
                  kind="event"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal crear/editar -->
    <AdminModal
      :open="!!editing"
      :title="editing?.id ? 'Editar evento' : 'Nuevo evento'"
      @close="editing = null"
    >
      <form
        v-if="editing"
        class="flex flex-col gap-3"
        @submit.prevent="save"
      >
        <AdminField
          v-slot="{ id }"
          label="Título"
          required
        >
          <input
            :id="id"
            v-model="editing.title"
            type="text"
            required
            class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
          >
        </AdminField>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AdminField
            v-slot="{ id }"
            label="Fecha"
            required
          >
            <input
              :id="id"
              v-model="editing.event_date"
              type="date"
              required
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
            >
          </AdminField>
          <AdminField
            v-slot="{ id }"
            label="Estado"
          >
            <select
              :id="id"
              v-model="editing.status"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
            >
              <option
                v-for="s in EVENT_STATUSES"
                :key="s"
                :value="s"
              >
                {{ EVENT_STATUS_LABELS[s] }}
              </option>
            </select>
          </AdminField>
        </div>
        <AdminField
          v-slot="{ id }"
          label="Ubicación (opcional)"
        >
          <input
            :id="id"
            v-model="editing.location"
            type="text"
            class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
          >
        </AdminField>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AdminField
            v-slot="{ id }"
            label="Cliente"
          >
            <input
              :id="id"
              v-model="editing.client_name"
              type="text"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
            >
          </AdminField>
          <AdminField
            v-slot="{ id }"
            label="Contacto"
          >
            <input
              :id="id"
              v-model="editing.client_contact"
              type="text"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
            >
          </AdminField>
        </div>
        <AdminField
          v-slot="{ id }"
          label="Notas"
        >
          <textarea
            :id="id"
            v-model="editing.notes"
            rows="2"
            class="resize-none rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
          />
        </AdminField>
        <p
          v-if="saveError"
          role="alert"
          class="text-xs text-red-600"
        >
          {{ saveError }}
        </p>
        <div class="mt-2 flex justify-between">
          <button
            v-if="editing.id"
            type="button"
            class="text-xs font-semibold text-red-600 hover:underline"
            @click="confirmingDeleteEvent = true"
          >
            Borrar
          </button>
          <span v-else />
          <div class="flex flex-wrap gap-3">
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
        </div>
      </form>
    </AdminModal>

    <AdminConfirmDialog
      :open="confirmingDeleteEvent"
      title="¿Borrar este evento?"
      :message="editing?.title ? `«${editing.title}» se eliminará permanentemente.` : 'Esta acción no se puede deshacer.'"
      danger
      @cancel="confirmingDeleteEvent = false"
      @confirm="removeEvent"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Agenda — Panel Inaka Moments' })

interface AdminEvent {
  id: string, title: string, event_date: string, status: string, location: string | null
  client_name: string | null, client_contact: string | null, notes: string | null
}

const { data, pending, refresh } = await useFetch<AdminEvent[]>('/api/admin/events')
const toast = useToast()

const view = ref<'calendario' | 'lista'>('calendario')
const now = new Date()
const year = ref(now.getFullYear())
const month = ref(now.getMonth())

function onMonthChange(v: { year: number, month: number }) {
  year.value = v.year
  month.value = v.month
}

const calendarEvents = computed(() => (data.value ?? []).map(ev => ({ id: ev.id, date: ev.event_date, title: ev.title, status: ev.status })))
const sortedEvents = computed(() => [...(data.value ?? [])].sort((a, b) => a.event_date.localeCompare(b.event_date)))

const editing = ref<Partial<AdminEvent> | null>(null)
const saving = ref(false)
const saveError = ref('')
const confirmingDeleteEvent = ref(false)

function openNew(date?: string) {
  editing.value = { title: '', event_date: date ?? '', status: 'tentativo', location: '', client_name: '', client_contact: '', notes: '' }
  saveError.value = ''
}
function openEdit(ev: AdminEvent) {
  editing.value = { ...ev }
  saveError.value = ''
}
function onDayClick(iso: string) { openNew(iso) }
function onEventClick(id: string) {
  const ev = (data.value ?? []).find(e => e.id === id)
  if (ev) openEdit(ev)
}

async function save() {
  if (!editing.value) return
  saving.value = true
  saveError.value = ''
  try {
    if (editing.value.id) await $fetch(`/api/admin/events/${editing.value.id}`, { method: 'PATCH', body: editing.value })
    else await $fetch('/api/admin/events', { method: 'POST', body: editing.value })
    toast.success('Evento guardado.')
    editing.value = null
    await refresh()
  }
  catch (err) {
    saveError.value = apiErrorMessage(err, 'No se ha podido guardar el evento.')
  }
  finally {
    saving.value = false
  }
}

async function removeEvent() {
  if (!editing.value?.id) return
  try {
    await $fetch(`/api/admin/events/${editing.value.id}`, { method: 'DELETE' })
    toast.success('Evento borrado.')
    editing.value = null
    await refresh()
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido borrar.'))
  }
  finally {
    confirmingDeleteEvent.value = false
  }
}
</script>
