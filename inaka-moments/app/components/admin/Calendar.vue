<template>
  <div class="rounded-2xl border border-inaka-beige bg-white p-4">
    <div class="mb-3 flex items-center justify-between">
      <button type="button" class="flex h-8 w-8 items-center justify-center rounded-full text-inaka-terra/70 hover:bg-inaka-nude/50" aria-label="Mes anterior" @click="goPrev">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <p class="text-sm font-semibold capitalize text-inaka-terra">{{ monthLabel }}</p>
      <button type="button" class="flex h-8 w-8 items-center justify-center rounded-full text-inaka-terra/70 hover:bg-inaka-nude/50" aria-label="Mes siguiente" @click="goNext">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>

    <div class="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-inaka-terra/50">
      <span v-for="wd in weekdayLabels" :key="wd">{{ wd }}</span>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="cell in grid"
        :key="cell.iso"
        type="button"
        class="flex min-h-[84px] flex-col items-start gap-1 rounded-lg border p-1.5 text-left transition-colors"
        :class="[
          cell.inMonth ? 'border-inaka-beige/70 bg-white hover:bg-inaka-nude/20' : 'border-transparent bg-inaka-cream/60 text-inaka-terra/30',
          cell.iso === todayIso ? 'ring-1 ring-inaka-gold' : '',
        ]"
        @click="$emit('dayClick', cell.iso)"
      >
        <span class="text-xs font-semibold" :class="cell.inMonth ? 'text-inaka-terra' : 'text-inaka-terra/30'">{{ cell.date.getDate() }}</span>
        <span
          v-for="ev in cell.events.slice(0, 2)"
          :key="ev.id"
          class="w-full truncate rounded px-1 py-0.5 text-[10px] font-medium"
          :class="chipClass(ev.status)"
          @click.stop="$emit('eventClick', ev.id)"
        >
          {{ ev.title }}
        </span>
        <span v-if="cell.events.length > 2" class="text-[10px] font-medium text-inaka-terra/50">+{{ cell.events.length - 2 }} más</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatISODate } from '~~/shared/dates'

export interface CalendarEvent {
  id: string
  date: string
  title: string
  status: string
}

const props = defineProps<{
  year: number
  month: number // 0-indexed
  events: CalendarEvent[]
}>()

const emit = defineEmits<{
  'update:month': [{ year: number, month: number }]
  'dayClick': [iso: string]
  'eventClick': [id: string]
}>()

const weekdayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const todayIso = formatISODate(new Date())

const eventsByDate = computed(() => {
  const map = new Map<string, CalendarEvent[]>()
  for (const ev of props.events) {
    const list = map.get(ev.date) ?? []
    list.push(ev)
    map.set(ev.date, list)
  }
  return map
})

interface DayCell {
  date: Date
  iso: string
  inMonth: boolean
  events: CalendarEvent[]
}

const grid = computed<DayCell[]>(() => {
  const first = new Date(props.year, props.month, 1)
  const startOffset = (first.getDay() + 6) % 7
  const start = new Date(props.year, props.month, 1 - startOffset)

  const cells: DayCell[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    const iso = formatISODate(d)
    cells.push({
      date: d,
      iso,
      inMonth: d.getMonth() === props.month,
      events: eventsByDate.value.get(iso) ?? [],
    })
  }
  return cells
})

const monthLabel = computed(() => {
  const label = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date(props.year, props.month, 1))
  return label.charAt(0).toUpperCase() + label.slice(1)
})

function goPrev() {
  const d = new Date(props.year, props.month - 1, 1)
  emit('update:month', { year: d.getFullYear(), month: d.getMonth() })
}

function goNext() {
  const d = new Date(props.year, props.month + 1, 1)
  emit('update:month', { year: d.getFullYear(), month: d.getMonth() })
}

function chipClass(status: string): string {
  if (status === 'confirmado') return 'bg-inaka-terra text-inaka-cream'
  if (status === 'tentativo') return 'bg-inaka-gold/30 text-inaka-terra'
  if (status === 'cancelado') return 'bg-red-100 text-red-700 line-through'
  return 'bg-inaka-nude text-inaka-terra/70' // completado
}
</script>
