<template>
  <section class="py-20 bg-white sm:py-24">
    <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <!-- Acento decorativo (Canva): rama dorada + destellos, fondo blanco plano igual que la sección -->
      <NuxtImg
        src="/media/why-inaka-accent.png"
        alt=""
        aria-hidden="true"
        class="pointer-events-none absolute -top-8 right-0 hidden h-40 w-40 select-none object-cover object-[80%_50%] opacity-90 sm:block sm:h-52 sm:w-52 lg:right-8"
        format="webp"
        quality="80"
        loading="lazy"
      />

      <div class="mb-12 text-center">
        <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-inaka-gold">
          Sin letra pequeña
        </p>
        <h2 class="font-display text-3xl font-bold text-inaka-terra sm:text-4xl">
          Por qué elegir Inaka Moments
        </h2>
        <p class="mx-auto mt-3 max-w-2xl text-inaka-terra/65">
          Precios claros y condiciones honestas desde el primer momento. Esto es lo que siempre está incluido.
        </p>
      </div>

      <div
        ref="grid"
        class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="(rule, i) in rules"
          :key="rule.titulo"
          class="group flex gap-4 rounded-2xl bg-inaka-cream p-6 ring-1 ring-inaka-nude motion-safe:transition-[opacity,transform,box-shadow] motion-safe:duration-500 motion-safe:ease-out hover:shadow-md"
          :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          :style="visible ? { transitionDelay: `${Math.min(i, 5) * 70}ms` } : undefined"
        >
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-inaka-nude">
            <Icon
              :name="rule.icono"
              class="h-5 w-5 text-inaka-gold"
              aria-hidden="true"
            />
          </span>
          <div>
            <h3 class="font-bold text-inaka-terra">
              {{ rule.titulo }}
            </h3>
            <p class="mt-1 text-sm leading-relaxed text-inaka-terra/65">
              {{ rule.texto }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { rules } = useBusinessRules()
const { target: grid, visible } = useScrollReveal()
</script>
