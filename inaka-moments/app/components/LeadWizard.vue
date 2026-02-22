<template>
  <div class="rounded-2xl bg-white shadow-lg overflow-hidden">

    <!-- Progress bar -->
    <div class="h-1 w-full bg-inaka-nude">
      <div
        class="h-full bg-inaka-terra transition-all duration-500 ease-in-out"
        :style="{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }"
      />
    </div>

    <!-- Step counter -->
    <div class="px-8 pt-8 pb-0 flex items-center justify-between">
      <span class="text-xs font-semibold uppercase tracking-widest text-inaka-terra/50">
        Paso {{ currentStep }} de {{ TOTAL_STEPS }}
      </span>
      <button
        v-if="currentStep > 1"
        type="button"
        class="text-xs font-medium text-inaka-terra/50 hover:text-inaka-terra transition-colors"
        @click="currentStep--"
      >
        ← Volver
      </button>
    </div>

    <!-- Steps wrapper with fade transition -->
    <Transition name="fade" mode="out-in">

      <!-- ─── PASO 1: Tipo de evento ─────────────────────────────────── -->
      <div v-if="currentStep === 1" key="step-1" class="p-8 sm:p-12">
        <h2 class="text-2xl font-bold text-inaka-terra mb-2">¿Qué tipo de evento tienes en mente?</h2>
        <p class="text-sm text-inaka-terra/60 mb-8">Selecciona una opción para empezar.</p>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <button
            v-for="opt in eventoOptions"
            :key="opt.value"
            type="button"
            class="flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all duration-200 hover:border-inaka-terra hover:bg-inaka-nude/20"
            :class="formData.tipo === opt.value
              ? 'border-inaka-terra bg-inaka-nude/20'
              : 'border-inaka-beige bg-white'"
            @click="selectTipo(opt.value)"
          >
            <span class="text-3xl" aria-hidden="true">{{ opt.icon }}</span>
            <span class="text-sm font-semibold text-inaka-terra">{{ opt.label }}</span>
          </button>
        </div>
      </div>

      <!-- ─── PASO 2: Detalles ───────────────────────────────────────── -->
      <div v-else-if="currentStep === 2" key="step-2" class="p-8 sm:p-12">
        <h2 class="text-2xl font-bold text-inaka-terra mb-2">Cuéntanos más detalles</h2>
        <p class="text-sm text-inaka-terra/60 mb-8">Nos ayuda a prepararte la propuesta perfecta.</p>

        <div class="flex flex-col gap-5 max-w-md">
          <div class="flex flex-col gap-1.5">
            <label for="fecha" class="text-sm font-semibold text-inaka-terra">Fecha aproximada</label>
            <input
              id="fecha"
              v-model="formData.fecha"
              type="date"
              :min="minDate"
              class="rounded-lg border border-inaka-beige bg-inaka-cream px-4 py-3 text-sm text-inaka-terra outline-none transition-colors focus:border-inaka-terra"
            />
            <p class="text-xs text-inaka-terra/70">
              Solo aceptamos reservas con un mínimo de 1 mes de antelación.
            </p>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="invitados" class="text-sm font-semibold text-inaka-terra">Número de invitados</label>
            <select
              id="invitados"
              v-model="formData.invitados"
              class="rounded-lg border border-inaka-beige bg-inaka-cream px-4 py-3 text-sm text-inaka-terra outline-none transition-colors focus:border-inaka-terra"
            >
              <option value="" disabled>Selecciona un rango</option>
              <option value="<50">Menos de 50</option>
              <option value="50-100">50 – 100</option>
              <option value=">100">Más de 100</option>
            </select>
          </div>
        </div>

        <div class="mt-8">
          <button
            type="button"
            :disabled="!formData.fecha || !formData.invitados"
            class="rounded-lg bg-inaka-terra px-8 py-3 text-sm font-semibold text-inaka-cream shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            @click="currentStep++"
          >
            Siguiente →
          </button>
        </div>
      </div>

      <!-- ─── PASO 3: Espacios ───────────────────────────────────────── -->
      <div v-else-if="currentStep === 3" key="step-3" class="p-8 sm:p-12">
        <h2 class="text-2xl font-bold text-inaka-terra mb-2">¿Qué espacios te interesan?</h2>
        <p class="text-sm text-inaka-terra/60 mb-8">Puedes seleccionar más de uno.</p>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <button
            v-for="espacio in espacioOptions"
            :key="espacio.value"
            type="button"
            class="flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all duration-200 hover:border-inaka-terra hover:bg-inaka-nude/20"
            :class="formData.espacios.includes(espacio.value)
              ? 'border-inaka-terra bg-inaka-nude/20'
              : 'border-inaka-beige bg-white'"
            @click="toggleEspacio(espacio.value)"
          >
            <span class="text-3xl" aria-hidden="true">{{ espacio.icon }}</span>
            <span class="text-sm font-semibold text-inaka-terra text-center leading-snug">{{ espacio.label }}</span>
          </button>
        </div>

        <div class="mt-8">
          <button
            type="button"
            :disabled="formData.espacios.length === 0"
            class="rounded-lg bg-inaka-terra px-8 py-3 text-sm font-semibold text-inaka-cream shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            @click="currentStep++"
          >
            Siguiente →
          </button>
        </div>
      </div>

      <!-- ─── PASO 4: Estilo ─────────────────────────────────────────── -->
      <div v-else-if="currentStep === 4" key="step-4" class="p-8 sm:p-12">
        <h2 class="text-2xl font-bold text-inaka-terra mb-2">¿Qué estilo te inspira?</h2>
        <p class="text-sm text-inaka-terra/60 mb-8">Elige la estética que mejor encaja con tu visión.</p>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            v-for="estilo in estiloOptions"
            :key="estilo.value"
            type="button"
            class="flex flex-col items-start gap-2 rounded-xl border-2 p-6 text-left transition-all duration-200 hover:border-inaka-terra hover:bg-inaka-nude/20"
            :class="formData.estilo === estilo.value
              ? 'border-inaka-terra bg-inaka-nude/20'
              : 'border-inaka-beige bg-white'"
            @click="selectEstilo(estilo.value)"
          >
            <span class="text-3xl" aria-hidden="true">{{ estilo.icon }}</span>
            <span class="text-base font-bold text-inaka-terra">{{ estilo.label }}</span>
            <span class="text-xs text-inaka-terra/60 leading-relaxed">{{ estilo.desc }}</span>
          </button>
        </div>
      </div>

      <!-- ─── PASO 5: Contacto ───────────────────────────────────────── -->
      <div v-else-if="currentStep === 5" key="step-5" class="p-8 sm:p-12">
        <h2 class="text-2xl font-bold text-inaka-terra mb-2">¡Casi listo! ¿Cómo contactamos contigo?</h2>
        <p class="text-sm text-inaka-terra/60 mb-8">Te enviaremos tu presupuesto personalizado en menos de 24 h.</p>

        <div class="flex flex-col gap-5 max-w-md">
          <!-- Ideas a medida -->
          <div class="flex flex-col gap-1.5">
            <label for="ideas" class="text-sm font-semibold text-inaka-terra">¿Tienes alguna idea especial?</label>
            <textarea
              id="ideas"
              v-model="formData.ideasExtra"
              rows="3"
              placeholder="¿Tienes alguna idea en mente que no hayas visto en nuestro catálogo? Cuéntanosla aquí."
              class="resize-none rounded-lg border border-inaka-beige bg-inaka-cream px-4 py-3 text-sm text-inaka-terra placeholder:text-inaka-terra/30 outline-none transition-colors focus:border-inaka-terra"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="nombre" class="text-sm font-semibold text-inaka-terra">Nombre</label>
            <input
              id="nombre"
              v-model="formData.nombre"
              type="text"
              placeholder="Tu nombre completo"
              class="rounded-lg border border-inaka-beige bg-inaka-cream px-4 py-3 text-sm text-inaka-terra placeholder:text-inaka-terra/30 outline-none transition-colors focus:border-inaka-terra"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="email" class="text-sm font-semibold text-inaka-terra">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="hola@ejemplo.com"
              class="rounded-lg border border-inaka-beige bg-inaka-cream px-4 py-3 text-sm text-inaka-terra placeholder:text-inaka-terra/30 outline-none transition-colors focus:border-inaka-terra"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="telefono" class="text-sm font-semibold text-inaka-terra">WhatsApp</label>
            <input
              id="telefono"
              v-model="formData.telefono"
              type="tel"
              placeholder="+34 600 000 000"
              class="rounded-lg border border-inaka-beige bg-inaka-cream px-4 py-3 text-sm text-inaka-terra placeholder:text-inaka-terra/30 outline-none transition-colors focus:border-inaka-terra"
            />
          </div>
        </div>

        <!-- Disclaimer política de señal -->
        <p class="rounded-lg bg-inaka-beige/20 p-3 text-sm text-inaka-terra leading-relaxed">
          <strong class="font-semibold">Importante:</strong> Para bloquear la fecha y confirmar tu evento, será necesario realizar el pago de una señal al momento de agendar.
        </p>

        <div class="mt-2">
          <button
            type="button"
            :disabled="!formData.nombre || !formData.email || !formData.telefono"
            class="rounded-lg bg-inaka-terra px-8 py-3 text-sm font-semibold text-inaka-cream shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            @click="submitForm"
          >
            Solicitar Presupuesto ✨
          </button>
        </div>
      </div>

      <!-- ─── CONFIRMACIÓN ───────────────────────────────────────────── -->
      <div v-else key="step-done" class="p-8 sm:p-12 flex flex-col items-center text-center gap-4">
        <span class="text-5xl">🎉</span>
        <h2 class="text-2xl font-bold text-inaka-terra">¡Solicitud enviada!</h2>
        <p class="text-sm text-inaka-terra/70 max-w-sm">
          Hemos recibido tus datos. El equipo de Inaka Moments se pondrá en contacto contigo en menos de 24 horas.
        </p>
        <button
          type="button"
          class="mt-4 rounded-lg border border-inaka-terra px-6 py-2.5 text-sm font-semibold text-inaka-terra transition-colors hover:bg-inaka-nude"
          @click="resetForm"
        >
          Empezar de nuevo
        </button>
      </div>

    </Transition>
  </div>
