<template>
  <AdminModal
    :open="open"
    title="Enlace de reseña"
    @close="$emit('close')"
  >
    <form
      v-if="!token"
      class="flex flex-col gap-4"
      @submit.prevent="create"
    >
      <p class="text-sm text-inaka-terra/70">
        Elige un evento reciente o escribe el nombre del cliente, crea el enlace y envíaselo por WhatsApp, Instagram o email.
      </p>

      <div class="flex flex-col gap-1.5">
        <p class="text-xs font-semibold text-inaka-terra/80">
          Eventos de los últimos 14 días
        </p>
        <p
          v-if="recentPending"
          class="text-xs text-inaka-terra/55"
        >
          Cargando…
        </p>
        <p
          v-else-if="recentError"
          class="text-xs text-red-500"
        >
          {{ recentError }}
        </p>
        <p
          v-else-if="recent.length === 0"
          class="text-xs text-inaka-terra/55"
        >
          No hay eventos celebrados en los últimos 14 días: escribe el nombre a mano.
        </p>
        <ul
          v-else
          class="max-h-60 divide-y divide-inaka-nude/70 overflow-y-auto rounded-xl ring-1 ring-inaka-nude"
        >
          <li
            v-for="e in recent"
            :key="e.eventId"
          >
            <button
              v-if="!e.request"
              type="button"
              class="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors"
              :class="selectedEventId === e.eventId ? 'bg-inaka-nude/40' : 'hover:bg-inaka-cream'"
              :aria-pressed="selectedEventId === e.eventId"
              @click="selectEvent(e)"
            >
              <span class="min-w-0">
                <span class="block truncate text-sm font-medium text-inaka-terra">{{ e.clientName || e.title }}</span>
                <span class="block text-xs text-inaka-terra/55">{{ eventMeta(e) }}</span>
              </span>
              <span
                class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                :class="selectedEventId === e.eventId ? 'border-inaka-terra' : 'border-inaka-beige'"
                aria-hidden="true"
              >
                <span
                  v-if="selectedEventId === e.eventId"
                  class="h-2.5 w-2.5 rounded-full bg-inaka-terra"
                />
              </span>
            </button>
            <div
              v-else
              class="flex items-center justify-between gap-3 px-3 py-2.5"
            >
              <span class="min-w-0">
                <span class="block truncate text-sm font-medium text-inaka-terra/60">{{ e.clientName || e.title }}</span>
                <span class="block text-xs text-inaka-terra/45">{{ eventMeta(e) }}</span>
              </span>
              <span
                v-if="e.request.responded"
                class="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700"
              >
                Ya respondió
              </span>
              <button
                v-else
                type="button"
                class="shrink-0 text-xs font-semibold text-inaka-gold hover:underline"
                @click="showLink(e.request.token, e.clientName)"
              >
                Enlace ya creado · Reenviar
              </button>
            </div>
          </li>
        </ul>
      </div>

      <AdminField
        v-slot="{ id }"
        label="Nombre del cliente"
      >
        <input
          :id="id"
          v-model="form.author"
          type="text"
          maxlength="120"
          placeholder="Opcional"
          class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
        >
        <span class="text-xs text-inaka-terra/55">Le aparecerá ya escrito en el formulario y te sirve para saber de quién es cada enlace.</span>
      </AdminField>
      <AdminField
        v-slot="{ id }"
        label="Ocasión"
      >
        <select
          :id="id"
          v-model="form.event_type"
          class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
        >
          <option :value="null">
            —
          </option>
          <option
            v-for="et in OCCASIONS"
            :key="et"
            :value="et"
          >
            {{ EVENT_TYPE_LABELS[et] }}
          </option>
        </select>
        <span class="text-xs text-inaka-terra/55">Personaliza la pregunta: «¿Qué tal fue tu boda?»</span>
      </AdminField>
      <div class="mt-2 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          class="rounded-lg border border-inaka-beige px-4 py-2 text-sm font-medium text-inaka-terra/80 hover:bg-inaka-nude/50"
          @click="$emit('close')"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="creating"
          class="rounded-lg bg-inaka-terra px-4 py-2 text-sm font-semibold text-inaka-cream hover:opacity-90 disabled:opacity-50"
        >
          {{ creating ? 'Creando…' : 'Crear enlace' }}
        </button>
      </div>
    </form>

    <div
      v-else
      class="flex flex-col gap-4"
    >
      <AdminField
        v-slot="{ id }"
        label="Enlace"
      >
        <div class="flex gap-2">
          <input
            :id="id"
            :value="url"
            type="text"
            readonly
            class="min-w-0 flex-1 rounded-lg border border-inaka-beige bg-inaka-cream px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
            @focus="($event.target as HTMLInputElement).select()"
          >
          <button
            ref="copyLinkBtn"
            type="button"
            class="flex shrink-0 items-center gap-1.5 rounded-lg bg-inaka-terra px-3 py-2 text-sm font-semibold text-inaka-cream hover:opacity-90"
            @click="copy(url, 'Enlace copiado.')"
          >
            <Icon
              name="lucide:copy"
              class="h-4 w-4"
              aria-hidden="true"
            />
            Copiar
          </button>
        </div>
      </AdminField>

      <AdminField
        v-slot="{ id }"
        label="Mensaje (puedes retocarlo antes de enviarlo)"
      >
        <textarea
          :id="id"
          v-model="message"
          rows="7"
          class="resize-none rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
        />
      </AdminField>

      <div class="grid grid-cols-2 gap-2">
        <button
          v-if="canShare"
          type="button"
          :class="[SHARE_BTN, 'col-span-2']"
          @click="share"
        >
          <Icon
            name="lucide:share-2"
            class="h-4 w-4"
            aria-hidden="true"
          />
          Compartir…
        </button>
        <a
          :href="whatsappUrl"
          target="_blank"
          rel="noopener"
          :class="SHARE_BTN"
        >
          <Icon
            name="lucide:message-circle"
            class="h-4 w-4"
            aria-hidden="true"
          />
          WhatsApp
        </a>
        <!-- Instagram no deja precargar texto en un DM: se copia el mensaje
             y se abre la bandeja para pegarlo. -->
        <a
          href="https://www.instagram.com/direct/inbox/"
          target="_blank"
          rel="noopener"
          :class="SHARE_BTN"
          @click="copy(message, 'Mensaje copiado: pégalo en el chat de Instagram.')"
        >
          <Icon
            name="lucide:instagram"
            class="h-4 w-4"
            aria-hidden="true"
          />
          Instagram
        </a>
        <a
          :href="mailtoUrl"
          :class="SHARE_BTN"
        >
          <Icon
            name="lucide:mail"
            class="h-4 w-4"
            aria-hidden="true"
          />
          Email
        </a>
        <button
          type="button"
          :class="SHARE_BTN"
          @click="copy(message, 'Mensaje copiado.')"
        >
          <Icon
            name="lucide:clipboard"
            class="h-4 w-4"
            aria-hidden="true"
          />
          Copiar texto
        </button>
      </div>

      <p class="text-xs text-inaka-terra/55">
        Cada enlace vale para una sola reseña: crea uno por cliente. Hasta que responda lo tienes en «Esperando respuesta» para reenviarlo.
      </p>

      <div class="flex flex-wrap justify-end gap-3">
        <button
          v-if="!existing"
          type="button"
          class="rounded-lg border border-inaka-beige px-4 py-2 text-sm font-medium text-inaka-terra/80 hover:bg-inaka-nude/50"
          @click="reset"
        >
          Crear otro
        </button>
        <button
          type="button"
          class="rounded-lg bg-inaka-terra px-4 py-2 text-sm font-semibold text-inaka-cream hover:opacity-90"
          @click="$emit('close')"
        >
          Listo
        </button>
      </div>
    </div>
  </AdminModal>
