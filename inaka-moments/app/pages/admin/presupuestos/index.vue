<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center gap-2">
      <select v-model="statusFilter" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra">
        <option value="">Todos los estados</option>
        <option v-for="s in ['borrador', 'enviado', 'aceptado', 'rechazado', 'caducado']" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <div v-if="pending" class="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude" />
    <AdminEmptyState v-else-if="filtered.length === 0" title="No hay presupuestos" />

    <div v-else class="overflow-hidden rounded-2xl bg-white ring-1 ring-inaka-nude">
      <table class="w-full text-left text-sm">
        <thead class="bg-inaka-cream text-xs uppercase tracking-wide text-inaka-terra/50">
          <tr>
            <th class="px-4 py-3">Cliente</th>
            <th class="px-4 py-3">Fecha evento</th>
            <th class="px-4 py-3">Total</th>
            <th class="px-4 py-3">Estado</th>
            <th class="px-4 py-3">Reserva</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody class="divide-y divide-inaka-nude/70">
          <tr v-for="q in filtered" :key="q.id" class="hover:bg-inaka-cream/50">
            <td class="px-4 py-3 font-medium text-inaka-terra">{{ q.client_name ?? '—' }}</td>
            <td class="px-4 py-3 text-inaka-terra/60">{{ q.event_date ?? '—' }}</td>
            <td class="px-4 py-3 text-inaka-terra/60">{{ formatEUR(q.total) }}</td>
            <td class="px-4 py-3"><AdminStatusBadge :status="q.status" kind="quote" /></td>
            <td class="px-4 py-3">
              <AdminStatusBadge v-if="q.status === 'aceptado'" :status="q.deposit_status" kind="payment" />
              <span v-else class="text-inaka-terra/30">—</span>
            </td>
            <td class="px-4 py-3 text-right">
              <NuxtLink :to="`/admin/presupuestos/${q.id}`" class="text-xs font-semibold text-inaka-gold hover:underline">Ver</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Presupuestos — Panel Inaka Moments' })

interface AdminQuote { id: string, client_name: string | null, event_date: string | null, total: number, status: string, deposit_status: string, lead_id: string | null }

const route = useRoute()
const { data, pending } = await useFetch<AdminQuote[]>('/api/admin/quotes')

const statusFilter = ref('')

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
