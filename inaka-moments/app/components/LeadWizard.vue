<template>
  <div class="rounded-2xl bg-white shadow-lg overflow-hidden">

    <!-- Progress bar -->
    <div class="h-1 w-full bg-inaka-nude">
      <div
        class="h-full bg-inaka-terra transition-all duration-500 ease-in-out"
        :style="{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }"
      />
    </div>

    <!-- Step header -->
    <div class="px-8 pt-6 pb-0 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="flex gap-1">
          <span
            v-for="i in TOTAL_STEPS"
            :key="i"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="i <= currentStep ? 'w-5 bg-inaka-terra' : 'w-1.5 bg-inaka-nude'"
          />
        </div>
        <span class="text-xs font-medium text-inaka-terra/40 ml-1">{{ currentStep }}/{{ TOTAL_STEPS }}</span>
      </div>
      <button
        v-if="currentStep > 1"
        type="button"
        class="inline-flex items-center gap-1 text-xs font-medium text-inaka-terra/50 hover:text-inaka-terra transition-colors"
        @click="currentStep--"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        Volver
      </button>
    </div>

    <!-- Steps -->
    <Transition name="fade" mode="out-in">

      <!-- ─── PASO 1: Tipo de evento ─────────────────────────────────── -->
      <div v-if="currentStep === 1" key="step-1" class="p-8 sm:p-10">
        <p class="text-xs font-semibold uppercase tracking-widest text-inaka-gold mb-2">Paso 1</p>
        <h2 class="text-2xl font-bold text-inaka-terra mb-1">¿Qué tipo de evento celebras?</h2>
        <p class="text-sm text-inaka-terra/55 mb-8">Selecciona una opción para continuar. <span class="text-inaka-mauve font-medium">Todos los campos son obligatorios.</span></p>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <button
            v-for="opt in eventoOptions"
            :key="opt.value"
            type="button"
            class="group flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-200"
            :class="formData.tipo === opt.value
              ? 'border-inaka-terra bg-inaka-terra/5 shadow-sm'
              : 'border-inaka-beige bg-white hover:border-inaka-terra/50 hover:bg-inaka-nude/20'"
            @click="selectTipo(opt.value)"
          >
            <span class="text-3xl transition-transform duration-200 group-hover:scale-110" aria-hidden="true">{{ opt.icon }}</span>
            <span class="text-sm font-semibold text-inaka-terra">{{ opt.label }}</span>
            <span
              v-if="formData.tipo === opt.value"
              class="flex h-4 w-4 items-center justify-center rounded-full bg-inaka-terra"
            >
              <svg class="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </span>
          </button>
        </div>
      </div>

      <!-- ─── PASO 2: Detalles ───────────────────────────────────────── -->
      <div v-else-if="currentStep === 2" key="step-2" class="p-8 sm:p-10">
        <p class="text-xs font-semibold uppercase tracking-widest text-inaka-gold mb-2">Paso 2</p>
        <h2 class="text-2xl font-bold text-inaka-terra mb-1">Cuéntanos más detalles</h2>
        <p class="text-sm text-inaka-terra/55 mb-8">Los campos marcados con <span class="text-inaka-mauve font-bold">*</span> son obligatorios.</p>

        <div class="flex flex-col gap-5 max-w-md">
          <!-- Fecha -->
          <div class="flex flex-col gap-1.5">
            <label for="fecha" class="text-sm font-semibold text-inaka-terra">
              Fecha aproximada <span class="text-inaka-mauve">*</span>
            </label>
            <input
              id="fecha"
              v-model="formData.fecha"
              type="date"
              :min="minDate"
              class="rounded-xl border bg-inaka-cream px-4 py-3 text-sm text-inaka-terra outline-none transition-all"
              :class="touched.fecha && !formData.fecha
                ? 'border-red-300 ring-1 ring-red-200'
                : formData.fecha ? 'border-inaka-terra ring-1 ring-inaka-terra/20' : 'border-inaka-beige focus:border-inaka-terra'"
              @blur="touched.fecha = true"
            />
            <p class="flex items-center gap-1 text-xs text-inaka-terra/50">
              <svg class="h-3 w-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Mínimo 1 mes de antelación.
            </p>
          </div>

          <!-- Invitados -->
          <div class="flex flex-col gap-1.5">
            <label for="invitados" class="text-sm font-semibold text-inaka-terra">
              Número de invitados <span class="text-inaka-mauve">*</span>
            </label>
            <div class="relative">
              <select
                id="invitados"
                v-model="formData.invitados"
                class="w-full appearance-none rounded-xl border bg-inaka-cream px-4 py-3 pr-10 text-sm text-inaka-terra outline-none transition-all"
                :class="touched.invitados && !formData.invitados
                  ? 'border-red-300 ring-1 ring-red-200'
                  : formData.invitados ? 'border-inaka-terra ring-1 ring-inaka-terra/20' : 'border-inaka-beige focus:border-inaka-terra'"
                @blur="touched.invitados = true"
              >
                <option value="" disabled>Selecciona un rango</option>
                <option value="Menos de 50">Menos de 50 personas</option>
                <option value="50 – 100">Entre 50 y 100 personas</option>
                <option value="Más de 100">Más de 100 personas</option>
              </select>
              <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-inaka-terra/40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <button
            type="button"
            :disabled="!formData.fecha || !formData.invitados"
            class="inline-flex items-center gap-2 rounded-xl bg-inaka-terra px-8 py-3 text-sm font-semibold text-inaka-cream shadow-sm transition-all hover:opacity-90 disabled:opacity-35 disabled:cursor-not-allowed"
            @click="nextStep2"
          >
            Siguiente
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <!-- ─── PASO 3: Espacios ───────────────────────────────────────── -->
      <div v-else-if="currentStep === 3" key="step-3" class="p-8 sm:p-10">
        <p class="text-xs font-semibold uppercase tracking-widest text-inaka-gold mb-2">Paso 3</p>
        <h2 class="text-2xl font-bold text-inaka-terra mb-1">¿Qué espacios te interesan?</h2>
        <p class="text-sm text-inaka-terra/55 mb-8">Puedes seleccionar más de uno. <span class="text-inaka-mauve font-medium">Al menos uno es obligatorio.</span></p>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            v-for="espacio in espacioOptions"
            :key="espacio.value"
            type="button"
            class="group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all duration-200"
            :class="formData.espacios.includes(espacio.value)
              ? 'border-inaka-terra bg-inaka-terra/5 shadow-sm'
              : 'border-inaka-beige bg-white hover:border-inaka-terra/50 hover:bg-inaka-nude/20'"
            @click="toggleEspacio(espacio.value)"
          >
            <span
              v-if="formData.espacios.includes(espacio.value)"
              class="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-inaka-terra"
            >
              <svg class="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </span>
            <span class="text-3xl transition-transform duration-200 group-hover:scale-110" aria-hidden="true">{{ espacio.icon }}</span>
            <span class="text-sm font-semibold text-inaka-terra leading-snug">{{ espacio.label }}</span>
          </button>
        </div>

        <div class="mt-8">
          <button
            type="button"
            :disabled="formData.espacios.length === 0"
            class="inline-flex items-center gap-2 rounded-xl bg-inaka-terra px-8 py-3 text-sm font-semibold text-inaka-cream shadow-sm transition-all hover:opacity-90 disabled:opacity-35 disabled:cursor-not-allowed"
            @click="currentStep++"
          >
            Siguiente
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <!-- ─── PASO 4: Estilo ─────────────────────────────────────────── -->
      <div v-else-if="currentStep === 4" key="step-4" class="p-8 sm:p-10">
        <p class="text-xs font-semibold uppercase tracking-widest text-inaka-gold mb-2">Paso 4</p>
        <h2 class="text-2xl font-bold text-inaka-terra mb-1">¿Qué estilo te inspira?</h2>
        <p class="text-sm text-inaka-terra/55 mb-8">Elige la estética que mejor encaja con tu visión.</p>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            v-for="estilo in estiloOptions"
            :key="estilo.value"
            type="button"
            class="group relative flex flex-col items-start gap-2 rounded-2xl border-2 p-6 text-left transition-all duration-200"
            :class="formData.estilo === estilo.value
              ? 'border-inaka-terra bg-inaka-terra/5 shadow-sm'
              : 'border-inaka-beige bg-white hover:border-inaka-terra/50 hover:bg-inaka-nude/20'"
            @click="selectEstilo(estilo.value)"
          >
            <span
              v-if="formData.estilo === estilo.value"
              class="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-inaka-terra"
            >
              <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </span>
            <span class="text-3xl" aria-hidden="true">{{ estilo.icon }}</span>
            <span class="text-base font-bold text-inaka-terra">{{ estilo.label }}</span>
            <span class="text-xs text-inaka-terra/60 leading-relaxed">{{ estilo.desc }}</span>
          </button>
        </div>
      </div>

      <!-- ─── PASO 5: Contacto ───────────────────────────────────────── -->
      <div v-else-if="currentStep === 5" key="step-5" class="p-8 sm:p-10">
        <p class="text-xs font-semibold uppercase tracking-widest text-inaka-gold mb-2">Paso 5</p>
        <h2 class="text-2xl font-bold text-inaka-terra mb-1">¿Cómo contactamos contigo?</h2>
        <p class="text-sm text-inaka-terra/55 mb-8">Los campos marcados con <span class="text-inaka-mauve font-bold">*</span> son obligatorios. Te enviamos tu propuesta en menos de 24 h.</p>

        <div class="flex flex-col gap-5 max-w-md">

          <!-- Nombre -->
          <div class="flex flex-col gap-1.5">
            <label for="nombre" class="text-sm font-semibold text-inaka-terra">
              Nombre completo <span class="text-inaka-mauve">*</span>
            </label>
            <input
              id="nombre"
              v-model="formData.nombre"
              type="text"
              autocomplete="name"
              placeholder="María García López"
              class="rounded-xl border bg-inaka-cream px-4 py-3 text-sm text-inaka-terra placeholder:text-inaka-terra/30 outline-none transition-all"
              :class="touched.nombre && !formData.nombre.trim()
                ? 'border-red-300 ring-1 ring-red-200'
                : formData.nombre ? 'border-inaka-terra ring-1 ring-inaka-terra/20' : 'border-inaka-beige focus:border-inaka-terra'"
              @blur="touched.nombre = true"
            />
            <p v-if="touched.nombre && !formData.nombre.trim()" class="text-xs text-red-500">Este campo es obligatorio.</p>
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-1.5">
            <label for="email" class="text-sm font-semibold text-inaka-terra">
              Correo electrónico <span class="text-inaka-mauve">*</span>
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              autocomplete="email"
              placeholder="maria@ejemplo.com"
              class="rounded-xl border bg-inaka-cream px-4 py-3 text-sm text-inaka-terra placeholder:text-inaka-terra/30 outline-none transition-all"
              :class="touched.email && !emailValido
                ? 'border-red-300 ring-1 ring-red-200'
                : formData.email && emailValido ? 'border-inaka-terra ring-1 ring-inaka-terra/20' : 'border-inaka-beige focus:border-inaka-terra'"
              @blur="touched.email = true"
            />
            <p v-if="touched.email && !emailValido" class="text-xs text-red-500">Introduce un correo válido.</p>
          </div>

          <!-- Teléfono con prefijo -->
          <div class="flex flex-col gap-1.5">
            <label for="telefono" class="text-sm font-semibold text-inaka-terra">
              WhatsApp / Teléfono <span class="text-inaka-mauve">*</span>
            </label>
            <div class="flex rounded-xl border overflow-hidden transition-all"
              :class="touched.telefono && !telefonoValido
                ? 'border-red-300 ring-1 ring-red-200'
                : phoneNumero && telefonoValido ? 'border-inaka-terra ring-1 ring-inaka-terra/20' : 'border-inaka-beige focus-within:border-inaka-terra'"
            >
              <!-- Selector de prefijo -->
              <div class="relative shrink-0">
                <select
                  v-model="phonePrefijo"
                  class="h-full appearance-none bg-inaka-nude/60 pl-3 pr-7 text-sm font-medium text-inaka-terra outline-none cursor-pointer border-r border-inaka-beige"
                  aria-label="Prefijo de país"
                >
                  <option v-for="p in prefijos" :key="p.code" :value="p.dial">{{ p.flag }} {{ p.dial }}</option>
                </select>
                <svg class="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-inaka-terra/50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <input
                id="telefono"
                v-model="phoneNumero"
                type="tel"
                inputmode="numeric"
                autocomplete="tel-national"
                placeholder="600 000 000"
                class="flex-1 bg-inaka-cream px-4 py-3 text-sm text-inaka-terra placeholder:text-inaka-terra/30 outline-none"
                @blur="touched.telefono = true"
              />
            </div>
            <p v-if="touched.telefono && !telefonoValido" class="text-xs text-red-500">Introduce un número de teléfono válido.</p>
          </div>

          <!-- Ideas extra (opcional) -->
          <div class="flex flex-col gap-1.5">
            <label for="ideas" class="text-sm font-semibold text-inaka-terra">
              Peticiones especiales
              <span class="ml-1 text-xs font-normal text-inaka-terra/40">(opcional)</span>
            </label>
            <textarea
              id="ideas"
              v-model="formData.ideasExtra"
              rows="3"
              placeholder="¿Tienes alguna idea especial que no hayas visto en nuestro catálogo? Cuéntanosla aquí."
              class="resize-none rounded-xl border border-inaka-beige bg-inaka-cream px-4 py-3 text-sm text-inaka-terra placeholder:text-inaka-terra/30 outline-none transition-all focus:border-inaka-terra"
            />
          </div>
        </div>

        <!-- Disclaimer señal -->
        <div class="mt-6 flex gap-3 rounded-xl bg-inaka-gold/10 border border-inaka-gold/25 px-4 py-3 max-w-md">
          <svg class="mt-0.5 h-4 w-4 shrink-0 text-inaka-gold" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p class="text-xs text-inaka-terra/70 leading-relaxed">
            Para bloquear la fecha y confirmar tu evento, será necesario realizar el pago de una señal al momento de agendar.
          </p>
        </div>

        <!-- Error -->
        <div
          v-if="submitError"
          class="mt-4 flex gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 max-w-md"
        >
          <svg class="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p class="text-sm text-red-700">{{ submitError }}</p>
        </div>

        <div class="mt-6">
          <button
            type="button"
            :disabled="!canSubmit || isSending"
            class="inline-flex items-center gap-2 rounded-xl bg-inaka-terra px-8 py-3.5 text-sm font-semibold text-inaka-cream shadow-sm transition-all hover:opacity-90 disabled:opacity-35 disabled:cursor-not-allowed"
            @click="submitForm"
          >
            <svg v-if="isSending" class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            {{ isSending ? 'Enviando…' : 'Solicitar presupuesto' }}
          </button>
        </div>
      </div>

      <!-- ─── CONFIRMACIÓN ───────────────────────────────────────────── -->
      <div v-else key="step-done" class="p-8 sm:p-12 flex flex-col items-center text-center gap-4">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-inaka-gold/15">
          <svg class="h-10 w-10 text-inaka-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-inaka-terra">¡Solicitud enviada!</h2>
          <p class="mt-2 text-sm text-inaka-terra/65 max-w-sm leading-relaxed">
            Hemos recibido tus datos. El equipo de <strong>Inaka Moments</strong> se pondrá en contacto contigo en menos de 24 horas.
          </p>
        </div>
        <button
          type="button"
          class="mt-2 rounded-xl border border-inaka-terra px-6 py-2.5 text-sm font-semibold text-inaka-terra transition-colors hover:bg-inaka-nude"
          @click="resetForm"
        >
          Empezar de nuevo
        </button>
      </div>

    </Transition>
  </div>
