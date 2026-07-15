<template>
  <section v-if="ocasiones.length" class="py-20 bg-inaka-cream sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-inaka-gold">Para cada momento</p>
        <h2 class="font-display text-3xl font-bold text-inaka-terra sm:text-4xl">¿Qué celebras?</h2>
        <p class="mx-auto mt-3 max-w-2xl text-inaka-terra/65">
          Diseñamos la decoración perfecta para cada tipo de evento. Encuentra ideas para el tuyo.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <NuxtLink
          v-for="oc in ocasiones"
          :key="oc.slug"
          :to="`/ocasiones/${oc.slug}`"
          class="group flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-inaka-nude outline-none transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-inaka-gold"
        >
          <Icon
            :name="icon(oc.event_type)"
            class="h-9 w-9 text-inaka-gold transition-transform duration-200 group-hover:scale-110"
            aria-hidden="true"
          />
          <span class="text-sm font-bold text-inaka-terra group-hover:text-inaka-gold transition-colors">
            {{ EVENT_TYPE_LABELS[oc.event_type] ?? oc.title }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: ocasiones } = useOccasions()

const ICONS: Record<string, string> = {
  cumpleanos: 'lucide:cake', baby_shower: 'lucide:baby', bautizo: 'lucide:church', comunion: 'lucide:sparkles',
  graduacion: 'lucide:graduation-cap', despedida: 'lucide:martini', jubilacion: 'lucide:sunrise', corporativo: 'lucide:building-2',
  boda: 'lucide:gem', otro: 'lucide:lightbulb',
}
const icon = (t: string) => ICONS[t] ?? 'lucide:party-popper'
</script>
