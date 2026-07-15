<template>
  <div class="flex flex-col gap-6">
    <div v-if="pending" class="h-96 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude" />

    <template v-else-if="quote">
      <!-- Cabecera -->
      <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
        <div class="flex items-center gap-3">
          <p class="text-lg font-bold text-inaka-terra">{{ quote.client_name ?? 'Sin nombre' }}</p>
          <span v-if="quote.event_type" class="text-sm text-inaka-terra/50">{{ EVENT_TYPE_LABELS[quote.event_type] }}</span>
          <AdminStatusBadge :status="quote.status" kind="quote" />
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="rounded-lg border border-inaka-beige px-3 py-1.5 text-xs font-semibold text-inaka-terra hover:bg-inaka-nude/40" @click="sendToClient">Reenviar email</button>
          <button v-if="quote.status !== 'aceptado'" type="button" class="rounded-lg bg-inaka-terra px-3 py-1.5 text-xs font-semibold text-inaka-cream hover:opacity-90" @click="openAccept">Aceptar</button>
          <button v-if="quote.status !== 'aceptado'" type="button" class="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 hover:underline" @click="confirmingDelete = true">Borrar</button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <!-- Datos cliente/evento -->
        <form class="flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-inaka-nude lg:col-span-2" @submit.prevent="saveInfo">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-inaka-terra/70">Nombre</label>
              <input v-model="infoForm.client_name" type="text" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-inaka-terra/70">Email</label>
              <input v-model="infoForm.client_email" type="email" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-inaka-terra/70">Teléfono</label>
              <input v-model="infoForm.client_phone" type="text" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-inaka-terra/70">Fecha del evento</label>
              <input v-model="infoForm.event_date" type="date" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
            </div>
            <div class="flex flex-col gap-1.5 sm:col-span-2">
              <label class="text-xs font-semibold text-inaka-terra/70">Dirección</label>
              <input v-model="infoForm.location" type="text" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-inaka-terra/70">Notas internas</label>
            <textarea v-model="infoForm.notes" rows="2" class="resize-none rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
          </div>
          <button type="submit" :disabled="savingInfo" class="self-start rounded-xl bg-inaka-terra px-5 py-2.5 text-sm font-semibold text-inaka-cream hover:opacity-90">
            {{ savingInfo ? 'Guardando…' : 'Guardar datos' }}
          </button>
        </form>

        <!-- Totales -->
        <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
          <h3 class="mb-3 text-sm font-bold text-inaka-terra">Resumen</h3>
          <div class="flex items-center justify-between text-sm"><span class="text-inaka-terra/60">Subtotal</span><span class="font-semibold text-inaka-terra">{{ formatEUR(quote.subtotal) }}</span></div>
          <div v-for="adj in quote.adjustments" :key="adj.key" class="mt-1 flex items-center justify-between text-sm">
            <span class="text-inaka-terra/60">{{ adj.label }}</span>
            <span class="font-medium text-inaka-terra/80">{{ adj.amount != null ? formatEUR(adj.amount) : (adj.note ?? 'a consultar') }}</span>
          </div>
          <div class="mt-2 flex items-center justify-between border-t border-inaka-nude pt-2">
            <span class="font-bold text-inaka-terra">Total</span>
            <span class="text-lg font-extrabold text-inaka-terra">{{ formatEUR(quote.total) }}</span>
          </div>
          <div class="mt-2 flex items-center justify-between gap-2">
            <p class="text-xs text-inaka-terra/50">
              <template v-if="quote.status === 'aceptado'">Reserva: {{ formatEUR(quote.deposit_amount!) }}</template>
              <template v-else>Reserva prevista ({{ senalPorcentaje }}%): {{ formatEUR(round2(quote.total * senalPorcentaje / 100)) }}</template>
            </p>
            <template v-if="quote.status === 'aceptado'">
              <AdminStatusBadge :status="quote.deposit_status" kind="payment" />
              <select v-model="quote.deposit_status" class="rounded-lg border border-inaka-beige bg-white px-2 py-1 text-xs text-inaka-terra outline-none focus:border-inaka-terra" @change="updateDepositStatus">
                <option v-for="s in ['pendiente', 'pagado', 'reembolsado', 'fallido']" :key="s" :value="s">{{ s }}</option>
              </select>
            </template>
          </div>
        </div>
      </div>

      <!-- Líneas -->
      <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-bold text-inaka-terra">Productos</h3>
          <label class="flex items-center gap-2 text-xs text-inaka-terra/60">
            <input v-model="editingItems" type="checkbox" class="h-4 w-4 accent-inaka-terra" /> Editar
          </label>
        </div>

        <ul v-if="!editingItems" class="flex flex-col divide-y divide-inaka-nude/70">
          <li v-for="it in quote.items" :key="it.id" class="flex items-center justify-between gap-3 py-2 text-sm">
            <span class="min-w-0 truncate text-inaka-terra">{{ it.label }} × {{ it.qty }}</span>
            <span class="shrink-0 font-semibold text-inaka-terra">{{ it.line_total != null ? formatEUR(it.line_total) : 'A consultar' }}</span>
          </li>
        </ul>

        <div v-else class="flex flex-col gap-4">
          <div v-for="(line, i) in draftLines" :key="i" class="flex items-center gap-2 rounded-lg border border-inaka-beige p-2">
            <span class="flex-1 truncate text-sm text-inaka-terra">{{ lineLabel(line) }}</span>
            <input v-model.number="line.qty" type="number" min="1" class="w-16 rounded border border-inaka-beige px-2 py-1 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
            <button type="button" class="text-red-500" @click="draftLines.splice(i, 1)">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-2 rounded-lg bg-inaka-cream p-3">
            <select v-model="pickerProductId" class="rounded-lg border border-inaka-beige bg-white px-2 py-1.5 text-sm text-inaka-terra outline-none focus:border-inaka-terra">
              <option value="">Añadir producto…</option>
              <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
            <input v-model.number="pickerQty" type="number" min="1" class="w-16 rounded-lg border border-inaka-beige bg-white px-2 py-1.5 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
            <button type="button" class="rounded-lg bg-inaka-terra px-3 py-1.5 text-xs font-semibold text-inaka-cream hover:opacity-90" @click="addLine">Añadir</button>
          </div>

          <label class="flex items-center gap-2 text-sm text-inaka-terra">
            <input v-model="editDesmontaje" type="checkbox" class="h-4 w-4 accent-inaka-terra" /> Desmontaje
          </label>

          <button type="button" :disabled="savingItems || draftLines.length === 0" class="self-start rounded-xl bg-inaka-terra px-5 py-2.5 text-sm font-semibold text-inaka-cream hover:opacity-90" @click="saveItems">
            {{ savingItems ? 'Recalculando…' : 'Guardar productos' }}
          </button>
        </div>
      </div>

      <!-- Ajustes manuales -->
      <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
        <h3 class="mb-3 text-sm font-bold text-inaka-terra">Ajustes manuales (descuentos, extras…)</h3>
        <div v-for="(adj, i) in manualAdjustments" :key="i" class="mb-2 flex items-center gap-2">
          <input v-model="adj.label" type="text" placeholder="Etiqueta" class="flex-1 rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
          <input v-model.number="adj.amount" type="number" step="0.5" placeholder="€ (negativo = descuento)" class="w-40 rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
          <button type="button" class="text-red-500" @click="manualAdjustments.splice(i, 1)">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="flex items-center gap-3">
          <button type="button" class="text-xs font-semibold text-inaka-gold hover:underline" @click="manualAdjustments.push({ key: `manual-${Date.now()}`, label: '', amount: 0 })">+ Añadir ajuste</button>
          <button type="button" :disabled="savingAdjustments" class="rounded-lg bg-inaka-terra px-4 py-2 text-xs font-semibold text-inaka-cream hover:opacity-90" @click="saveAdjustments">
            {{ savingAdjustments ? 'Guardando…' : 'Guardar ajustes' }}
          </button>
        </div>
      </div>
    </template>

    <!-- Modal Aceptar -->
    <Teleport to="body">
      <div v-if="accepting" class="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-inaka-terra/40 backdrop-blur-sm" @click="accepting = false" />
        <div class="relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          <h2 class="mb-4 text-lg font-bold text-inaka-terra">Aceptar presupuesto</h2>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-inaka-terra">Fecha del evento</label>
              <input v-model="acceptForm.event_date" type="date" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
            </div>
            <div class="rounded-lg bg-inaka-cream px-3 py-2.5 text-sm text-inaka-terra">
              Reserva a abonar (<strong>{{ senalPorcentaje }}%</strong> del total): <strong>{{ quote ? formatEUR(round2(quote.total * senalPorcentaje / 100)) : '—' }}</strong>
              <p class="mt-0.5 text-xs text-inaka-terra/50">Se calcula sola según el % fijado en Contenido → Reglas de negocio.</p>
            </div>
            <p v-if="acceptError" class="text-xs text-red-500">{{ acceptError }}</p>
            <div class="mt-2 flex flex-wrap justify-end gap-3">
              <button type="button" class="rounded-lg border border-inaka-beige px-4 py-2 text-sm font-medium text-inaka-terra/70 hover:bg-inaka-nude/50" @click="accepting = false">Cancelar</button>
              <button type="button" :disabled="acceptSubmitting" class="rounded-lg bg-inaka-terra px-4 py-2 text-sm font-semibold text-inaka-cream hover:opacity-90" @click="confirmAccept">Confirmar</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <AdminConfirmDialog :open="confirmingDelete" title="¿Borrar este presupuesto?" danger @cancel="confirmingDelete = false" @confirm="deleteQuote" />
  </div>