</template>

<script setup lang="ts">
import emailjs from '@emailjs/browser'

const config = useRuntimeConfig()

const TOTAL_STEPS = 5
const currentStep = ref(1)
const isSending = ref(false)
const submitError = ref('')

// Prefijo teléfono
const phonePrefijo = ref('+34')
const phoneNumero = ref('')

const prefijos = [
  { code: 'ES', dial: '+34', flag: '🇪🇸' },
  { code: 'MX', dial: '+52', flag: '🇲🇽' },
  { code: 'AR', dial: '+54', flag: '🇦🇷' },
  { code: 'CO', dial: '+57', flag: '🇨🇴' },
  { code: 'CL', dial: '+56', flag: '🇨🇱' },
  { code: 'PE', dial: '+51', flag: '🇵🇪' },
  { code: 'VE', dial: '+58', flag: '🇻🇪' },
  { code: 'US', dial: '+1',  flag: '🇺🇸' },
  { code: 'GB', dial: '+44', flag: '🇬🇧' },
  { code: 'DE', dial: '+49', flag: '🇩🇪' },
  { code: 'FR', dial: '+33', flag: '🇫🇷' },
  { code: 'IT', dial: '+39', flag: '🇮🇹' },
  { code: 'PT', dial: '+351', flag: '🇵🇹' },
]

