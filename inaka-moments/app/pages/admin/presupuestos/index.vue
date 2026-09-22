<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center gap-2">
      <select
        v-model="statusFilter"
        class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
      >
        <option value="">
          Todos los estados
        </option>
        <option
          v-for="s in ['borrador', 'enviado', 'aceptado', 'rechazado', 'caducado']"
          :key="s"
          :value="s"
        >
          {{ s }}
        </option>
      </select>
      <button
        type="button"
        class="ml-auto rounded-xl bg-inaka-terra px-4 py-2.5 text-sm font-semibold text-inaka-cream hover:opacity-90"
        @click="openCreate()"
      >
        + Nuevo presupuesto
      </button>
    </div>

    <div
      v-if="pending"
      class="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude"
    />
    <AdminEmptyState
      v-else-if="filtered.length === 0"
      title="No hay presupuestos"
      message="Los presupuestos llegan solos desde el configurador de la web. Si un cliente te escribe por teléfono o Instagram, créale uno con «Nuevo presupuesto»."
    />

    <!-- Tarjetas (móvil/tablet) -->
    <div
      v-else
      class="flex flex-col gap-3 md:hidden"
    >
      <NuxtLink
        v-for="q in filtered"
        :key="q.id"
        :to="`/admin/presupuestos/${q.id}`"
        class="flex flex-col gap-2 rounded-2xl bg-white p-4 ring-1 ring-inaka-nude"
      >
        <div class="flex items-start justify-between gap-2">
          <p class="font-semibold text-inaka-terra">{{ q.client_name ?? '—' }}</p>
          <span class="shrink-0 font-bold text-inaka-terra">{{ formatEUR(q.total) }}</span>
        </div>
        <p class="text-xs text-inaka-terra/55">
          {{ q.event_type ? EVENT_TYPE_LABELS[q.event_type] : 'Sin ocasión' }} · {{ q.event_date ?? 'Sin fecha' }}
        </p>
        <div class="flex flex-wrap items-center gap-2">
          <AdminStatusBadge
            :status="q.status"
            kind="quote"
          />
          <AdminStatusBadge
            v-if="q.status === 'aceptado'"
            :status="q.deposit_status"
            kind="payment"
          />
        </div>
      </NuxtLink>
    </div>

    <!-- Tabla (desktop) -->
    <div
      v-if="!pending && filtered.length"
      class="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-inaka-nude md:block"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-inaka-cream text-xs uppercase tracking-wide text-inaka-terra/50">
            <tr>
              <th class="px-4 py-3">
                Cliente
              </th>
              <th class="px-4 py-3">
                Ocasión
              </th>
              <th class="px-4 py-3">
                Fecha evento
              </th>
              <th class="px-4 py-3">
                Total
              </th>
              <th class="px-4 py-3">
                Estado
              </th>
              <th class="px-4 py-3">
                Reserva
              </th>
              <th class="px-4 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-inaka-nude/70">
            <tr
              v-for="q in filtered"
              :key="q.id"
              class="hover:bg-inaka-cream/50"
            >
              <td class="px-4 py-3 font-medium text-inaka-terra">
                {{ q.client_name ?? '—' }}
              </td>
              <td class="px-4 py-3 text-inaka-terra/60">
                {{ q.event_type ? EVENT_TYPE_LABELS[q.event_type] : '—' }}
              </td>
              <td class="px-4 py-3 text-inaka-terra/60">
                {{ q.event_date ?? '—' }}
              </td>
              <td class="px-4 py-3 text-inaka-terra/60">
                {{ formatEUR(q.total) }}
              </td>
              <td class="px-4 py-3">
                <AdminStatusBadge
                  :status="q.status"
                  kind="quote"
                />
              </td>
              <td class="px-4 py-3">
                <AdminStatusBadge
                  v-if="q.status === 'aceptado'"
                  :status="q.deposit_status"
                  kind="payment"
                />
                <span
                  v-else
                  class="text-inaka-terra/80"
                >—</span>
              </td>
              <td class="px-4 py-3 text-right">
                <NuxtLink
                  :to="`/admin/presupuestos/${q.id}`"
                  class="text-xs font-semibold text-inaka-gold hover:underline"
                >Ver</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Nuevo presupuesto manual (llamada, Instagram, en persona) -->
    <AdminModal
      :open="creating"
      title="Nuevo presupuesto"
      size="lg"
      @close="creating = false"
    >
      <form
        class="flex flex-col gap-4"
        @submit.prevent="createQuote"
      >
        <AdminField
          v-if="(leads ?? []).length"
          v-slot="{ id }"
          label="Cliente existente (opcional)"
        >
          <select
            :id="id"
            v-model="form.lead_id"
            class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus-visible:border-inaka-terra focus-visible:ring-2 focus-visible:ring-inaka-gold"
            @change="onLeadChange"
          >
            <option value="">
              Cliente nuevo (sin ficha)
            </option>
            <option
              v-for="l in leads"
              :key="l.id"
              :value="l.id"
            >
              {{ l.nombre }} — {{ l.email }}
            </option>
          </select>
        </AdminField>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminField
            v-slot="{ id }"
            label="Nombre"
            required
          >
            <input
              :id="id"
              v-model="form.client_name"
              type="text"
              required
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus-visible:border-inaka-terra focus-visible:ring-2 focus-visible:ring-inaka-gold"
            >
          </AdminField>
          <AdminField
            v-slot="{ id }"
            label="Email (necesario para enviarlo por email)"
          >
            <input
              :id="id"
              v-model="form.client_email"
              type="email"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus-visible:border-inaka-terra focus-visible:ring-2 focus-visible:ring-inaka-gold"
            >
          </AdminField>
          <AdminField
            v-slot="{ id }"
            label="Teléfono"
          >
            <input
              :id="id"
              v-model="form.client_phone"
              type="tel"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus-visible:border-inaka-terra focus-visible:ring-2 focus-visible:ring-inaka-gold"
            >
          </AdminField>
          <AdminField
            v-slot="{ id }"
            label="Ocasión"
          >
            <select
              :id="id"
              v-model="form.event_type"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus-visible:border-inaka-terra focus-visible:ring-2 focus-visible:ring-inaka-gold"
            >
              <option value="">
                Sin especificar
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
          <AdminField
            v-slot="{ id }"
            label="Fecha del evento"
          >
            <input
              :id="id"
              v-model="form.event_date"
              type="date"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus-visible:border-inaka-terra focus-visible:ring-2 focus-visible:ring-inaka-gold"
            >
          </AdminField>
          <AdminField
            v-slot="{ id }"
            label="Dirección / lugar"
          >
            <input
              :id="id"
              v-model="form.location"
              type="text"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus-visible:border-inaka-terra focus-visible:ring-2 focus-visible:ring-inaka-gold"
            >
          </AdminField>
        </div>

        <!-- Líneas -->
        <div class="flex flex-col gap-2">
          <p class="text-xs font-semibold text-inaka-terra/80">
            Productos y packs <span class="text-inaka-mauve">*</span>
          </p>
          <ul
            v-if="lines.length"
            class="flex flex-col gap-2"
          >
            <li
              v-for="(line, i) in lines"
              :key="i"
              class="flex flex-wrap items-center gap-2 rounded-lg border border-inaka-beige p-2"
            >
              <span class="min-w-0 flex-1 truncate text-sm text-inaka-terra">{{ lineName(line) }}</span>
              <select
                v-if="tiersFor(line).length"
                v-model="line.tier"
                :aria-label="`Tramo de ${lineName(line)}`"
                class="rounded border border-inaka-beige bg-white px-2 py-1 text-xs text-inaka-terra outline-none focus-visible:ring-2 focus-visible:ring-inaka-gold"
              >
                <option
                  v-for="t in tiersFor(line)"
                  :key="t.label"
                  :value="t.label"
                >
                  {{ t.label }} — {{ formatEUR(t.price) }}
                </option>
              </select>
              <input
                v-model.number="line.qty"
                type="number"
                min="1"
                max="99"
                :aria-label="`Cantidad de ${lineName(line)}`"
                class="w-16 rounded border border-inaka-beige px-2 py-1 text-sm text-inaka-terra outline-none focus-visible:ring-2 focus-visible:ring-inaka-gold"
              >
              <button
                type="button"
                class="rounded p-1 text-red-600 outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                :aria-label="`Quitar ${lineName(line)}`"
                @click="lines.splice(i, 1)"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                /></svg>
              </button>
            </li>
          </ul>
          <div class="flex flex-wrap items-center gap-2 rounded-lg bg-inaka-cream p-3">
            <select
              v-model="picker"
              aria-label="Añadir producto o pack"
              class="min-w-0 flex-1 rounded-lg border border-inaka-beige bg-white px-2 py-1.5 text-sm text-inaka-terra outline-none focus-visible:ring-2 focus-visible:ring-inaka-gold"
            >
              <option value="">
                Añadir producto o pack…
              </option>
              <optgroup label="Packs">
                <option
                  v-for="p in packs ?? []"
                  :key="p.id"
                  :value="`pack:${p.id}`"
                >
                  {{ p.name }}
                </option>
              </optgroup>
              <optgroup label="Productos">
                <option
                  v-for="p in products ?? []"
                  :key="p.id"
                  :value="`product:${p.id}`"
                >
                  {{ p.name }}
                </option>
              </optgroup>
            </select>
            <input
              v-model.number="pickerQty"
              type="number"
              min="1"
              max="99"
              aria-label="Cantidad"
              class="w-16 rounded-lg border border-inaka-beige bg-white px-2 py-1.5 text-sm text-inaka-terra outline-none focus-visible:ring-2 focus-visible:ring-inaka-gold"
            >
            <button
              type="button"
              class="rounded-lg bg-inaka-terra px-3 py-1.5 text-xs font-semibold text-inaka-cream outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-inaka-gold"
              @click="addLine"
            >
              Añadir
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-x-6 gap-y-2">
          <label class="flex items-center gap-2 text-sm text-inaka-terra">
            <input
              v-model="form.desmontaje"
              type="checkbox"
              class="h-4 w-4 accent-inaka-terra"
            > Incluir desmontaje
          </label>
          <label class="flex items-center gap-2 text-sm text-inaka-terra">
            <input
              v-model="form.far"
              type="checkbox"
              class="h-4 w-4 accent-inaka-terra"
            > Evento fuera de la zona incluida (plus de desplazamiento)
          </label>
        </div>

        <AdminField
          v-slot="{ id }"
          label="Notas"
        >
          <textarea
            :id="id"
            v-model="form.notes"
            rows="2"
            class="resize-none rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus-visible:border-inaka-terra focus-visible:ring-2 focus-visible:ring-inaka-gold"
          />
        </AdminField>

        <p class="text-xs text-inaka-terra/80">
          Se crea como borrador con el precio calculado igual que en la web. Luego podrás ajustar productos, añadir descuentos, enviarlo por email y aceptarlo.
        </p>

        <div class="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            class="rounded-lg border border-inaka-beige px-4 py-2 text-sm font-medium text-inaka-terra/80 outline-none hover:bg-inaka-nude/50 focus-visible:ring-2 focus-visible:ring-inaka-gold"
            @click="creating = false"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="submitting || lines.length === 0"
            class="rounded-lg bg-inaka-terra px-4 py-2 text-sm font-semibold text-inaka-cream outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-inaka-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            {{ submitting ? 'Creando…' : 'Crear presupuesto' }}
          </button>
        </div>
      </form>
    </AdminModal>
  </div>
