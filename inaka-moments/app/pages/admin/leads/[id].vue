<template>
  <div class="flex flex-col gap-6">
    <div v-if="pending" class="h-96 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude" />

    <template v-else-if="lead">
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <!-- Datos del lead -->
        <form class="flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-inaka-nude lg:col-span-2" @submit.prevent="save">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-inaka-terra/70">Nombre</label>
              <input v-model="form.nombre" type="text" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-inaka-terra/70">Email</label>
              <input v-model="form.email" type="email" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-inaka-terra/70">Teléfono</label>
              <input v-model="form.telefono" type="text" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-inaka-terra/70">Estado</label>
              <select v-model="form.status" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra">
                <option v-for="s in ['nuevo', 'contactado', 'presupuestado', 'ganado', 'perdido']" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-inaka-terra/70">Tipo de evento</label>
              <input v-model="form.tipo" type="text" list="tipos-evento" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
              <datalist id="tipos-evento">
                <option v-for="et in EVENT_TYPES" :key="et" :value="EVENT_TYPE_LABELS[et]" />
              </datalist>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-inaka-terra/70">Fecha aproximada</label>
              <input v-model="form.fecha" type="date" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
            </div>
            <div class="flex flex-col gap-1.5 sm:col-span-2">
              <label class="text-xs font-semibold text-inaka-terra/70">Invitados</label>
              <input v-model="form.invitados" type="text" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-inaka-terra/70">Ideas / peticiones del cliente</label>
            <textarea v-model="form.ideas_extra" rows="2" class="resize-none rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-inaka-terra/70">Notas internas</label>
            <textarea v-model="form.notes" rows="2" class="resize-none rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
          </div>
          <ChipListEditor v-model="form.tags" label="Etiquetas" placeholder="p. ej. urgente" />

          <div class="flex items-center gap-4">
            <button type="submit" :disabled="saving" class="rounded-xl bg-inaka-terra px-6 py-2.5 text-sm font-semibold text-inaka-cream hover:opacity-90">
              {{ saving ? 'Guardando…' : 'Guardar' }}
            </button>
            <button type="button" class="text-sm font-semibold text-red-500 hover:underline" @click="confirmingDelete = true">Borrar lead</button>
          </div>
        </form>

        <!-- Metadatos + presupuestos -->
        <div class="flex flex-col gap-4">
          <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
            <h3 class="mb-2 text-sm font-bold text-inaka-terra">Origen</h3>
            <p class="text-xs text-inaka-terra/60">Fuente: {{ lead.source ?? '—' }}</p>
            <p class="text-xs text-inaka-terra/60">Creado: {{ formatFecha(lead.created_at) }}</p>
          </div>

          <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
            <h3 class="mb-3 text-sm font-bold text-inaka-terra">Presupuestos</h3>
            <AdminEmptyState v-if="lead.quotes.length === 0" title="Ninguno todavía" />
            <ul v-else class="flex flex-col divide-y divide-inaka-nude/70">
              <li v-for="q in lead.quotes" :key="q.id" class="py-2">
                <NuxtLink :to="`/admin/presupuestos/${q.id}`" class="flex items-center justify-between gap-2 text-sm">
                  <span class="text-inaka-terra">{{ formatEUR(q.total) }}</span>
                  <AdminStatusBadge :status="q.status" kind="quote" />
                </NuxtLink>
              </li>
            </ul>
            <NuxtLink :to="`/admin/presupuestos?lead=${lead.id}`" class="mt-3 inline-block text-xs font-semibold text-inaka-gold hover:underline">Ver en Presupuestos</NuxtLink>
          </div>
        </div>
      </div>

      <!-- Actividades -->
      <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
        <h3 class="mb-3 text-sm font-bold text-inaka-terra">Seguimiento</h3>
        <form class="mb-4 flex gap-2" @submit.prevent="addActivity">
          <input v-model="newNote" type="text" placeholder="Añadir una nota de seguimiento…" class="flex-1 rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
          <button type="submit" class="rounded-lg bg-inaka-terra px-4 py-2 text-xs font-semibold text-inaka-cream hover:opacity-90">Añadir</button>
        </form>
        <AdminEmptyState v-if="lead.activities.length === 0" title="Sin actividad todavía" />
        <ul v-else class="flex flex-col divide-y divide-inaka-nude/70">
          <li v-for="a in lead.activities" :key="a.id" class="py-2.5 text-sm">
            <p class="text-inaka-terra">{{ a.note }}</p>
            <p class="text-xs text-inaka-terra/40">{{ formatFecha(a.created_at) }}</p>
          </li>
        </ul>
      </div>
    </template>

    <AdminConfirmDialog :open="confirmingDelete" title="¿Borrar este lead?" message="Se borrarán también sus actividades." danger @cancel="confirmingDelete = false" @confirm="deleteLead" />
  </div>
</template>

<script setup lang="ts">
import { EVENT_TYPES, EVENT_TYPE_LABELS } from '~~/shared/eventTypes'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Lead — Panel Inaka Moments' })

interface LeadActivity { id: string, note: string | null, created_at: string }
interface LinkedQuote { id: string, status: string, total: number, event_date: string | null, created_at: string }
interface LeadDetail {
  id: string, nombre: string, email: string, telefono: string | null, tipo: string | null,
  fecha: string | null, invitados: string | null, ideas_extra: string | null, notes: string | null,
  status: string, tags: string[], source: string | null, created_at: string,
  activities: LeadActivity[], quotes: LinkedQuote[]
}

const route = useRoute()
const toast = useToast()

const { data: lead, pending, refresh } = await useFetch<LeadDetail>(`/api/admin/leads/${route.params.id}`)

const form = reactive({
  nombre: '', email: '', telefono: '', tipo: '', fecha: '', invitados: '',
  ideas_extra: '', notes: '', status: 'nuevo', tags: [] as string[],
})

watchEffect(() => {
  if (lead.value) {
    form.nombre = lead.value.nombre
    form.email = lead.value.email
    form.telefono = lead.value.telefono ?? ''
    form.tipo = lead.value.tipo ?? ''
    form.fecha = lead.value.fecha ?? ''
    form.invitados = lead.value.invitados ?? ''
    form.ideas_extra = lead.value.ideas_extra ?? ''
    form.notes = lead.value.notes ?? ''
    form.status = lead.value.status
    form.tags = [...lead.value.tags]
  }
})

const saving = ref(false)
async function save() {
  saving.value = true
  try {
    await $fetch(`/api/admin/leads/${route.params.id}`, { method: 'PATCH', body: form })
    toast.success('Lead guardado.')
    await refresh()
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido guardar.')
  }
  finally {
    saving.value = false
  }
}

const confirmingDelete = ref(false)
async function deleteLead() {
  try {
    await $fetch(`/api/admin/leads/${route.params.id}`, { method: 'DELETE' })
    toast.success('Lead borrado.')
    await navigateTo('/admin/leads')
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido borrar.')
  }
  finally {
    confirmingDelete.value = false
  }
}

const newNote = ref('')
async function addActivity() {
  if (!newNote.value.trim()) return
  try {
    await $fetch(`/api/admin/leads/${route.params.id}/activities`, { method: 'POST', body: { note: newNote.value.trim() } })
    newNote.value = ''
    await refresh()
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido añadir la nota.')
  }
}

function formatEUR(n: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)
}
function formatFecha(iso: string): string {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
}
</script>
