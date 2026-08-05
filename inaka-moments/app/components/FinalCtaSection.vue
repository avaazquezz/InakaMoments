<template>
  <section class="relative overflow-hidden bg-inaka-terra py-24 text-inaka-cream">
    <div
      class="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <div class="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-inaka-mauve/20 blur-3xl" />
      <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/15 blur-3xl" />

      <!-- Acentos dorados (Canva): ocupan las otras dos esquinas, sin pisar los círculos de blur.
           hue-rotate/saturate/brightness corrigen el fill (el plan Free de Canva no exporta PNG
           transparente y el color generado no era exacto a bg-inaka-terra) para poder subir la
           opacidad y que el dibujo se lea bien, en vez de esconderlo bajo blur pesado. -->
      <NuxtImg
        src="/media/final-cta-accent.png"
        alt=""
        class="cta-accent cta-accent--tl absolute left-0 top-0 hidden h-64 w-64 select-none object-cover object-[0%_0%] opacity-80 hue-rotate-[-8deg] saturate-[.75] brightness-[.83] sm:block sm:h-96 sm:w-96"
        format="webp"
        quality="80"
        loading="lazy"
      />
      <NuxtImg
        src="/media/final-cta-accent.png"
        alt=""
        class="cta-accent cta-accent--br absolute bottom-0 right-0 hidden h-64 w-64 select-none object-cover object-[100%_100%] opacity-80 hue-rotate-[-8deg] saturate-[.75] brightness-[.83] sm:block sm:h-96 sm:w-96"
        format="webp"
        quality="80"
        loading="lazy"
      />
    </div>

    <div
      ref="content"
      class="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
    >
      <p
        class="mb-4 text-sm font-semibold uppercase tracking-widest text-inaka-gold motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-out motion-safe:delay-0"
        :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      >
        Tú eliges, nosotros creamos
      </p>
      <h2
        class="font-display text-3xl font-bold sm:text-4xl lg:text-5xl motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-out motion-safe:delay-100"
        :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      >
        ¿List@ para diseñar tu evento?
      </h2>
      <p
        class="mx-auto mt-4 max-w-2xl text-lg text-inaka-cream/75 motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-out motion-safe:delay-150"
        :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      >
        Combina lo que más te guste en el configurador y ve el precio al instante. Sin compromiso: te preparamos una propuesta a medida.
      </p>
      <div
        class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-out motion-safe:delay-200"
        :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      >
        <BaseButtonLink
          to="/configurador"
          variant="accent"
        >
          Configurar mi presupuesto
        </BaseButtonLink>
        <BaseButtonLink
          to="/contacto"
          variant="outline"
          :icon="undefined"
        >
          Hablar con nosotras
        </BaseButtonLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Sección puramente presentacional (banda de cierre de la home).
const { target: content, visible } = useScrollReveal()
</script>

<style scoped>
/* El export de Canva no coincide exactamente con el terracota de la sección (plan Free, sin PNG
   transparente) — el fade radial hacia la esquina opuesta disimula la diferencia de color. */
.cta-accent--tl {
  -webkit-mask-image: radial-gradient(circle at top left, black 12%, transparent 70%);
  mask-image: radial-gradient(circle at top left, black 12%, transparent 70%);
}
.cta-accent--br {
  -webkit-mask-image: radial-gradient(circle at bottom right, black 12%, transparent 70%);
  mask-image: radial-gradient(circle at bottom right, black 12%, transparent 70%);
}
</style>