// Campos de contacto
const touched = reactive({
  fecha: false,
  invitados: false,
  nombre: false,
  email: false,
  telefono: false,
})

const minDate = computed(() => {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().split('T')[0]!
})

const emailValido = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
const telefonoValido = computed(() => phoneNumero.value.replace(/\s/g, '').length >= 7)
const canSubmit = computed(() =>
  formData.nombre.trim() !== '' &&
  emailValido.value &&
  telefonoValido.value,
)

const formData = reactive({
  tipo: '',
  invitados: '',
  fecha: '',
  espacios: [] as string[],
  estilo: '',
  nombre: '',
  email: '',
  ideasExtra: '',
})

// Ocasiones reales del catálogo Inaka Moments 2026
const eventoOptions = [
  { value: 'cumpleanos',  label: 'Cumpleaños',  icon: '🎂' },
  { value: 'baby_shower', label: 'Baby Shower', icon: '🍼' },
  { value: 'bautizo',     label: 'Bautizo',     icon: '🕊️' },
  { value: 'comunion',    label: 'Comunión',    icon: '✨' },
  { value: 'graduacion',  label: 'Graduación',  icon: '🎓' },
  { value: 'despedida',   label: 'Despedida',   icon: '🥂' },
  { value: 'jubilacion',  label: 'Jubilación',  icon: '🌅' },
  { value: 'corporativo', label: 'Corporativo', icon: '🏢' },
  { value: 'otro',        label: 'Otro',        icon: '💡' },
]