</template>

<script setup lang="ts">
import { round2 } from '~~/shared/configurator'
import { EVENT_TYPE_LABELS, type EventType } from '~~/shared/eventTypes'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Presupuesto — Panel Inaka Moments' })

interface QuoteItem { id: string, product_id: string | null, pack_id: string | null, label: string, qty: number, unit_price: number | null, line_total: number | null, options: { tier?: string, size?: string, options?: string[] } }
interface QuoteAdjustment { key: string, label: string, amount: number | null, note?: string }
interface QuoteDetail {
  id: string, client_name: string | null, client_email: string | null, client_phone: string | null,
  event_type: EventType | null, event_date: string | null, location: string | null, notes: string | null,
  status: string, subtotal: number, adjustments: QuoteAdjustment[], total: number, deposit_amount: number | null,
  deposit_status: string, items: QuoteItem[]
}
interface AdminProduct { id: string, name: string, base_price: number | null, pricing: { label: string, price: number }[] }

const route = useRoute()
const toast = useToast()

const { data: quote, pending, refresh } = await useFetch<QuoteDetail>(`/api/admin/quotes/${route.params.id}`)
const { data: products } = await useFetch<AdminProduct[]>('/api/admin/products')
const { data: settings } = await useFetch<{ data: Record<string, unknown> }>('/api/admin/site-content/settings')
const senalPorcentaje = computed(() => {
  const v = settings.value?.data?.senal_porcentaje
  return typeof v === 'number' && v > 0 ? v : 50
})

