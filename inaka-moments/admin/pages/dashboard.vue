<template>
  <div class="max-w-7xl mx-auto">
    <!-- Tab navigation -->
    <div class="flex gap-2 mb-6 border-b border-[#D4BFA0] pb-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
        :class="activeTab === tab.id
          ? 'bg-[#8B3A2A] text-white'
          : 'bg-[#E8D0C8] text-[#8B3A2A] hover:bg-[#D4BFA0]'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Saving indicator -->
    <div v-if="saving" class="mb-4 flex items-center gap-2 text-sm text-[#8B3A2A]">
      <span class="animate-spin">⟳</span> Guardando...
    </div>
    <div v-if="saveSuccess" class="mb-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg">
      ✓ Cambios guardados
    </div>

    <!-- TAB: Galería -->
    <div v-if="activeTab === 'galeria'">
      <div class="bg-white rounded-2xl shadow-sm border border-[#D4BFA0] p-6">
        <h2 class="text-lg font-semibold text-[#8B3A2A] mb-1">Galería de trabajos</h2>
        <p class="text-sm text-[#8B3A2A]/60 mb-6">6 espacios disponibles. Arrastra para reordenar.</p>

        <!-- Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="(item, index) in form.galeria"
            :key="index"
            class="relative group"
          >
            <!-- Image preview -->
            <div class="aspect-[4/5] rounded-xl overflow-hidden bg-[#E8D0C8] border-2 border-[#D4BFA0]">
              <img
                v-if="item.url"
                :src="item.url"
                :alt="item.alt"
                class="object-cover w-full h-full"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-[#8B3A2A]/30">
                <span class="text-4xl">📷</span>
              </div>
            </div>

            <!-- Slot number -->
            <span class="absolute top-2 left-2 bg-[#8B3A2A] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
              {{ index + 1 }}
            </span>

            <!-- Delete button -->
            <button
              v-if="item.url"
              @click="removeImage(index)"
              class="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600 transition-colors"
              title="Eliminar imagen"
            >
              ✕
            </button>

            <!-- Form fields -->
            <div class="mt-2 space-y-2">
              <input
                v-model="item.alt"
                placeholder="Pie de foto"
                class="w-full text-xs px-3 py-2 rounded-lg border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none"
              />
              <select
                v-model="item.categoria"
                class="w-full text-xs px-3 py-2 rounded-lg border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none bg-white"
              >
                <option value="">Categoría</option>
                <option value="Boda">Boda</option>
                <option value="Comunión">Comunión</option>
                <option value="Cumpleaños">Cumpleaños</option>
                <option value="Corporativo">Corporativo</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Upload area -->
        <div class="mt-6 border-2 border-dashed border-[#D4BFA0] rounded-xl p-6 text-center">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          />
          <button
            @click="fileInput?.click()"
            class="inline-flex items-center gap-2 bg-[#8B3A2A] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#5c1f14] transition-colors"
          >
            📁 Subir imagen
          </button>
          <p class="text-xs text-[#8B3A2A]/50 mt-2">JPG, PNG, WEBP · Máx 1200px · Máx 2MB</p>
        </div>

        <!-- Upload progress -->
        <div v-if="uploading" class="mt-4 flex items-center gap-3">
          <div class="animate-spin text-[#8B3A2A]">⟳</div>
          <span class="text-sm text-[#8B3A2A]">Procesando imagen...</span>
        </div>

        <!-- Slot selector for upload -->
        <div v-if="pendingUpload" class="mt-4 bg-[#E8D0C8] rounded-xl p-4">
          <p class="text-sm font-medium text-[#8B3A2A] mb-3">¿En qué posición?</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(item, idx) in form.galeria"
              :key="idx"
              @click="assignToSlot(idx)"
              class="px-4 py-2 rounded-lg text-sm font-medium"
              :class="item.url
                ? 'bg-[#D4BFA0] text-[#8B3A2A]/50 cursor-not-allowed'
                : 'bg-[#8B3A2A] text-white hover:bg-[#5c1f14]'"
              :disabled="!!item.url"
            >
              Slot {{ idx + 1 }}{{ item.url ? ' (ocupado)' : '' }}
            </button>
          </div>
        </div>

        <!-- Save button -->
        <button
          @click="saveGaleria"
          class="mt-6 px-8 py-3 bg-[#C9A96E] text-[#8B3A2A] font-semibold rounded-xl hover:bg-[#b89558] transition-colors"
        >
          Guardar galería
        </button>
      </div>
    </div>

    <!-- TAB: Textos -->
    <div v-if="activeTab === 'textos'">
      <div class="space-y-6">
        <!-- Hero -->
        <div class="bg-white rounded-2xl shadow-sm border border-[#D4BFA0] p-6">
          <h2 class="text-lg font-semibold text-[#8B3A2A] mb-4">Hero principal</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Tagline</label>
              <input v-model="form.texts.hero.tagline" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Título</label>
              <input v-model="form.texts.hero.titulo" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Título (span verde)</label>
              <input v-model="form.texts.hero.titulo_span" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Subtítulo</label>
              <input v-model="form.texts.hero.subtitulo" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">CTA principal</label>
                <input v-model="form.texts.hero.cta_principal" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">CTA secundario</label>
                <input v-model="form.texts.hero.cta_secundario" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
              </div>
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="bg-white rounded-2xl shadow-sm border border-[#D4BFA0] p-6">
          <h2 class="text-lg font-semibold text-[#8B3A2A] mb-4">Sección About</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Título principal</label>
              <input v-model="form.texts.about.titulo_principal" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Título secundario</label>
              <input v-model="form.texts.about.titulo_secundario" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Párrafo 1</label>
              <textarea v-model="form.texts.about.parrafo_1" rows="3" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none resize-none"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Párrafo 2</label>
              <textarea v-model="form.texts.about.parrafo_2" rows="3" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none resize-none"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Quote</label>
              <input v-model="form.texts.about.quote" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">CTA enlace</label>
              <input v-model="form.texts.about.cta_enlace" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-white rounded-2xl shadow-sm border border-[#D4BFA0] p-6">
          <h2 class="text-lg font-semibold text-[#8B3A2A] mb-4">Footer</h2>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Tagline</label>
              <input v-model="form.texts.footer.tagline_titulo" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Tagline (span)</label>
              <input v-model="form.texts.footer.tagline_span" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Subtagline</label>
              <input v-model="form.texts.footer.tagline_sub" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
            </div>
          </div>
        </div>

        <button
          @click="saveTexts"
          class="px-8 py-3 bg-[#C9A96E] text-[#8B3A2A] font-semibold rounded-xl hover:bg-[#b89558] transition-colors"
        >
          Guardar textos
        </button>
      </div>
    </div>

    <!-- TAB: Contacto -->
    <div v-if="activeTab === 'contacto'">
      <div class="bg-white rounded-2xl shadow-sm border border-[#D4BFA0] p-6">
        <h2 class="text-lg font-semibold text-[#8B3A2A] mb-4">Información de contacto</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Email</label>
            <input v-model="form.contact.email" type="email" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">WhatsApp</label>
            <input v-model="form.contact.whatsapp" placeholder="+34 600 000 000" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Ubicación</label>
            <input v-model="form.contact.ubicacion" placeholder="Abrera, Barcelona" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#8B3A2A]/80 mb-1">Instagram</label>
            <input v-model="form.contact.instagram" placeholder="@inaka.moments" class="w-full px-4 py-2 rounded-xl border border-[#D4BFA0] focus:border-[#8B3A2A] outline-none" />
          </div>
        </div>
        <button
          @click="saveContact"
          class="mt-6 px-8 py-3 bg-[#C9A96E] text-[#8B3A2A] font-semibold rounded-xl hover:bg-[#b89558] transition-colors"
        >
          Guardar contacto
        </button>
      </div>
    </div>

    <!-- TAB: Catálogo -->
    <div v-if="activeTab === 'catalogo'">
      <div class="bg-white rounded-2xl shadow-sm border border-[#D4BFA0] p-6">
        <h2 class="text-lg font-semibold text-[#8B3A2A] mb-1">Catálogo PDF</h2>
        <p class="text-sm text-[#8B3A2A]/60 mb-6">Sustituye el catálogo actual. Debe ser un archivo PDF.</p>

        <div v-if="form.catalogo?.filename" class="mb-6 p-4 bg-[#E8D0C8] rounded-xl">
          <p class="text-sm font-medium text-[#8B3A2A]">📄 Actual: {{ form.catalogo.filename }}</p>
          <p class="text-xs text-[#8B3A2A]/60 mt-1">Actualizado: {{ form.catalogo.updatedAt }}</p>
        </div>

        <input ref="pdfInput" type="file" accept="application/pdf" class="hidden" @change="handlePdfSelect" />
        <button
          @click="pdfInput?.click()"
          class="inline-flex items-center gap-2 bg-[#8B3A2A] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#5c1f14] transition-colors"
        >
          📁 {{ form.catalogo?.filename ? 'Sustituir catálogo' : 'Subir catálogo PDF' }}
        </button>

        <div v-if="uploadingPdf" class="mt-4 flex items-center gap-3">
          <div class="animate-spin text-[#8B3A2A]">⟳</div>
          <span class="text-sm text-[#8B3A2A]">Subiendo PDF...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })

