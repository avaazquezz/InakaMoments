<template>
  <main v-if="pack">
    <section class="py-16 bg-inaka-cream sm:py-24">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav class="mb-8 text-sm text-inaka-terra/50" aria-label="Migas de pan">
          <NuxtLink to="/packs" class="hover:text-inaka-terra transition-colors">Packs</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-inaka-terra/80">{{ pack.name }}</span>
        </nav>

        <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-inaka-nude sm:p-12">
          <div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h1 class="text-3xl font-bold text-inaka-terra sm:text-4xl">{{ pack.name }}</h1>
            <span v-if="pack.price != null" class="rounded-full bg-inaka-terra px-6 py-2 text-xl font-bold text-inaka-cream">
              {{ formatEUR(pack.price) }}
            </span>
          </div>

          <p class="mb-8 text-lg text-inaka-terra/70 leading-relaxed">{{ pack.description }}</p>

          <div class="mb-8 rounded-2xl bg-inaka-cream p-6 ring-1 ring-inaka-nude">
            <p class="mb-4 text-sm font-semibold uppercase tracking-widest text-inaka-gold">El pack incluye</p>
            <ul class="flex flex-col gap-3">
              <li
                v-for="item in packIncludes(pack)"
                :key="item"
                class="flex items-start gap-3 text-inaka-terra/75"
              >
                <span class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-inaka-gold/20">
                  <svg class="h-3 w-3 text-inaka-gold" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
                {{ item }}
              </li>
            </ul>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <NuxtLink
              to="/#lead-wizard"
              class="rounded-md bg-inaka-terra px-8 py-3.5 text-center text-sm font-semibold text-inaka-cream shadow-sm transition-opacity hover:opacity-90"
            >
              Reservar este pack
            </NuxtLink>
            <NuxtLink
              to="/catalogo"
              class="rounded-md border border-inaka-terra px-8 py-3.5 text-center text-sm font-semibold text-inaka-terra transition-colors hover:bg-inaka-nude"
            >
              Ver productos sueltos
            </NuxtLink>
          </div>

          <p class="mt-6 text-xs text-inaka-terra/50">
            Montaje incluido · Reserva con mínimo 1 mes de antelación · El pago se realiza al agendar
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: pack } = await usePack(slug)

if (!pack.value) {
  throw createError({ statusCode: 404, statusMessage: 'Pack no encontrado', fatal: true })
}

useHead(() => ({
  title: `${pack.value?.name} — Packs Inaka Moments`,
  meta: [
    { name: 'description', content: `${pack.value?.description ?? ''} ${pack.value?.price != null ? formatEUR(pack.value.price) : ''}. Decoración de eventos en Abrera y Barcelona.` },
    { property: 'og:title', content: `${pack.value?.name} — Inaka Moments` },
    { property: 'og:description', content: pack.value?.description ?? '' },
  ],
}))
</script>