const espacioOptions = [
  { value: 'photocall',    label: 'Photocall',       icon: '📸' },
  { value: 'mesa-dulce',   label: 'Mesa Dulce',      icon: '🍰' },
  { value: 'centros-mesa', label: 'Centros de Mesa', icon: '🌸' },
  { value: 'bienvenida',   label: 'Bienvenida',      icon: '🌿' },
]

const estiloOptions = [
  { value: 'boho',     label: 'Boho Chic',       icon: '🌾', desc: 'Natural, orgánico y lleno de textura. Madera, lino y flores silvestres.' },
  { value: 'clasico',  label: 'Clásico Elegante', icon: '🕊️', desc: 'Atemporal y sofisticado. Blancos, dorados y porcelana fina.' },
  { value: 'colorido', label: 'Colorido',         icon: '🎨', desc: 'Vibrante y festivo. Colores llamativos y detalles divertidos.' },
]

function selectTipo(value: string) {
  formData.tipo = value
  currentStep.value++
}

function toggleEspacio(value: string) {
  const idx = formData.espacios.indexOf(value)
  if (idx === -1) formData.espacios.push(value)
  else formData.espacios.splice(idx, 1)
}

function selectEstilo(value: string) {
  formData.estilo = value
  currentStep.value++
}

function nextStep2() {
  touched.fecha = true
  touched.invitados = true
  if (formData.fecha && formData.invitados) currentStep.value++
}