const tabs = [
  { id: 'galeria', label: '🖼 Galería' },
  { id: 'textos', label: '📝 Textos' },
  { id: 'contacto', label: '📞 Contacto' },
  { id: 'catalogo', label: '📄 Catálogo PDF' },
]

const activeTab = ref('galeria')
const saving = ref(false)
const saveSuccess = ref(false)
const uploading = ref(false)
const uploadingPdf = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const pdfInput = ref<HTMLInputElement | null>(null)
const pendingUpload = ref<{ file: File; base64: string } | null>(null)
const selectedSlot = ref<number | null>(null)

// Form state — mirrors the full config
const form = reactive({
  contact: { email: '', whatsapp: '', ubicacion: '', instagram: '' },
  texts: {
    hero: { tagline: '', titulo: '', titulo_span: '', subtitulo: '', cta_principal: '', cta_secundario: '' },
    about: { titulo_principal: '', titulo_secundario: '', parrafo_1: '', parrafo_2: '', quote: '', cta_enlace: '' },
    footer: { tagline_titulo: '', tagline_span: '', tagline_sub: '' },
  },
  galeria: Array.from({ length: 6 }, () => ({ url: '', alt: '', categoria: '' })),
  catalogo: { filename: null as string | null, updatedAt: null as string | null },
})