</template>

<script setup lang="ts">
import { EVENT_TYPES, EVENT_TYPE_LABELS, type EventType } from '~~/shared/eventTypes'

// Crea un enlace /resena/[token] (o reabre uno pendiente vía `existing`) y lo
// comparte. Mismo dominio fijo que server/utils/email.ts: el enlace tiene que
// ir a producción aunque el panel se abra desde otro host.
const props = defineProps<{
  open: boolean
  existing: { token: string, author: string | null } | null
}>()

const emit = defineEmits<{ close: [], created: [] }>()

const SHARE_BTN = 'flex items-center justify-center gap-2 rounded-xl border border-inaka-beige px-3 py-2.5 text-sm font-semibold text-inaka-terra hover:bg-inaka-nude/40'
// 'otro' daría «¿Qué tal fue tu otro?» en el formulario público.
const OCCASIONS = EVENT_TYPES.filter(et => et !== 'otro')
const EMAIL_SUBJECT = '¿Qué tal fue tu celebración con Inaka Moments?'

const toast = useToast()
const canShare = import.meta.client && typeof navigator.share === 'function'

interface RecentEvent {
  eventId: string
  title: string
  clientName: string | null
  eventType: EventType | null
  eventDate: string
  request: { token: string, responded: boolean } | null
}