</template>

<script setup lang="ts">
import { EVENT_TYPES, EVENT_TYPE_LABELS, type EventType } from '~~/shared/eventTypes'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Presupuestos — Panel Inaka Moments' })

interface AdminQuote { id: string, client_name: string | null, event_type: EventType | null, event_date: string | null, total: number, status: string, deposit_status: string, lead_id: string | null }

const route = useRoute()
const { data, pending } = await useFetch<AdminQuote[]>('/api/admin/quotes')

// ── Nuevo presupuesto manual ─────────────────────────────────────────────
interface CatalogTier { label: string, price: number }
interface AdminProductLite { id: string, name: string, pricing: CatalogTier[] | null }
interface AdminPackLite { id: string, name: string }
interface AdminLeadLite { id: string, nombre: string, email: string, telefono: string | null, tipo: string | null }
interface DraftLine { kind: 'product' | 'pack', id: string, qty: number, tier: string | null }

const toast = useToast()
const { data: products } = await useFetch<AdminProductLite[]>('/api/admin/products')
const { data: packs } = await useFetch<AdminPackLite[]>('/api/admin/packs')
const { data: leads } = await useFetch<AdminLeadLite[]>('/api/admin/leads')

const creating = ref(false)
const submitting = ref(false)
const blankForm = () => ({ lead_id: '', client_name: '', client_email: '', client_phone: '', event_type: '' as EventType | '', event_date: '', location: '', far: false, desmontaje: false, notes: '' })
const form = reactive(blankForm())
const lines = ref<DraftLine[]>([])
const picker = ref('')
const pickerQty = ref(1)

