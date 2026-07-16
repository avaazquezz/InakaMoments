<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-center justify-end">
      <button
        type="button"
        class="rounded-xl bg-inaka-terra px-4 py-2.5 text-sm font-semibold text-inaka-cream hover:opacity-90"
        @click="openNew"
      >
        + Nueva reserva
      </button>
    </div>

    <div
      v-if="pending"
      class="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude"
    />
    <AdminEmptyState
      v-else-if="(data ?? []).length === 0"
      title="Sin reservas de inventario"
    />

    <!-- Tarjetas (móvil/tablet) -->
    <div
      v-else
      class="flex flex-col gap-3 md:hidden"
    >
      <div
        v-for="b in data"
        :key="b.id"
        class="flex flex-col gap-2 rounded-2xl bg-white p-4 ring-1 ring-inaka-nude"
      >
        <div class="flex items-start justify-between gap-2">
          <p class="font-semibold text-inaka-terra">
            {{ b.product?.name ?? '—' }}
          </p>
          <AdminStatusBadge
            :status="b.deposit_status"
            kind="payment"
          />
        </div>
        <p class="text-xs text-inaka-terra/55">
          {{ b.date_from }} → {{ b.date_to }}
        </p>
        <p class="text-xs text-inaka-terra/55">
          {{ b.event?.title ?? 'Sin evento vinculado' }}
        </p>
        <div class="mt-1 flex items-center gap-3">
          <button
            type="button"
            class="text-xs font-semibold text-inaka-gold hover:underline"
            @click="openEdit(b)"
          >
            Editar
          </button>
          <button
            type="button"
            class="text-xs font-semibold text-red-500 hover:underline"
            @click="askDelete(b)"
          >
            Borrar
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla (desktop) -->
    <div
      v-if="!pending && (data ?? []).length"
      class="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-inaka-nude md:block"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-inaka-cream text-xs uppercase tracking-wide text-inaka-terra/50">
            <tr>
              <th class="px-4 py-3">
                Producto
              </th><th class="px-4 py-3">
                Del
              </th><th class="px-4 py-3">
                Al
              </th><th class="px-4 py-3">
                Evento
              </th><th class="px-4 py-3">
                Fianza
              </th><th class="px-4 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-inaka-nude/70">
            <tr
              v-for="b in data"
              :key="b.id"
              class="hover:bg-inaka-cream/50"
            >
              <td class="px-4 py-3 font-medium text-inaka-terra">
                {{ b.product?.name ?? '—' }}
              </td>
              <td class="px-4 py-3 text-inaka-terra/60">
                {{ b.date_from }}
              </td>
              <td class="px-4 py-3 text-inaka-terra/60">
                {{ b.date_to }}
              </td>
              <td class="px-4 py-3 text-inaka-terra/60">
                {{ b.event?.title ?? 'Sin evento vinculado' }}
              </td>
              <td class="px-4 py-3">
                <AdminStatusBadge
                  :status="b.deposit_status"
                  kind="payment"
                />
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  class="mr-3 text-xs font-semibold text-inaka-gold hover:underline"
                  @click="openEdit(b)"
                >
                  Editar
                </button>
                <button
                  type="button"
                  class="text-xs font-semibold text-red-500 hover:underline"
                  @click="askDelete(b)"
                >
                  Borrar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="editing"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-inaka-terra/40 backdrop-blur-sm"
          @click="editing = null"
        />
        <div class="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          <h2 class="mb-4 text-lg font-bold text-inaka-terra">
            {{ editing.id ? 'Editar' : 'Nueva' }} reserva
          </h2>
          <form
            class="flex flex-col gap-3"
            @submit.prevent="save"
          >
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-inaka-terra/70">Producto de alquiler</label>
              <select
                v-model="editing.product_id"
                required
                class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
                @change="onProductChange"
              >
                <option
                  value=""
                  disabled
                >
                  Elige un producto…
                </option>
                <option
                  v-for="p in rentalProducts"
                  :key="p.id"
                  :value="p.id"
                >
                  {{ p.name }}
                </option>
              </select>
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-inaka-terra/70">Fecha de inicio</label>
                <input
                  v-model="editing.date_from"
                  type="date"
                  required
                  class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
                >
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-inaka-terra/70">Fecha de fin</label>
                <input
                  v-model="editing.date_to"
                  type="date"
                  required
                  class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
                >
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-inaka-terra/70">Evento vinculado (opcional)</label>
              <select
                v-model="editing.event_id"
                class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
              >
                <option :value="null">
                  Sin evento vinculado
                </option>
                <option
                  v-for="ev in events"
                  :key="ev.id"
                  :value="ev.id"
                >
                  {{ ev.title }} ({{ ev.event_date }})
                </option>
              </select>
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-inaka-terra/70">Fianza (€)</label>
                <input
                  v-model.number="editing.deposit_amount"
                  type="number"
                  min="0"
                  class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
                >
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-inaka-terra/70">Estado de la fianza</label>
                <select
                  v-model="editing.deposit_status"
                  class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
                >
                  <option
                    v-for="s in ['pendiente', 'pagado', 'reembolsado', 'fallido']"
                    :key="s"
                    :value="s"
                  >
                    {{ s }}
                  </option>
                </select>
              </div>
            </div>
            <p
              v-if="saveError"
              class="text-xs text-red-500"
            >
              {{ saveError }}
            </p>
            <div class="mt-2 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                class="rounded-lg border border-inaka-beige px-4 py-2 text-sm font-medium text-inaka-terra/70 hover:bg-inaka-nude/50"
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
        </div>
      </div>
    </Teleport>

    <AdminConfirmDialog
      :open="!!toDelete"
      title="¿Borrar esta reserva?"
      danger
      @cancel="toDelete = null"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Inventario alquiler — Panel Inaka Moments' })

