<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between border-b border-inaka-nude px-5 py-4">
      <h3 class="flex items-center gap-2 font-display text-base font-bold text-inaka-terra">
        <Icon name="lucide:shopping-cart" class="h-5 w-5 text-inaka-gold" aria-hidden="true" />
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
      <Icon name="lucide:shopping-cart" class="h-8 w-8 text-inaka-terra/30" aria-hidden="true" />
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
                class="flex h-7 w-7 items-center justify-center text-inaka-terra/70 outline-none transition-colors hover:bg-inaka-nude/50 focus-visible:ring-2 focus-visible:ring-inaka-gold"
                :aria-label="`Quitar una unidad de ${view(line)?.name}`"
                @click="incAt(i, -1)"
              >
                <Icon name="lucide:minus" class="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <span class="w-8 text-center text-sm font-semibold text-inaka-terra tabular-nums">{{ line.qty }}</span>
              <button
                type="button"
                class="flex h-7 w-7 items-center justify-center text-inaka-terra/70 outline-none transition-colors hover:bg-inaka-nude/50 focus-visible:ring-2 focus-visible:ring-inaka-gold"
                :aria-label="`Añadir una unidad de ${view(line)?.name}`"
                @click="incAt(i, 1)"
              >
                <Icon name="lucide:plus" class="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              class="rounded text-xs font-medium text-inaka-terra/40 outline-none transition-colors hover:text-red-500 focus-visible:ring-2 focus-visible:ring-inaka-gold"
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
        <Icon name="lucide:gift" class="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> ¡Tu pedido supera los {{ formatEUR(rules.umbral_detallito) }}! Incluye un detallito de regalo.
      </div>
      <div v-if="quote.hasRental" class="flex items-start gap-2 rounded-lg bg-inaka-mauve/12 px-3 py-2 text-xs leading-snug text-inaka-terra/75">
        <Icon name="lucide:refresh-cw" class="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> Incluye alquiler de estructura: se abona una fianza reembolsable (a consultar).
      </div>

      <p class="mt-1 flex items-start gap-1.5 text-[11px] leading-snug text-inaka-terra/45">
        <Icon name="lucide:info" class="mt-px h-3 w-3 shrink-0" aria-hidden="true" />
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