function openCreate(leadId = '') {
  Object.assign(form, blankForm())
  lines.value = []
  picker.value = ''
  pickerQty.value = 1
  if (leadId && (leads.value ?? []).some(l => l.id === leadId)) {
    form.lead_id = leadId
    onLeadChange()
  }
  creating.value = true
}

function onLeadChange() {
  const lead = (leads.value ?? []).find(l => l.id === form.lead_id)
  if (!lead) return
  form.client_name = lead.nombre
  form.client_email = lead.email
  form.client_phone = lead.telefono ?? ''
  if (lead.tipo && (EVENT_TYPES as readonly string[]).includes(lead.tipo)) form.event_type = lead.tipo as EventType
}

function tiersFor(line: DraftLine): CatalogTier[] {
  if (line.kind !== 'product') return []
  const pricing = products.value?.find(p => p.id === line.id)?.pricing
  return Array.isArray(pricing) ? pricing.filter(t => t && typeof t.label === 'string' && typeof t.price === 'number') : []
}

function lineName(line: DraftLine): string {
  const item = line.kind === 'pack' ? packs.value?.find(p => p.id === line.id) : products.value?.find(p => p.id === line.id)
  return item?.name ?? line.id
}

function addLine() {
  const [kind, id] = picker.value.split(':')
  if (!id || (kind !== 'product' && kind !== 'pack')) return
  const draft: DraftLine = { kind, id, qty: Math.min(99, Math.max(1, Math.floor(pickerQty.value) || 1)), tier: null }
  draft.tier = tiersFor(draft)[0]?.label ?? null
  lines.value.push(draft)
  picker.value = ''
  pickerQty.value = 1
}

async function createQuote() {
  submitting.value = true
  try {
    const res = await $fetch<{ id: string }>('/api/admin/quotes', {
      method: 'POST',
      body: { ...form, lead_id: form.lead_id || null, event_type: form.event_type || null, lines: lines.value },
    })
    toast.success('Presupuesto creado como borrador. Revísalo y envíalo desde aquí.')
    await navigateTo(`/admin/presupuestos/${res.id}`)
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido crear el presupuesto.'))
  }
  finally {
    submitting.value = false
  }
}

// Enlace desde la ficha de un cliente: /admin/presupuestos?nuevo=<id del cliente>
onMounted(async () => {
  if (typeof route.query.nuevo !== 'string') return
  openCreate(route.query.nuevo)
  await navigateTo({ query: { ...route.query, nuevo: undefined } }, { replace: true })
})

const statusFilter = ref(typeof route.query.status === 'string' ? route.query.status : '')

const filtered = computed(() => {
  let list = data.value ?? []
  const leadFilter = route.query.lead
  if (typeof leadFilter === 'string') list = list.filter(q => q.lead_id === leadFilter)
  if (statusFilter.value) list = list.filter(q => q.status === statusFilter.value)
  return list
})

function formatEUR(n: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)
}
</script>