// ── Datos cliente/evento ────────────────────────────────────────────────
const infoForm = reactive({ client_name: '', client_email: '', client_phone: '', event_date: '', location: '', notes: '' })
watchEffect(() => {
  if (quote.value) {
    infoForm.client_name = quote.value.client_name ?? ''
    infoForm.client_email = quote.value.client_email ?? ''
    infoForm.client_phone = quote.value.client_phone ?? ''
    infoForm.event_date = quote.value.event_date ?? ''
    infoForm.location = quote.value.location ?? ''
    infoForm.notes = quote.value.notes ?? ''
  }
})
const savingInfo = ref(false)
async function saveInfo() {
  savingInfo.value = true
  try {
    await $fetch(`/api/admin/quotes/${route.params.id}`, { method: 'PATCH', body: infoForm })
    toast.success('Datos guardados.')
    await refresh()
  }
  catch (err: any) { toast.error(err?.data?.message ?? 'No se ha podido guardar.') }
  finally { savingInfo.value = false }
}

// ── Líneas ───────────────────────────────────────────────────────────────
interface DraftLine { kind: 'product' | 'pack', id: string, qty: number, tier: string | null, size: string | null, options: string[] }
const editingItems = ref(false)
const draftLines = ref<DraftLine[]>([])
const editDesmontaje = ref(false)
const pickerProductId = ref('')
const pickerQty = ref(1)
const savingItems = ref(false)

watchEffect(() => {
  if (quote.value && draftLines.value.length === 0) {
    draftLines.value = quote.value.items.map(it => ({
      kind: it.product_id ? 'product' : 'pack',
      id: (it.product_id ?? it.pack_id)!,
      qty: it.qty,
      tier: it.options?.tier ?? null,
      size: it.options?.size ?? null,
      options: it.options?.options ?? [],
    }))
    editDesmontaje.value = (quote.value.adjustments ?? []).some(a => a.key === 'desmontaje')
  }
})