const estiloLabels: Record<string, string> = {
  boho: 'Boho Chic',
  clasico: 'Clásico Elegante',
  colorido: 'Colorido',
}

async function submitForm() {
  touched.nombre = true
  touched.email = true
  touched.telefono = true
  if (!canSubmit.value || isSending.value) return

  isSending.value = true
  submitError.value = ''

  const labels: Record<string, string> = Object.fromEntries(
    eventoOptions.map(o => [o.value, o.label]),
  )

  const espacioLabels: Record<string, string> = {
    photocall: 'Photocall',
    'mesa-dulce': 'Mesa Dulce',
    'centros-mesa': 'Centros de Mesa',
    bienvenida: 'Bienvenida',
  }

  const fullPhone = `${phonePrefijo.value} ${phoneNumero.value}`.trim()

  const templateParams = {
    nombre: formData.nombre,
    email: formData.email,
    telefono: fullPhone,
    tipo_evento: labels[formData.tipo] ?? formData.tipo,
    fecha: formData.fecha || 'No especificada',
    invitados: formData.invitados,
    espacios: formData.espacios.map(e => espacioLabels[e] ?? e).join(', ') || 'No especificados',
    estilo: estiloLabels[formData.estilo] ?? formData.estilo ?? 'No especificado',
    ideas_extra: formData.ideasExtra || 'Sin peticiones adicionales',
    to_email: config.public.emailjsRecipient,
    reply_to: formData.email,
  }

  try {
    await emailjs.send(
      config.public.emailjsServiceId,
      config.public.emailjsTemplateId,
      templateParams,
      config.public.emailjsPublicKey,
    )
    currentStep.value = TOTAL_STEPS + 1
  } catch (err) {
    console.error('EmailJS error:', err)
    submitError.value = 'Ha ocurrido un error al enviar tu solicitud. Por favor, inténtalo de nuevo o contáctanos directamente por WhatsApp.'
  } finally {
    isSending.value = false
  }
}

function resetForm() {
  Object.assign(formData, {
    tipo: '', invitados: '', fecha: '', espacios: [],
    estilo: '', nombre: '', email: '', ideasExtra: '',
  })
  Object.assign(touched, { fecha: false, invitados: false, nombre: false, email: false, telefono: false } as typeof touched)
  phoneNumero.value = ''
  phonePrefijo.value = '+34'
  submitError.value = ''
  currentStep.value = 1
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
