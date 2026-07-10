<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between border-b border-inaka-nude px-5 py-4">
      <h3 class="flex items-center gap-2 text-base font-bold text-inaka-terra">
        <svg class="h-5 w-5 text-inaka-gold" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        Tu presupuesto
      </h3>
      <button
        v-if="count > 0"
        type="button"
        class="text-xs font-medium text-inaka-terra/40 transition-colors hover:text-red-500"
        @click="clear"
      >
        Vaciar
      </button>
    </div>

    <!-- Estado vacío -->
    <div v-if="count === 0" class="flex flex-col items-center gap-2 px-5 py-10 text-center">
      <span class="text-3xl opacity-60" aria-hidden="true">🎈</span>
      <p class="text-sm text-inaka-terra/55">Aún no has añadido productos.</p>
      <p class="text-xs text-inaka-terra/40">Ve al paso «Productos» y crea tu combinación.</p>
    </div>

    <!-- Líneas -->
    <ul v-else class="flex flex-col divide-y divide-inaka-nude/70 px-5">
      <li v-for="(line, i) in state.lines" :key="i" class="flex gap-3 py-3">
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-inaka-terra">{{ view(line)?.name }}</p>
          <p v-if="variantText(line)" class="mt-0.5 truncate text-xs text-inaka-terra/55">{{ variantText(line) }}</p>

          <!-- Stepper de cantidad -->
          <div class="mt-2 flex items-center gap-2">
            <div class="flex items-center rounded-lg border border-inaka-beige">
              <button
                type="button"
                class="flex h-7 w-7 items-center justify-center text-inaka-terra/70 transition-colors hover:bg-inaka-nude/50"
                :aria-label="`Quitar una unidad de ${view(line)?.name}`"
                @click="incAt(i, -1)"
              >
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" /></svg>
              </button>
              <span class="w-8 text-center text-sm font-semibold text-inaka-terra tabular-nums">{{ line.qty }}</span>
              <button
                type="button"
                class="flex h-7 w-7 items-center justify-center text-inaka-terra/70 transition-colors hover:bg-inaka-nude/50"
                :aria-label="`Añadir una unidad de ${view(line)?.name}`"
                @click="incAt(i, 1)"
              >
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
            <button
              type="button"
              class="text-xs font-medium text-inaka-terra/40 transition-colors hover:text-red-500"
              @click="removeAt(i)"
            >
              Quitar
            </button>
          </div>
        </div>

        <div class="shrink-0 text-right">
          <p class="text-sm font-bold text-inaka-terra whitespace-nowrap">
            <template v-if="view(line)?.consulta">A consultar</template>
            <template v-else>{{ formatEUR(view(line)!.line_total!) }}</template>
          </p>
          <p v-if="!view(line)?.consulta && line.qty > 1" class="text-[11px] text-inaka-terra/45 whitespace-nowrap">
            {{ formatEUR(view(line)!.unit_price!) }} / ud
          </p>
        </div>
      </li>
    </ul>

    <!-- Totales -->
    <div v-if="count > 0" class="mt-1 flex flex-col gap-2 border-t border-inaka-nude px-5 py-4">
      <div class="flex items-center justify-between text-sm">
        <span class="text-inaka-terra/60">Subtotal</span>
        <span class="font-semibold text-inaka-terra">{{ formatEUR(quote.itemsSubtotal) }}</span>
      </div>

      <div
        v-for="adj in quote.adjustments"
        :key="adj.key"
        class="flex items-center justify-between text-sm"
      >
        <span class="text-inaka-terra/60">{{ adj.label }}</span>
        <span class="font-medium text-inaka-terra/80">
          <template v-if="adj.amount == null">{{ adj.note ?? 'a consultar' }}</template>
          <template v-else>+ {{ formatEUR(adj.amount) }}</template>
        </span>
      </div>

      <div class="mt-1 flex items-center justify-between border-t border-inaka-nude pt-3">
        <span class="text-sm font-bold text-inaka-terra">Total estimado</span>
        <span class="text-xl font-extrabold text-inaka-terra">
          {{ formatEUR(quote.total) }}<span v-if="quote.hasConsulta" class="align-super text-sm">*</span>
        </span>
      </div>

      <p v-if="quote.hasConsulta" class="text-[11px] leading-snug text-inaka-terra/45">
        * Incluye conceptos «a consultar» que cerraremos contigo. El total es orientativo.
      </p>

      <!-- Avisos -->
      <div v-if="quote.detallito" class="mt-1 flex items-center gap-2 rounded-lg bg-inaka-gold/12 px-3 py-2 text-xs font-medium text-inaka-terra">
        <span aria-hidden="true">🎁</span> ¡Tu pedido supera los {{ formatEUR(rules.umbral_detallito) }}! Incluye un detallito de regalo.
      </div>
      <div v-if="quote.hasRental" class="flex items-start gap-2 rounded-lg bg-inaka-mauve/12 px-3 py-2 text-xs leading-snug text-inaka-terra/75">
        <span aria-hidden="true">🔁</span> Incluye alquiler de estructura: se abona una fianza reembolsable (a consultar).
      </div>

      <p class="mt-1 flex items-start gap-1.5 text-[11px] leading-snug text-inaka-terra/45">
        <svg class="mt-px h-3 w-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Montaje incluido. Presupuesto sujeto a confirmación de disponibilidad; para reservar la fecha se abona una señal al agendar.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectedLine } from '~~/shared/configurator'

const { state, quote, count, rules, incAt, removeAt, clear, describeLine } = useConfigurator()

// Cache de vistas por render para no recalcular describeLine múltiples veces.
function view(line: SelectedLine) {
  return describeLine(line)
}

function variantText(line: SelectedLine): string {
  const v = view(line)
  if (!v) return ''
  return [v.tier, v.size, ...(v.options ?? [])].filter(Boolean).join(' · ')
}
</script>
