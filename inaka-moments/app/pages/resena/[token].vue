<template>
  <main>
    <section class="relative overflow-hidden bg-inaka-cream py-24 sm:py-32">
      <div
        class="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div class="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-inaka-mauve/10 blur-3xl" />
        <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-inaka-gold/10 blur-3xl" />
      </div>
      <div class="relative mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        <div
          v-if="pending"
          class="py-16 text-center text-inaka-terra/50"
        >
          Cargando…
        </div>

        <!-- Enlace no válido -->
        <div
          v-else-if="!info"
          class="rounded-2xl bg-white p-8 text-center ring-1 ring-inaka-nude"
        >
          <span class="mb-4 block text-5xl">🙈</span>
          <h1 class="mb-3 font-display text-2xl font-bold text-inaka-terra">
            Este enlace no es válido
          </h1>
          <p class="text-inaka-terra/60">
            Puede que haya caducado o esté mal copiado. Escríbenos por Instagram si crees que es un error.
          </p>
        </div>

        <!-- Ya respondido -->
        <div
          v-else-if="submitted || info.alreadyResponded"
          class="rounded-2xl bg-white p-8 text-center ring-1 ring-inaka-nude"
        >
          <span class="mb-4 block text-5xl">💛</span>
          <h1 class="mb-3 font-display text-2xl font-bold text-inaka-terra">
            ¡Gracias por tu opinión!
          </h1>
          <p class="text-inaka-terra/60">
            Ya la tenemos apuntada. La revisaremos y la publicaremos en la web muy pronto.
          </p>
        </div>

        <!-- Formulario -->
        <div
          v-else
          class="rounded-2xl bg-white p-8 ring-1 ring-inaka-nude"
        >
          <p class="mb-1 text-sm font-semibold uppercase tracking-widest text-inaka-gold">
            Tu opinión nos importa
          </p>
          <h1 class="mb-2 font-display text-2xl font-bold text-inaka-terra">
            ¿Qué tal fue{{ info.eventTypeLabel ? ` tu ${info.eventTypeLabel.toLowerCase()}` : '' }}?
          </h1>
          <p class="mb-6 text-sm text-inaka-terra/60">
            Solo lleva un minuto. Tu opinión ayuda a que más gente confíe en nosotras.
          </p>

          <form
            class="flex flex-col gap-5"
            @submit.prevent="submit"
          >
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-inaka-terra">Tu nombre</label>
              <input
                v-model="form.author"
                type="text"
                required
                class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra focus-visible:ring-2 focus-visible:ring-inaka-gold"
              >
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-inaka-terra">Puntuación</label>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                <div
                  class="flex gap-1"
                  @mouseleave="hoverRating = null"
                >
                  <!-- SVG en línea (no <Icon>): el icono va como máscara CSS y
                       no se puede rellenar; relleno vs contorno es lo que deja
                       claro cuántas estrellas hay marcadas. -->
                  <button
                    v-for="s in 5"
                    :key="s"
                    type="button"
                    class="rounded p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-inaka-gold"
                    :aria-label="`${s} de 5 estrellas`"
                    :aria-pressed="form.rating === s"
                    @mouseenter="hoverRating = s"
                    @click="form.rating = s"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      class="h-9 w-9 transition-transform duration-150"
                      :class="s <= shownRating ? 'scale-110 fill-inaka-gold stroke-inaka-gold' : 'fill-transparent stroke-inaka-beige'"
                      stroke-width="1.75"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z" />
                    </svg>
                  </button>
                </div>
                <span
                  class="text-sm font-semibold"
                  :class="shownRating ? 'text-inaka-terra' : 'text-inaka-terra/50'"
                  aria-live="polite"
                >
                  {{ shownRating ? `${shownRating} de 5 · ${RATING_LABELS[shownRating - 1]}` : 'Toca una estrella' }}
                </span>
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-inaka-terra">Cuéntanos tu experiencia</label>
              <textarea
                v-model="form.quote"
                rows="4"
                required
                minlength="10"
                placeholder="¿Qué fue lo que más te gustó?"
                class="resize-none rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra focus-visible:ring-2 focus-visible:ring-inaka-gold"
              />
            </div>

            <!-- Honeypot: invisible para personas, los bots lo rellenan -->
            <div
              class="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
              aria-hidden="true"
            >
              <label for="resena-website">No rellenes este campo</label>
              <input
                id="resena-website"
                v-model="form.website"
                type="text"
                name="website"
                tabindex="-1"
                autocomplete="off"
              >
            </div>

            <p
              v-if="submitError"
              class="text-sm text-red-500"
            >
              {{ submitError }}
            </p>

            <button
              type="submit"
              :disabled="submitting"
              class="rounded-md bg-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-cream shadow-sm outline-none transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-inaka-gold focus-visible:ring-offset-2"
            >
              {{ submitting ? 'Enviando…' : 'Enviar mi opinión' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Tu opinión — Inaka Moments',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

interface ReviewRequestInfo { alreadyResponded: boolean, authorDefault: string | null, eventTypeLabel: string | null }

const route = useRoute()
const token = route.params.token as string

// Un 404 (enlace no válido) es un estado normal de esta página: useFetch deja
// `info` en null sin lanzar, la plantilla ya distingue ese caso con `v-else-if="!info"`.
const { data: info, pending } = await useFetch<ReviewRequestInfo>(`/api/resena/${token}`)

const form = reactive({ author: '', rating: null as number | null, quote: '', website: '' })

const RATING_LABELS = ['Mejorable', 'Regular', 'Bien', 'Muy bien', '¡Excelente!']
// El hover solo previsualiza; lo que se envía es siempre form.rating.
const hoverRating = ref<number | null>(null)
const shownRating = computed(() => hoverRating.value ?? form.rating ?? 0)
watchEffect(() => {
  if (info.value?.authorDefault) form.author = info.value.authorDefault
})

const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

async function submit() {
  submitting.value = true
  submitError.value = ''
  try {
    await $fetch(`/api/resena/${token}`, { method: 'POST', body: form })
    submitted.value = true
  }
  catch (err) {
    submitError.value = apiErrorMessage(err, 'No se ha podido enviar tu opinión. Inténtalo de nuevo.')
  }
  finally {
    submitting.value = false
  }
}
</script>
