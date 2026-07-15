<template>
  <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold" :class="colorClass">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
type Kind = 'lead' | 'quote' | 'event' | 'payment'

const props = defineProps<{
  status: string
  kind: Kind
}>()

const COLORS: Record<Kind, Record<string, string>> = {
  lead: Object.fromEntries(LEAD_STATUSES.map(s => [s, LEAD_STATUS_STYLES[s].chip])),
  quote: {
    borrador: 'bg-gray-100 text-gray-600',
    enviado: 'bg-inaka-gold/20 text-inaka-terra',
    aceptado: 'bg-green-100 text-green-700',
    rechazado: 'bg-red-100 text-red-700',
    caducado: 'bg-gray-100 text-gray-500',
  },
  event: Object.fromEntries(EVENT_STATUSES.map(s => [s, EVENT_STATUS_STYLES[s].chip])),
  payment: {
    pendiente: 'bg-inaka-gold/20 text-inaka-terra',
    pagado: 'bg-green-100 text-green-700',
    reembolsado: 'bg-inaka-mauve/20 text-inaka-terra',
    fallido: 'bg-red-100 text-red-700',
  },
}

const LABELS: Partial<Record<Kind, Record<string, string>>> = {
  event: EVENT_STATUS_LABELS,
  lead: LEAD_STATUS_LABELS,
}

const colorClass = computed(() => COLORS[props.kind][props.status] ?? 'bg-gray-100 text-gray-600')
const label = computed(() => LABELS[props.kind]?.[props.status] ?? (props.status.charAt(0).toUpperCase() + props.status.slice(1)))
</script>
