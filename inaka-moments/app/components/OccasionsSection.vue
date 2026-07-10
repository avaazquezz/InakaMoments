<template>
  <section v-if="ocasiones.length" class="py-20 bg-inaka-cream sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-inaka-gold">Para cada momento</p>
        <h2 class="text-3xl font-bold text-inaka-terra sm:text-4xl">¿Qué celebras?</h2>
        <p class="mx-auto mt-3 max-w-2xl text-inaka-terra/65">
          Diseñamos la decoración perfecta para cada tipo de evento. Encuentra ideas para el tuyo.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <NuxtLink
          v-for="oc in ocasiones"
          :key="oc.slug"
          :to="`/ocasiones/${oc.slug}`"
          class="group flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-inaka-nude transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <span class="text-4xl transition-transform duration-200 group-hover:scale-110" aria-hidden="true">{{ emoji(oc.event_type) }}</span>
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

const EMOJIS: Record<string, string> = {
  cumpleanos: '🎂', baby_shower: '🍼', bautizo: '🕊️', comunion: '✨',
  graduacion: '🎓', despedida: '🥂', jubilacion: '🌅', corporativo: '🏢',
  boda: '💍', otro: '💡',
}
const emoji = (t: string) => EMOJIS[t] ?? '🎈'
</script>
