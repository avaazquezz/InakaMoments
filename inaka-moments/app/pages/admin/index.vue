<template>
  <div class="flex flex-col gap-6">
    <!-- Estado de carga -->
    <div
      v-if="pending"
      class="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="h-24 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude"
      />
    </div>

    <template v-else-if="data">
      <!-- Pendiente hoy -->
      <div>
        <h2 class="mb-3 text-sm font-bold text-inaka-terra">
          Pendiente hoy
        </h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            to="/admin/leads"
            class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude transition-shadow hover:shadow-sm"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-inaka-terra/60">Clientes nuevos</p>
            <p class="mt-2 text-3xl font-extrabold text-inaka-terra">{{ data.leadsNuevos }}</p>
            <p class="mt-1 text-xs text-inaka-terra/70">Sin contactar todavía</p>
          </NuxtLink>
          <NuxtLink
            to="/admin/presupuestos?status=enviado"
            class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude transition-shadow hover:shadow-sm"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-inaka-terra/60">Presupuestos por decidir</p>
            <p class="mt-2 text-3xl font-extrabold text-inaka-terra">{{ data.quotesEnviados }}</p>
            <p class="mt-1 text-xs text-inaka-terra/70">Esperando que el cliente confirme o tú actúes</p>
          </NuxtLink>
          <NuxtLink
            to="/admin/resenas"
            class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude transition-shadow hover:shadow-sm"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-inaka-terra/60">Reseñas por aprobar</p>
            <p class="mt-2 text-3xl font-extrabold text-inaka-terra">{{ data.testimonialsPendientes }}</p>
            <p class="mt-1 text-xs text-inaka-terra/70">El cliente ya respondió, revísala antes de publicarla</p>
          </NuxtLink>
          <NuxtLink
            to="/admin/inventario"
            class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude transition-shadow hover:shadow-sm"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-inaka-terra/60">Fianzas por devolver</p>
            <p class="mt-2 text-3xl font-extrabold text-inaka-terra">{{ data.depositosPendientes.count }}</p>
            <p class="mt-1 text-xs text-inaka-terra/70">{{ data.depositosPendientes.count > 0 ? `${formatEUR(data.depositosPendientes.total)} de alquileres ya terminados` : 'Todo al día' }}</p>
          </NuxtLink>
        </div>
      </div>

      <!-- Cómo va el negocio -->
      <div>
        <h2 class="mb-3 text-sm font-bold text-inaka-terra">
          Cómo va el negocio
        </h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
            <p class="text-xs font-semibold uppercase tracking-wide text-inaka-terra/60">
              Presupuestos aceptados
            </p>
            <p class="mt-2 text-3xl font-extrabold text-inaka-terra">
              {{ data.presupuestosAceptadosMes.count }}
            </p>
            <p class="mt-1 text-xs text-inaka-terra/70">
              {{ formatEUR(data.presupuestosAceptadosMes.total) }} en total, confirmados con fecha reservada
            </p>
            <p
              v-if="deltaPresupuestos"
              class="mt-1.5 text-xs font-semibold"
              :class="deltaPresupuestos.class"
            >
              {{ deltaPresupuestos.text }}
            </p>
          </div>
          <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
            <p class="text-xs font-semibold uppercase tracking-wide text-inaka-terra/60">
              Reserva prevista
            </p>
            <p class="mt-2 text-3xl font-extrabold text-inaka-terra">
              {{ formatEUR(data.presupuestosAceptadosMes.senalPrevista) }}
            </p>
            <p class="mt-1 text-xs text-inaka-terra/70">
              % de reserva sobre el total, al aceptar
            </p>
          </div>
          <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
            <p class="text-xs font-semibold uppercase tracking-wide text-inaka-terra/60">
              Reserva cobrada
            </p>
            <p class="mt-2 text-3xl font-extrabold text-inaka-terra">
              {{ formatEUR(data.presupuestosAceptadosMes.senalCobrada) }}
            </p>
            <p class="mt-1 text-xs text-inaka-terra/70">
              Marcada "pagado" tras recibir el Bizum
            </p>
            <p
              v-if="deltaCobrada"
              class="mt-1.5 text-xs font-semibold"
              :class="deltaCobrada.class"
            >
              {{ deltaCobrada.text }}
            </p>
          </div>
          <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
            <p class="text-xs font-semibold uppercase tracking-wide text-inaka-terra/60">
              Ticket medio
            </p>
            <p class="mt-2 text-3xl font-extrabold text-inaka-terra">
              {{ data.presupuestosAceptadosMes.ticketMedio != null ? formatEUR(data.presupuestosAceptadosMes.ticketMedio) : '—' }}
            </p>
            <p class="mt-1 text-xs text-inaka-terra/70">
              Valor medio de un presupuesto aceptado este mes
            </p>
          </div>
          <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
            <p class="text-xs font-semibold uppercase tracking-wide text-inaka-terra/60">
              Tasa de conversión
            </p>
            <p class="mt-2 text-3xl font-extrabold text-inaka-terra">
              {{ conversionPct }}%
            </p>
            <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-inaka-nude/50">
              <div
                class="h-full rounded-full bg-green-500 transition-all"
                :style="{ width: `${conversionPct}%` }"
              />
            </div>
            <p class="mt-1.5 text-xs text-inaka-terra/70">
              {{ conversionCaption }}
            </p>
          </div>
          <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
            <p class="text-xs font-semibold uppercase tracking-wide text-inaka-terra/60">
              Reseñas
            </p>
            <div class="mt-2 flex items-center gap-1.5">
              <span class="text-3xl font-extrabold text-inaka-terra">{{ data.resenas.mediaRating != null ? data.resenas.mediaRating.toFixed(1) : '—' }}</span>
              <svg
                v-if="data.resenas.mediaRating != null"
                class="h-5 w-5 text-inaka-gold"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              ><path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" /></svg>
            </div>
            <p class="mt-1 text-xs text-inaka-terra/70">
              {{ data.resenas.count }} publicada{{ data.resenas.count === 1 ? '' : 's' }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <!-- Próximos eventos -->
        <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
          <h2 class="mb-3 text-sm font-bold text-inaka-terra">
            Próximos eventos
            <span
              v-if="data.eventosProximos7Dias > 0"
              class="ml-1 font-normal text-inaka-terra/70"
            >· {{ data.eventosProximos7Dias }} en los próximos 7 días</span>
          </h2>
          <AdminEmptyState
            v-if="data.proximosEventos.length === 0"
            title="Sin eventos próximos"
            message="Los eventos confirmados o sin confirmar aparecerán aquí."
          />
          <ul
            v-else
            class="flex flex-col divide-y divide-inaka-nude/70"
          >
            <li
              v-for="ev in data.proximosEventos"
              :key="ev.id"
              class="flex items-center justify-between gap-3 py-2.5"
            >
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-inaka-terra">
                  {{ ev.title }}
                </p>
                <p class="text-xs text-inaka-terra/70">
                  {{ formatFecha(ev.event_date) }}
                </p>
              </div>
              <AdminStatusBadge
                :status="ev.status"
                kind="event"
              />
            </li>
          </ul>
        </div>

        <!-- Top productos -->
        <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
          <h2 class="mb-3 text-sm font-bold text-inaka-terra">
            Productos más pedidos
          </h2>
          <AdminEmptyState
            v-if="data.topProductos.length === 0"
            title="Aún sin datos"
            message="Aparecerán cuando haya presupuestos aceptados."
          />
          <ul
            v-else
            class="flex flex-col gap-2.5"
          >
            <li
              v-for="p in data.topProductos"
              :key="p.name"
            >
              <div class="mb-1 flex items-center justify-between text-xs">
                <span class="font-medium text-inaka-terra">{{ p.name }}</span>
                <span class="text-inaka-terra/70">× {{ p.qty }}</span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full bg-inaka-nude/50">
                <div
                  class="h-full rounded-full bg-inaka-terra"
                  :style="{ width: `${(p.qty / maxQty) * 100}%` }"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Embudo de leads -->
      <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
        <h2 class="mb-3 text-sm font-bold text-inaka-terra">
          Estado de los clientes
        </h2>
        <div class="flex flex-col gap-2.5">
          <div
            v-for="f in data.funnel"
            :key="f.status"
            class="flex items-center gap-3"
          >
            <span class="w-28 shrink-0 text-xs font-medium text-inaka-terra/70">{{ funnelLabel(f.status) }}</span>
            <div class="h-2.5 flex-1 overflow-hidden rounded-full bg-inaka-nude/50">
              <div
                class="h-full rounded-full"
                :style="{ width: `${maxFunnel ? (f.count / maxFunnel) * 100 : 0}%`, backgroundColor: funnelColor(f.status) }"
              />
            </div>
            <span class="w-6 shrink-0 text-right text-xs font-semibold text-inaka-terra">{{ f.count }}</span>
          </div>
        </div>

        <!-- Leyenda -->
        <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-inaka-beige/70 pt-3">
          <div
            v-for="s in LEAD_STATUSES"
            :key="s"
            class="flex items-center gap-1.5"
          >
            <span
              class="h-2.5 w-2.5 shrink-0 rounded-full"
              :style="{ backgroundColor: LEAD_STATUS_STYLES[s].bar }"
            />
            <span class="text-xs text-inaka-terra/70">{{ LEAD_STATUS_LABELS[s] }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Inicio — Panel Inaka Moments' })

interface DashboardData {
  leadsNuevos: number
  quotesEnviados: number
  testimonialsPendientes: number
  proximosEventos: { id: string, title: string, event_date: string, event_type: string | null, status: string }[]
  eventosProximos7Dias: number
  depositosPendientes: { count: number, total: number }
  resenas: { count: number, mediaRating: number | null }
  presupuestosAceptadosMes: { count: number, total: number, senalPrevista: number, senalCobrada: number, ticketMedio: number | null }
  presupuestosAceptadosMesAnterior: { count: number, total: number, senalCobrada: number }
  funnel: { status: string, count: number }[]
  topProductos: { name: string, qty: number }[]
}

const { data, pending } = await useFetch<DashboardData>('/api/admin/dashboard')

const maxQty = computed(() => Math.max(1, ...(data.value?.topProductos.map(p => p.qty) ?? [1])))
const maxFunnel = computed(() => Math.max(0, ...(data.value?.funnel.map(f => f.count) ?? [0])))

interface DeltaInfo { text: string, class: string }

function delta(actual: number, anterior: number): DeltaInfo | null {
  if (anterior === 0) return actual > 0 ? { text: 'Más que el mes pasado', class: 'text-green-600' } : null
  const pct = Math.round(((actual - anterior) / anterior) * 100)
  if (pct === 0) return { text: 'Igual que el mes pasado', class: 'text-inaka-terra/40' }
  return pct > 0
    ? { text: `▲ ${pct}% vs. mes pasado`, class: 'text-green-600' }
    : { text: `▼ ${Math.abs(pct)}% vs. mes pasado`, class: 'text-red-600' }
}

const deltaPresupuestos = computed(() => data.value ? delta(data.value.presupuestosAceptadosMes.count, data.value.presupuestosAceptadosMesAnterior.count) : null)
const deltaCobrada = computed(() => data.value ? delta(data.value.presupuestosAceptadosMes.senalCobrada, data.value.presupuestosAceptadosMesAnterior.senalCobrada) : null)

const conversionCounts = computed(() => {
  const ganado = data.value?.funnel.find(f => f.status === 'ganado')?.count ?? 0
  const perdido = data.value?.funnel.find(f => f.status === 'perdido')?.count ?? 0
  return { ganado, perdido, total: ganado + perdido }
})
const conversionPct = computed(() => {
  const { ganado, total } = conversionCounts.value
  return total > 0 ? Math.round((ganado / total) * 100) : 0
})
const conversionCaption = computed(() => {
  const { ganado, total } = conversionCounts.value
  return total > 0 ? `${ganado} de ${total} decididos` : 'Aún no hay presupuestos confirmados o cancelados'
})

function formatEUR(n: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function formatFecha(iso: string): string {
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${iso}T00:00:00`))
}

function funnelLabel(status: string): string {
  return (LEAD_STATUS_LABELS as Record<string, string>)[status] ?? status
}

function funnelColor(status: string): string {
  return (LEAD_STATUS_STYLES as Record<string, { bar: string }>)[status]?.bar ?? '#C9A96E'
}
</script>