function lineLabel(line: DraftLine): string {
  const p = products.value?.find(x => x.id === line.id)
  return p ? `${p.name}${line.tier ? ` (${line.tier})` : ''}` : line.id
}

function addLine() {
  if (!pickerProductId.value) return
  const p = products.value?.find(x => x.id === pickerProductId.value)
  draftLines.value.push({
    kind: 'product',
    id: pickerProductId.value,
    qty: pickerQty.value,
    tier: p?.pricing?.[0]?.label ?? null,
    size: null,
    options: [],
  })
  pickerProductId.value = ''
  pickerQty.value = 1
}

async function saveItems() {
  savingItems.value = true
  try {
    await $fetch(`/api/admin/quotes/${route.params.id}/items`, {
      method: 'PATCH',
      body: { lines: draftLines.value, desmontaje: editDesmontaje.value, far: false, distanceKm: null },
    })
    toast.success('Productos actualizados.')
    editingItems.value = false
    await refresh()
  }
  catch (err: any) { toast.error(err?.data?.message ?? 'No se ha podido recalcular.') }
  finally { savingItems.value = false }
}

// ── Ajustes manuales ─────────────────────────────────────────────────────
const manualAdjustments = ref<QuoteAdjustment[]>([])
watchEffect(() => {
  if (quote.value) manualAdjustments.value = (quote.value.adjustments ?? []).filter(a => a.key !== 'desmontaje' && a.key !== 'gasolina').map(a => ({ ...a }))
})
const savingAdjustments = ref(false)
async function saveAdjustments() {
  if (!quote.value) return
  const engineAdjustments = (quote.value.adjustments ?? []).filter(a => a.key === 'desmontaje' || a.key === 'gasolina')
  savingAdjustments.value = true
  try {
    await $fetch(`/api/admin/quotes/${route.params.id}`, { method: 'PATCH', body: { adjustments: [...engineAdjustments, ...manualAdjustments.value] } })
    toast.success('Ajustes guardados.')
    await refresh()
  }
  catch (err: any) { toast.error(err?.data?.message ?? 'No se ha podido guardar.') }
  finally { savingAdjustments.value = false }
}

// ── Aceptar ──────────────────────────────────────────────────────────────
const accepting = ref(false)
const acceptSubmitting = ref(false)
const acceptError = ref('')
const acceptForm = reactive({ event_date: '' })

function openAccept() {
  if (!quote.value) return
  acceptForm.event_date = quote.value.event_date ?? ''
  acceptError.value = ''
  accepting.value = true
}

async function confirmAccept() {
  acceptSubmitting.value = true
  acceptError.value = ''
  try {
    await $fetch(`/api/admin/quotes/${route.params.id}/accept`, { method: 'POST', body: acceptForm })
    toast.success('Presupuesto aceptado. Evento confirmado en Agenda.')
    accepting.value = false
    await refresh()
  }
  catch (err: any) {
    acceptError.value = err?.data?.message ?? 'No se ha podido aceptar el presupuesto.'
  }
  finally {
    acceptSubmitting.value = false
  }
}

async function updateDepositStatus() {
  if (!quote.value) return
  try {
    await $fetch(`/api/admin/quotes/${route.params.id}`, { method: 'PATCH', body: { deposit_status: quote.value.deposit_status } })
    toast.success('Estado de la reserva actualizado.')
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido actualizar la reserva.')
    await refresh()
  }
}

async function sendToClient() {
  try {
    await $fetch(`/api/admin/quotes/${route.params.id}/send`, { method: 'POST' })
    toast.success('Email reenviado.')
  }
  catch (err: any) { toast.error(err?.data?.message ?? 'No se ha podido enviar.') }
}

const confirmingDelete = ref(false)
async function deleteQuote() {
  try {
    await $fetch(`/api/admin/quotes/${route.params.id}`, { method: 'DELETE' })
    toast.success('Presupuesto borrado.')
    await navigateTo('/admin/presupuestos')
  }
  catch (err: any) { toast.error(err?.data?.message ?? 'No se ha podido borrar.') }
  finally { confirmingDelete.value = false }
}

function formatEUR(n: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)
}
</script>
