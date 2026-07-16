<template>
  <main>
    <PageHero
      eyebrow="Contacto"
      title="Hablemos de tu evento"
      subtitle="Estamos aquí para ayudarte a diseñar la celebración perfecta. Escríbenos y respondemos en menos de 24 horas."
    />

    <!-- Info + Mapa -->
    <section class="py-20 bg-white">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <!-- Info contacto -->
          <div class="flex flex-col gap-10">
            <div>
              <h2 class="text-2xl font-bold text-inaka-terra mb-6">
                Datos de contacto
              </h2>
              <ul class="flex flex-col gap-5">
                <li class="flex items-start gap-4">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-inaka-gold/15">
                    <Icon
                      name="lucide:mail"
                      class="h-5 w-5 text-inaka-gold"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-inaka-terra">
                      Email
                    </p>
                    <a
                      :href="`mailto:${contacto.email}`"
                      class="text-inaka-terra/65 hover:text-inaka-terra transition-colors"
                    >
                      {{ contacto.email }}
                    </a>
                  </div>
                </li>
                <li
                  v-if="contacto.telefono"
                  class="flex items-start gap-4"
                >
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-inaka-gold/15">
                    <Icon
                      name="lucide:phone"
                      class="h-5 w-5 text-inaka-gold"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-inaka-terra">
                      Teléfono
                    </p>
                    <a
                      :href="`tel:${contacto.telefono}`"
                      class="text-inaka-terra/65 hover:text-inaka-terra transition-colors"
                    >
                      {{ contacto.telefono }}
                    </a>
                  </div>
                </li>
                <li class="flex items-start gap-4">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-inaka-gold/15">
                    <Icon
                      name="lucide:map-pin"
                      class="h-5 w-5 text-inaka-gold"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-inaka-terra">
                      Ubicación
                    </p>
                    <p class="text-inaka-terra/65">
                      {{ contacto.ubicacion }}
                    </p>
                  </div>
                </li>
                <li class="flex items-start gap-4">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-inaka-gold/15">
                    <Icon
                      name="lucide:instagram"
                      class="h-5 w-5 text-inaka-gold"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-inaka-terra">
                      Instagram
                    </p>
                    <a
                      :href="contacto.instagram"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-inaka-terra/65 hover:text-inaka-terra transition-colors"
                    >
                      {{ igHandle }}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Horario -->
            <div>
              <h3 class="text-lg font-bold text-inaka-terra mb-4">
                Horario de atención
              </h3>
              <div class="rounded-xl bg-inaka-cream p-6 ring-1 ring-inaka-nude">
                <div class="flex justify-between items-center py-2 border-b border-inaka-nude last:border-0">
                  <span class="text-sm text-inaka-terra/70">Lunes — Viernes</span>
                  <span class="text-sm font-semibold text-inaka-terra">{{ contacto.horario.lunes_viernes }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-inaka-nude last:border-0">
                  <span class="text-sm text-inaka-terra/70">Sábados</span>
                  <span class="text-sm font-semibold text-inaka-terra">{{ contacto.horario.sabados }}</span>
                </div>
                <div class="flex justify-between items-center py-2 last:border-0">
                  <span class="text-sm text-inaka-terra/70">Domingos</span>
                  <span class="text-sm text-inaka-terra/50">{{ contacto.horario.domingos }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Mapa decorativo -->
          <div class="rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-inaka-beige relative">
            <iframe
              src="https://www.google.com/maps?q=41.5171106,1.8989255&z=13&output=embed"
              width="100%"
              height="100%"
              style="border:0;"
              :allowfullscreen="true"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Ubicación Inaka Moments — Abrera, Cataluña"
              class="absolute inset-0"
            />
          </div>
        </div>
      </div>
    </section>

    <CtaBand
      eyebrow="Sin compromiso"
      title="¿Listo para presupuestar tu evento?"
      subtitle="Elige tus productos, ajusta cantidades y recibe tu presupuesto orientativo al instante con nuestro configurador, o escríbenos directamente por Instagram."
    >
      <BaseButtonLink
        to="/configurador"
        variant="accent"
      >
        Ir al configurador
      </BaseButtonLink>
      <a
        :href="contacto.instagram"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] px-8 py-4 text-sm font-semibold text-white shadow-sm outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-inaka-terra"
      >
        <Icon
          name="lucide:instagram"
          class="h-5 w-5"
          aria-hidden="true"
        />
        Escribir por Instagram
      </a>
    </CtaBand>
  </main>
</template>

<script setup lang="ts">
// Datos de contacto editables por la dueña (site_content.contacto)
const { data: contacto } = useSiteSection('contacto', {
  email: 'nadine.tcae@gmail.com',
  ubicacion: 'Abrera, Cataluña, España',
  instagram: 'https://www.instagram.com/inaka.moments',
  // Sin teléfono público todavía — se añade aquí en cuanto exista.
  telefono: '',
  horario: {
    lunes_viernes: '9:00 — 18:00',
    sabados: '10:00 — 14:00',
    domingos: 'Cerrado',
  },
})

const igHandle = computed(() => `@${contacto.value.instagram.split('/').filter(Boolean).pop()}`)

useHead({
  title: 'Contacto — Inaka Moments',
  meta: [
    {
      name: 'description',
      content: 'Contacta con Inaka Moments para diseñar tu evento. Estamos en Abrera, Cataluña. Respondemos en menos de 24 horas.',
    },
    { property: 'og:title', content: 'Contacto — Inaka Moments' },
    { property: 'og:description', content: 'Contacta con Inaka Moments. Estamos aquí para ayudarte a diseñar la celebración perfecta.' },
    { property: 'og:image', content: 'https://inakamoments.com/logo.png' },
  ],
})
</script>