// Load current config on mount
onMounted(async () => {
  try {
    const data = await $fetch<any>('/api/admin/config')
    if (data.contact) Object.assign(form.contact, data.contact)
    if (data.texts?.hero) Object.assign(form.texts.hero, data.texts.hero)
    if (data.texts?.about) Object.assign(form.texts.about, data.texts.about)
    if (data.texts?.footer) Object.assign(form.texts.footer, data.texts.footer)
    if (data.galeria) {
      data.galeria.forEach((item: any, i: number) => {
        if (i < 6) {
          form.galeria[i] = { url: item.url || '', alt: item.alt || '', categoria: item.categoria || '' }
        }
      })
    }
    if (data.catalogo) form.catalogo = data.catalogo
  } catch (e) {
    console.error('Failed to load config', e)
  }
})

// ---- Image upload ----
function handleFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    alert('La imagen debe ser menor de 2MB')
    return
  }
  const reader = new FileReader()
  reader.onload = (ev) => {
    pendingUpload.value = { file, base64: ev.target?.result as string }
  }
  reader.readAsDataURL(file)
}

function assignToSlot(index: number) {
  if (!pendingUpload.value) return
  uploading.value = true
  const { file } = pendingUpload.value

  const formData = new FormData()
  formData.append('file', file)
  formData.append('slot', String(index))

  $fetch('/api/admin/galeria-upload', { method: 'POST', body: formData })
    .then((res: any) => {
      form.galeria[index] = { url: res.url, alt: form.galeria[index].alt, categoria: form.galeria[index].categoria }
      pendingUpload.value = null
    })
    .catch(() => { alert('Error subiendo la imagen') })
    .finally(() => { uploading.value = false })
}

function removeImage(index: number) {
  form.galeria[index] = { url: '', alt: '', categoria: '' }
}

// ---- Save functions ----
async function saveGaleria() {
  saving.value = true
  saveSuccess.value = false
  try {
    await $fetch('/api/admin/galeria', { method: 'PUT', body: { galeria: form.galeria } })
    showSuccess()
  } catch { alert('Error guardando') }
  finally { saving.value = false }
}

async function saveTexts() {
  saving.value = true
  saveSuccess.value = false
  try {
    await $fetch('/api/admin/config', { method: 'PUT', body: { texts: form.texts } })
    showSuccess()
  } catch { alert('Error guardando') }
  finally { saving.value = false }
}

async function saveContact() {
  saving.value = true
  saveSuccess.value = false
  try {
    await $fetch('/api/admin/config', { method: 'PUT', body: { contact: form.contact } })
    showSuccess()
  } catch { alert('Error guardando') }
  finally { saving.value = false }
}

function handlePdfSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.type !== 'application/pdf') {
    alert('Solo se permiten archivos PDF')
    return
  }
  uploadingPdf.value = true
  const formData = new FormData()
  formData.append('file', file)
  $fetch('/api/admin/catalogo', { method: 'POST', body: formData })
    .then((res: any) => {
      form.catalogo = { filename: res.filename, updatedAt: res.updatedAt }
    })
    .catch(() => { alert('Error subiendo el PDF') })
    .finally(() => { uploadingPdf.value = false })
}

function showSuccess() {
  saveSuccess.value = true
  setTimeout(() => { saveSuccess.value = false }, 3000)
}
</script>