</template>

<script setup lang="ts">
const TOTAL_STEPS = 5

const currentStep = ref(1)

const minDate = computed(() => {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().split('T')[0]
})

const formData = reactive({
  tipo: '',
  invitados: '',
  fecha: '',
  espacios: [] as string[],
  estilo: '',
  nombre: '',
  telefono: '',
  email: '',
  ideasExtra: '',
})

const eventoOptions = [
  { value: 'boda',      label: 'Boda',      icon: '💍' },
  { value: 'comunion',  label: 'Comunión',  icon: '✝️' },
  { value: 'cumple',    label: 'Cumpleaños', icon: '🎂' },
  { value: 'empresa',   label: 'Empresa',   icon: '🏢' },
]

const espacioOptions = [
  { value: 'photocall',     label: 'Photocall',       icon: '📸' },
  { value: 'mesa-dulce',    label: 'Mesa Dulce',      icon: '🍰' },
  { value: 'centros-mesa',  label: 'Centros de Mesa', icon: '🌸' },
  { value: 'bienvenida',    label: 'Bienvenida',      icon: '🌿' },
]

const estiloOptions = [
  { value: 'boho',    label: 'Boho Chic',        icon: '🌾', desc: 'Natural, orgánico y lleno de textura. Madera, lino y flores silvestres.' },
  { value: 'clasico', label: 'Clásico Elegante',  icon: '🕊️', desc: 'Atemporal y sofisticado. Blancos, dorados y porcelana fina.' },
  { value: 'colorido',label: 'Colorido',          icon: '🎨', desc: 'Vibrante y festivo. Colores llamativos y detalles divertidos.' },
]

function selectTipo(value: string) {
  formData.tipo = value
  currentStep.value++
}

function toggleEspacio(value: string) {
  const idx = formData.espacios.indexOf(value)
  if (idx === -1) {
    formData.espacios.push(value)
  } else {
    formData.espacios.splice(idx, 1)
  }
}

function selectEstilo(value: string) {
  formData.estilo = value
  currentStep.value++
}

function submitForm() {
  // TODO: connect to backend / email service
  console.log('Lead data:', toRaw(formData))
  currentStep.value = TOTAL_STEPS + 1
}

function resetForm() {
  Object.assign(formData, {
    tipo: '', invitados: '', fecha: '', espacios: [],
    estilo: '', nombre: '', telefono: '', email: '', ideasExtra: '',
  })
  currentStep.value = 1
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>
