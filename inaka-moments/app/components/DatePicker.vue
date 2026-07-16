<template>
  <div
    :id="id"
    role="group"
    :aria-label="ariaLabel ?? 'Selector de fecha'"
    class="w-full rounded-2xl border border-inaka-beige bg-white p-4"
  >
    <div class="mb-3 flex items-center justify-between">
      <button
        type="button"
        :disabled="!canGoPrev"
        aria-label="Mes anterior"
        class="flex h-8 w-8 items-center justify-center rounded-full text-inaka-terra/70 outline-none transition-colors hover:bg-inaka-nude/50 focus-visible:ring-2 focus-visible:ring-inaka-gold disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        @click="goPrev"
      >
        <Icon
          name="lucide:chevron-left"
          class="h-4 w-4"
          aria-hidden="true"
        />
      </button>
      <p class="text-sm font-semibold capitalize text-inaka-terra">
        {{ monthLabel }}
      </p>
      <button
        type="button"
        :disabled="!canGoNext"
        aria-label="Mes siguiente"
        class="flex h-8 w-8 items-center justify-center rounded-full text-inaka-terra/70 outline-none transition-colors hover:bg-inaka-nude/50 focus-visible:ring-2 focus-visible:ring-inaka-gold disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        @click="goNext"
      >
        <Icon
          name="lucide:chevron-right"
          class="h-4 w-4"
          aria-hidden="true"
        />
      </button>
    </div>

    <div class="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-inaka-terra/50">
      <span
        v-for="wd in weekdayLabels"
        :key="wd"
      >{{ wd }}</span>
    </div>

    <div
      role="grid"
      class="grid grid-cols-7 gap-1"
    >
      <button
        v-for="cell in grid"
        :key="cell.iso"
        type="button"
        role="gridcell"
        :disabled="cell.disabled"
        :aria-selected="cell.iso === modelValue"
        :aria-current="cell.iso === todayIso ? 'date' : undefined"
        :aria-label="fullLabel(cell.date)"
        class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inaka-gold"
        :class="dayClasses(cell)"
        @click="selectDay(cell)"
      >
        {{ cell.date.getDate() }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatISODate } from '~~/shared/dates'

const props = defineProps<{
  modelValue: string
  min?: string
  max?: string
  id?: string
  ariaLabel?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

interface DayCell {
  date: Date
  iso: string
  inMonth: boolean
  disabled: boolean
}

const weekdayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const todayIso = formatISODate(new Date())

function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return null
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

function initialViewDate(): Date {
  const parsed = props.modelValue ? parseISODate(props.modelValue) : null
  if (parsed) return parsed
  const minD = props.min ? parseISODate(props.min) : null
  if (minD) return minD
  return new Date()
}

const initial = initialViewDate()
const viewYear = ref(initial.getFullYear())
const viewMonth = ref(initial.getMonth())

// Si `min` cambia (p. ej. llegan las reglas del negocio tras el fetch inicial)
// y el mes visible queda por debajo del nuevo mínimo, saltamos a su mes.
watch(() => props.min, (newMin) => {
  if (!newMin) return
  const d = parseISODate(newMin)
  if (!d) return
  const minKey = d.getFullYear() * 12 + d.getMonth()
  const viewKey = viewYear.value * 12 + viewMonth.value
  if (viewKey < minKey) {
    viewYear.value = d.getFullYear()
    viewMonth.value = d.getMonth()
  }
})

const canGoPrev = computed(() => {
  if (!props.min) return true
  const d = parseISODate(props.min)
  if (!d) return true
  const minKey = d.getFullYear() * 12 + d.getMonth()
  const viewKey = viewYear.value * 12 + viewMonth.value
  return viewKey > minKey
})

const canGoNext = computed(() => {
  if (!props.max) return true
  const d = parseISODate(props.max)
  if (!d) return true
  const maxKey = d.getFullYear() * 12 + d.getMonth()
  const viewKey = viewYear.value * 12 + viewMonth.value
  return viewKey < maxKey
})

function goPrev() {
  if (!canGoPrev.value) return
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  }
  else viewMonth.value--
}

function goNext() {
  if (!canGoNext.value) return
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  }
  else viewMonth.value++
}

function isDisabled(iso: string): boolean {
  if (props.min && iso < props.min) return true
  if (props.max && iso > props.max) return true
  return false
}

const grid = computed<DayCell[]>(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const startOffset = (first.getDay() + 6) % 7 // Lunes = 0
  const start = new Date(viewYear.value, viewMonth.value, 1 - startOffset)

  const cells: DayCell[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    const iso = formatISODate(d)
    cells.push({
      date: d,
      iso,
      inMonth: d.getMonth() === viewMonth.value,
      disabled: isDisabled(iso),
    })
  }
  return cells
})

const monthLabel = computed(() => {
  const label = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })
    .format(new Date(viewYear.value, viewMonth.value, 1))
  return label.charAt(0).toUpperCase() + label.slice(1)
})

function fullLabel(d: Date): string {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' }).format(d)
}

function dayClasses(cell: DayCell): string[] {
  const classes: string[] = []
  if (!cell.inMonth) classes.push('text-inaka-terra/25')

  if (cell.disabled) {
    classes.push('opacity-30 cursor-not-allowed text-inaka-terra/30')
  }
  else if (cell.iso === props.modelValue) {
    classes.push('bg-inaka-terra text-inaka-cream')
  }
  else {
    classes.push('text-inaka-terra hover:bg-inaka-nude/50')
    if (cell.iso === todayIso) classes.push('ring-1 ring-inaka-gold/60')
  }
  return classes
}

function selectDay(cell: DayCell) {
  if (cell.disabled) return
  emit('update:modelValue', cell.iso)
}
</script>
