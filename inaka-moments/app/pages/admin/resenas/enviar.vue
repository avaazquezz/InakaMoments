<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <NuxtLink to="/admin/resenas" class="text-sm font-medium text-inaka-terra/60 hover:text-inaka-terra">← Volver a Reseñas</NuxtLink>
      <div class="flex flex-wrap items-center gap-3">
        <span class="text-xs text-inaka-terra/50">{{ selected.length }} seleccionados</span>
        <button
          type="button"
          :disabled="selected.length === 0 || sending"
          class="shrink-0 rounded-xl bg-inaka-terra px-4 py-2.5 text-sm font-semibold text-inaka-cream hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          @click="sendSelected"
        >
          {{ sending ? 'Enviando…' : `Enviar solicitudes (${selected.length})` }}
        </button>
      </div>
    </div>

    <p class="text-xs text-inaka-terra/50">
      Clientes con un evento ya celebrado que todavía no tienen una solicitud de reseña enviada (los más recientes ya los cubre el envío automático — aparecerán aquí más adelante si nadie responde).
    </p>

    <div v-if="pending" class="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude" />
    <AdminEmptyState v-else-if="(data ?? []).length === 0" title="No hay clientes pendientes" message="Todos los eventos pasados ya tienen una solicitud de reseña enviada o programada." />

    <!-- Tarjetas (móvil/tablet) -->
    <div v-else class="flex flex-col gap-3 md:hidden">
      <label
        v-for="c in data"
        :key="c.quoteId"
        class="flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-inaka-nude"
      >
        <input type="checkbox" class="mt-1 h-4 w-4 shrink-0 accent-inaka-terra" :value="c.quoteId" v-model="selected" />
        <div class="min-w-0 flex-1">
          <p class="font-semibold text-inaka-terra">{{ c.clientName ?? '—' }}</p>
          <p class="text-xs text-inaka-terra/55">{{ c.eventType ? EVENT_TYPE_LABELS[c.eventType] : '—' }} · {{ c.eventDate }}</p>
          <p class="truncate text-xs text-inaka-terra/55">{{ c.clientEmail }}</p>
        </div>
      </label>
    </div>

    <!-- Tabla (desktop) -->
    <div v-if="!pending && (data ?? []).length" class="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-inaka-nude md:block">
      <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="bg-inaka-cream text-xs uppercase tracking-wide text-inaka-terra/50">
          <tr>
            <th class="w-10 px-4 py-3">
              <input type="checkbox" class="h-4 w-4 accent-inaka-terra" :checked="allSelected" @change="toggleAll" />
            </th>
            <th class="px-4 py-3">Cliente</th>
            <th class="px-4 py-3">Ocasión</th>
            <th class="px-4 py-3">Fecha del evento</th>
            <th class="px-4 py-3">Email</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-inaka-nude/70">
          <tr v-for="c in data" :key="c.quoteId" class="hover:bg-inaka-cream/50">
            <td class="px-4 py-3">
              <input type="checkbox" class="h-4 w-4 accent-inaka-terra" :value="c.quoteId" v-model="selected" />
            </td>
            <td class="px-4 py-3 font-medium text-inaka-terra">{{ c.clientName ?? '—' }}</td>
            <td class="px-4 py-3 text-inaka-terra/60">{{ c.eventType ? EVENT_TYPE_LABELS[c.eventType] : '—' }}</td>
            <td class="px-4 py-3 text-inaka-terra/60">{{ c.eventDate }}</td>
            <td class="px-4 py-3 text-inaka-terra/60">{{ c.clientEmail }}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EVENT_TYPE_LABELS, type EventType } from '~~/shared/eventTypes'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Enviar solicitudes de reseña — Panel Inaka Moments' })

interface ReviewCandidate {
  quoteId: string
  eventId: string
  clientName: string | null
  clientEmail: string
  eventType: EventType | null
  eventDate: string
}

const { data, pending, refresh } = await useFetch<ReviewCandidate[]>('/api/admin/testimonials/candidatos')
const toast = useToast()

const selected = ref<string[]>([])

const allSelected = computed(() => (data.value ?? []).length > 0 && selected.value.length === (data.value ?? []).length)

function toggleAll() {
  selected.value = allSelected.value ? [] : (data.value ?? []).map(c => c.quoteId)
}

const sending = ref(false)
async function sendSelected() {
  sending.value = true
  try {
    const res = await $fetch<{ sent: number, total: number }>('/api/admin/testimonials/enviar', {
      method: 'POST',
      body: { quoteIds: selected.value },
    })
    toast.success(`Enviadas ${res.sent} de ${res.total} solicitudes.`)
    selected.value = []
    await refresh()
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se han podido enviar las solicitudes.')
  }
  finally {
    sending.value = false
  }
}
</script>
