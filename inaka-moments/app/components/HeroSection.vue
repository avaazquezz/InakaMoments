<template>
  <section class="flex min-h-screen items-center">
    <div class="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

        <!-- Text column -->
        <div class="flex flex-col gap-6">
          <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold">
            Eventos con alma
          </p>

          <h1 class="text-4xl font-bold leading-tight text-inaka-terra sm:text-5xl lg:text-6xl">
            Momentos que <br class="hidden sm:block" />
            <span class="text-inaka-mauve">perduran</span>
          </h1>

          <p class="max-w-prose text-base leading-relaxed text-inaka-terra/80 sm:text-lg">
            Diseñamos experiencias únicas para bodas, celebraciones y eventos corporativos.
            Cada detalle cuidado con mimo para que tu historia sea inolvidable.
          </p>

          <!-- CTA buttons -->
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              class="rounded-md bg-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-cream shadow-sm transition-opacity hover:opacity-90"
            >
              Diseñar mi evento
            </button>

            <button
              type="button"
              class="rounded-md border border-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-terra transition-colors hover:bg-inaka-nude"
            >
              Descargar Dossier
            </button>
          </div>
        </div>

        <!-- Image placeholder column -->
        <div
          class="h-80 w-full rounded-2xl bg-gradient-to-tr from-inaka-beige to-inaka-nude lg:h-[480px]"
          aria-hidden="true"
        />

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