interface Booking {
  id: string, product_id: string, event_id: string | null, date_from: string, date_to: string
  deposit_amount: number, deposit_status: string, product?: { name: string } | null, event?: { title: string } | null
}
interface AdminProduct { id: string, name: string, is_rental: boolean, deposit: number }
interface AdminEventLite { id: string, title: string, event_date: string }

const { data, pending, refresh } = await useFetch<Booking[]>('/api/admin/rental-bookings')
const { data: products } = await useFetch<AdminProduct[]>('/api/admin/products')
const { data: events } = await useFetch<AdminEventLite[]>('/api/admin/events')
const toast = useToast()

const rentalProducts = computed(() => (products.value ?? []).filter(p => p.is_rental))

const editing = ref<Partial<Booking> | null>(null)
const saving = ref(false)
const saveError = ref('')
const toDelete = ref<Booking | null>(null)

function openNew() {
  editing.value = { product_id: '', date_from: '', date_to: '', event_id: null, deposit_amount: 0, deposit_status: 'pendiente' }
  saveError.value = ''
}
function openEdit(b: Booking) {
  editing.value = { ...b }
  saveError.value = ''
}

// Solo autocompleta la fianza en reservas nuevas: en una reserva existente
// respeta el importe ya guardado aunque se cambie el producto.
function onProductChange() {
  if (editing.value?.id) return
  const product = (products.value ?? []).find(p => p.id === editing.value?.product_id)
  if (product && editing.value) editing.value.deposit_amount = product.deposit
}

async function save() {
  if (!editing.value) return
  saving.value = true
  saveError.value = ''
  try {
    if (editing.value.id) await $fetch(`/api/admin/rental-bookings/${editing.value.id}`, { method: 'PATCH', body: editing.value })
    else await $fetch('/api/admin/rental-bookings', { method: 'POST', body: editing.value })
    toast.success('Reserva guardada.')
    editing.value = null
    await refresh()
  }
  catch (err) {
    saveError.value = apiErrorMessage(err, 'No se ha podido guardar.')
  }
  finally {
    saving.value = false
  }
}

function askDelete(b: Booking) { toDelete.value = b }
async function confirmDelete() {
  if (!toDelete.value) return
  try {
    await $fetch(`/api/admin/rental-bookings/${toDelete.value.id}`, { method: 'DELETE' })
    toast.success('Reserva borrada.')
    await refresh()
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido borrar.'))
  }
  finally {
    toDelete.value = null
  }
}
</script>