const form = reactive({ author: '', event_type: null as EventType | null })
const selectedEventId = ref<string | null>(null)
const recent = ref<RecentEvent[]>([])
const recentPending = ref(false)
const recentError = ref('')
const token = ref<string | null>(null)
const message = ref('')
const creating = ref(false)
const copyLinkBtn = ref<HTMLButtonElement | null>(null)

const url = computed(() => `https://inakamoments.com/resena/${token.value}`)
const whatsappUrl = computed(() => `https://wa.me/?text=${encodeURIComponent(message.value)}`)
const mailtoUrl = computed(() => `mailto:?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(message.value)}`)

watch(() => props.open, (isOpen) => {
  if (!isOpen) return
  if (props.existing) showLink(props.existing.token, props.existing.author)
  else reset()
})

function reset() {
  token.value = null
  message.value = ''
  form.author = ''
  form.event_type = null
  selectedEventId.value = null
  loadRecent()
}

async function loadRecent() {
  recentPending.value = true
  recentError.value = ''
  try {
    recent.value = await $fetch<RecentEvent[]>('/api/admin/testimonials/eventos-recientes')
  }
  catch (err) {
    recentError.value = apiErrorMessage(err, 'No se han podido cargar los eventos recientes.')
  }
  finally {
    recentPending.value = false
  }
}

// Un clic rellena nombre y ocasión (editables); otro clic lo deselecciona.
function selectEvent(e: RecentEvent) {
  if (selectedEventId.value === e.eventId) {
    selectedEventId.value = null
    form.author = ''
    form.event_type = null
    return
  }
  selectedEventId.value = e.eventId
  form.author = e.clientName ?? ''
  form.event_type = e.eventType === 'otro' ? null : e.eventType
}

function eventMeta(e: RecentEvent) {
  const date = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${e.eventDate}T00:00:00`))
  return e.eventType ? `${EVENT_TYPE_LABELS[e.eventType]} · ${date}` : date
}

function showLink(newToken: string, author: string | null) {
  token.value = newToken
  const firstName = author?.trim().split(/\s+/)[0]
  message.value = `¡Hola${firstName ? ` ${firstName}` : ''}! 💛 Gracias por confiar en Inaka Moments. Nos encantaría saber qué tal fue: ¿nos dejas tu opinión? Solo lleva un minuto y nos ayuda muchísimo a seguir creciendo.\n\n${url.value}`
}

async function create() {
  creating.value = true
  try {
    const res = await $fetch<{ token: string }>('/api/admin/testimonials/enlace', {
      method: 'POST',
      body: { author: form.author, event_type: form.event_type, event_id: selectedEventId.value },
    })
    showLink(res.token, form.author)
    emit('created')
    // El formulario desaparece con el foco dentro: se lleva al botón de copiar.
    await nextTick()
    copyLinkBtn.value?.focus()
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido crear el enlace.'))
  }
  finally {
    creating.value = false
  }
}

async function copy(text: string, done: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(done)
  }
  catch {
    toast.error('No se ha podido copiar: selecciona el texto y cópialo a mano.')
  }
}

async function share() {
  try {
    await navigator.share({ text: message.value })
  }
  catch (err) {
    // AbortError = se cerró la hoja de compartir sin elegir app; no es un fallo.
    if ((err as Error).name !== 'AbortError') toast.error('No se ha podido abrir el menú de compartir.')
  }
}
</script>
