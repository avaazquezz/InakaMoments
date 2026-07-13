<template>
  <div class="flex flex-col gap-6">
    <!-- Estado de carga -->
    <div v-if="pending" class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div v-for="i in 3" :key="i" class="h-24 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude" />
    </div>

    <template v-else-if="data">
      <!-- Tarjetas de resumen -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
          <p class="text-xs font-semibold uppercase tracking-wide text-inaka-terra/50">Leads nuevos</p>
          <p class="mt-2 text-3xl font-extrabold text-inaka-terra">{{ data.leadsNuevos }}</p>
        </div>
        <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
          <p class="text-xs font-semibold uppercase tracking-wide text-inaka-terra/50">Presupuestos aceptados (mes)</p>
          <p class="mt-2 text-3xl font-extrabold text-inaka-terra">{{ data.presupuestosAceptadosMes.count }}</p>
          <p class="mt-1 text-xs text-inaka-terra/50">{{ formatEUR(data.presupuestosAceptadosMes.total) }} en total</p>
        </div>
        <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
          <p class="text-xs font-semibold uppercase tracking-wide text-inaka-terra/50">Reserva prevista (mes)</p>
          <p class="mt-2 text-3xl font-extrabold text-inaka-terra">{{ formatEUR(data.presupuestosAceptadosMes.senalPrevista) }}</p>
          <p class="mt-1 text-xs text-inaka-terra/50">% de reserva sobre el total, al aceptar</p>
        </div>
        <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
          <p class="text-xs font-semibold uppercase tracking-wide text-inaka-terra/50">Reserva cobrada (mes)</p>
          <p class="mt-2 text-3xl font-extrabold text-inaka-terra">{{ formatEUR(data.presupuestosAceptadosMes.senalCobrada) }}</p>
          <p class="mt-1 text-xs text-inaka-terra/50">Marcada "pagado" tras recibir el Bizum</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <!-- Próximos eventos -->
        <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
          <h2 class="mb-3 text-sm font-bold text-inaka-terra">Próximos eventos</h2>
          <AdminEmptyState v-if="data.proximosEventos.length === 0" title="Sin eventos próximos" message="Los eventos confirmados o tentativos aparecerán aquí." />
          <ul v-else class="flex flex-col divide-y divide-inaka-nude/70">
            <li v-for="ev in data.proximosEventos" :key="ev.id" class="flex items-center justify-between gap-3 py-2.5">
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-inaka-terra">{{ ev.title }}</p>
                <p class="text-xs text-inaka-terra/50">{{ formatFecha(ev.event_date) }}</p>
              </div>
              <AdminStatusBadge :status="ev.status" kind="event" />
            </li>
          </ul>
        </div>

        <!-- Top productos -->
        <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
          <h2 class="mb-3 text-sm font-bold text-inaka-terra">Productos más pedidos</h2>
          <AdminEmptyState v-if="data.topProductos.length === 0" title="Aún sin datos" message="Aparecerán cuando haya presupuestos aceptados." />
          <ul v-else class="flex flex-col gap-2.5">
            <li v-for="p in data.topProductos" :key="p.name">
              <div class="mb-1 flex items-center justify-between text-xs">
                <span class="font-medium text-inaka-terra">{{ p.name }}</span>
                <span class="text-inaka-terra/50">× {{ p.qty }}</span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full bg-inaka-nude/50">
                <div class="h-full rounded-full bg-inaka-terra" :style="{ width: `${(p.qty / maxQty) * 100}%` }" />
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Embudo de leads -->
      <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
        <h2 class="mb-3 text-sm font-bold text-inaka-terra">Embudo de leads</h2>
        <div class="flex flex-col gap-2.5">
          <div v-for="f in data.funnel" :key="f.status" class="flex items-center gap-3">
            <span class="w-28 shrink-0 text-xs font-medium capitalize text-inaka-terra/70">{{ f.status }}</span>
            <div class="h-2.5 flex-1 overflow-hidden rounded-full bg-inaka-nude/50">
              <div class="h-full rounded-full bg-inaka-gold" :style="{ width: `${maxFunnel ? (f.count / maxFunnel) * 100 : 0}%` }" />
            </div>
            <span class="w-6 shrink-0 text-right text-xs font-semibold text-inaka-terra">{{ f.count }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Dashboard — Panel Inaka Moments' })

interface DashboardData {
  leadsNuevos: number
  proximosEventos: { id: string, title: string, event_date: string, event_type: string | null, status: string }[]
  presupuestosAceptadosMes: { count: number, total: number, senalPrevista: number, senalCobrada: number }
  funnel: { status: string, count: number }[]
  topProductos: { name: string, qty: number }[]
}

const { data, pending } = await useFetch<DashboardData>('/api/admin/dashboard')

const maxQty = computed(() => Math.max(1, ...(data.value?.topProductos.map(p => p.qty) ?? [1])))
const maxFunnel = computed(() => Math.max(0, ...(data.value?.funnel.map(f => f.count) ?? [0])))

function formatEUR(n: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function formatFecha(iso: string): string {
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${iso}T00:00:00`))
}
</script>
