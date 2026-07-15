<template>
  <main class="py-20">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10">
        <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-3">Legal</p>
        <h1 class="font-display text-3xl font-bold text-inaka-terra sm:text-4xl">Aviso legal</h1>
      </div>

      <div class="prose prose-inaka max-w-none space-y-8 text-inaka-terra/75">
        <section class="space-y-4">
          <h2 class="font-display text-xl font-bold text-inaka-terra">1. Datos identificativos</h2>
          <p>
            En cumplimiento con el deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), le informamos de que la empresa titular del sitio web <strong>inakamoments.com</strong> es <strong>Inaka Moments</strong>, con domicilio en Abrera, Cataluña, España, y correo electrónico de contacto: <a href="mailto:nadine.tcae@gmail.com" class="text-inaka-gold hover:underline">nadine.tcae@gmail.com</a>.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="font-display text-xl font-bold text-inaka-terra">2. Propiedad intelectual</h2>
          <p>
            Todos los contenidos del sitio web (textos, fotografías, gráficos, imágenes, logotipos, diseño, código fuente, etc.) están protegidos por derechos de propiedad intelectual pertenecientes a Inaka Moments o a terceros que han autorizado su uso. Queda expresamente prohibido reproducir, modificar, distribuir o comunicar públicamente cualquiera de los contenidos del sitio web sin la autorización expresa y por escrito de Inaka Moments.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="font-display text-xl font-bold text-inaka-terra">3. Exclusión de responsabilidad</h2>
          <p>
            Inaka Moments no se responsabiliza del mal uso que los usuarios puedan hacer de los contenidos del sitio web. Tampoco será responsable de posibles fallos de funcionamiento del sitio web causados por causas de fuerza mayor, acciones de terceros, ni de cualquier daño o perjuicio que pueda derivarse del uso del sitio web.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="font-display text-xl font-bold text-inaka-terra">4. Enlaces a terceros</h2>
          <p>
            El sitio web puede incluir enlaces a páginas web de terceros. Inaka Moments no asume responsabilidad alguna por el contenido, la información o los servicios prestados por dichos terceros, ni garantiza la disponibilidad, exactitud o actualización de sus contenidos.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="font-display text-xl font-bold text-inaka-terra">5. Legislación aplicable</h2>
          <p>
            El presente aviso legal se rige por la legislación española vigente. Para cualquier controversia que pudiera derivarse del acceso o uso de este sitio web, las partes se someten a los Juzgados y Tribunales de Barcelona, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
          </p>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Aviso legal — Inaka Moments',
  meta: [
    {
      name: 'description',
      content: 'Aviso legal de Inaka Moments. Información sobre propiedad intelectual, exención de responsabilidad y legislación aplicable.',
    },
  ],
})
</script>
