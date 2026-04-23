<template>
  <div>
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-500 text-sm mt-1">Gestiona el contenido de tu web</p>
    </div>

    <!-- Quick stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Imágenes galería</p>
        <p class="text-3xl font-bold text-gray-800">{{ config?.galeria?.length || 0 }} / 6</p>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Catálogo PDF</p>
        <p class="text-lg font-semibold text-gray-800">
          {{ config?.catalogo?.filename ? '✓ Subido' : '— Sin archivo' }}
        </p>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Email de contacto</p>
        <p class="text-sm font-semibold text-gray-800 truncate">{{ config?.contact?.email || '—' }}</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Tab bar -->
      <div class="border-b border-gray-100 px-6 flex gap-6 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
          :class="activeTab === tab.id
            ? 'border-gray-800 text-gray-900'
            : 'border-transparent text-gray-400 hover:text-gray-600'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="p-6">
        <!-- ── GALERÍA ── -->
        <div v-if="activeTab === 'galeria'">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Galería de imágenes</h2>
              <p class="text-sm text-gray-500 mt-0.5">6 imágenes máximo · Reemplaza o elimina cada slot</p>
            </div>
            <span class="text-xs font-medium px-3 py-1 rounded-full" :class="(config?.galeria?.length || 0) === 6 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
              {{ config?.galeria?.length || 0 }}/6
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div
              v-for="(img, idx) in 6"
              :key="idx"
              class="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group"
              :class="getGaleriaItem(idx) ? 'border-solid border-gray-300' : 'border-dashed'"
            >
              <!-- Con imagen -->
              <template v-if="getGaleriaItem(idx)">
                <img
                  :src="getGaleriaItem(idx).url"
                  :alt="getGaleriaItem(idx).alt"
                  class="w-full h-full object-cover"
                />
                <!-- Overlay acciones -->
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label class="cursor-pointer bg-white text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    Cambiar
                    <input type="file" accept="image/*" class="hidden" @change="replaceImage(idx, $event)" />
                  </label>
                  <button
                    type="button"
                    class="bg-white text-red-600 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    @click="removeImage(idx)"
                  >
                    Eliminar
                  </button>
                </div>
                <!-- Categoria badge -->
                <span class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                  <span class="text-white text-xs font-medium">{{ getGaleriaItem(idx).categoria }}</span>
                </span>
              </template>

              <!-- Slot vacío -->
              <template v-else>
                <label
                  class="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <span class="text-3xl text-gray-300 mb-2">+</span>
                  <span class="text-xs text-gray-400">Añadir imagen</span>
                  <input type="file" accept="image/*" class="hidden" @change="uploadImage(idx, $event)" />
                </label>
              </template>
            </div>
          </div>

          <div v-if="saveSuccess" class="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            ✓ Cambios guardados correctamente
          </div>

          <button
            v-if="hasGalleryChanges"
            type="button"
            :disabled="saving"
            class="mt-6 rounded-lg bg-gray-800 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            @click="saveGallery"
          >
            {{ saving ? 'Guardando…' : 'Guardar cambios' }}
          </button>
        </div>

        <!-- ── TEXTOS ── -->
        <div v-else-if="activeTab === 'textos'">
          <div class="space-y-8">
            <!-- Hero -->
            <div>
              <h3 class="text-base font-bold text-gray-900 mb-4">Hero — Página de inicio</h3>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">Tagline</label>
                  <input v-model="editTexts.hero.tagline" type="text" class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">Título (antes del span)</label>
                  <input v-model="editTexts.hero.titulo" type="text" class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">Palabra destacada (span)</label>
                  <input v-model="editTexts.hero.titulo_span" type="text" class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">Botón CTA principal</label>
                  <input v-model="editTexts.hero.cta_principal" type="text" class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                </div>
                <div class="sm:col-span-2 flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">Subtítulo</label>
                  <textarea v-model="editTexts.hero.subtitulo" rows="2" class="resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                </div>
              </div>
            </div>

            <!-- About -->
            <div class="border-t border-gray-100 pt-8">
              <h3 class="text-base font-bold text-gray-900 mb-4">About — Página de inicio</h3>
              <div class="space-y-4">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700">Título principal</label>
                    <input v-model="editTexts.about.titulo_principal" type="text" class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700">Título secundario (cursiva)</label>
                    <input v-model="editTexts.about.titulo_secundario" type="text" class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">Párrafo 1</label>
                  <textarea v-model="editTexts.about.parrafo_1" rows="2" class="resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">Párrafo 2</label>
                  <textarea v-model="editTexts.about.parrafo_2" rows="2" class="resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">Cita</label>
                  <input v-model="editTexts.about.quote" type="text" class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="border-t border-gray-100 pt-8">
              <h3 class="text-base font-bold text-gray-900 mb-4">Footer</h3>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">Tagline título</label>
                  <input v-model="editTexts.footer.tagline_titulo" type="text" class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">Tagline palabra destacada</label>
                  <input v-model="editTexts.footer.tagline_span" type="text" class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                </div>
              </div>
            </div>

            <div v-if="saveSuccess" class="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              ✓ Cambios guardados correctamente
            </div>

            <button
              v-if="hasTextChanges"
              type="button"
              :disabled="saving"
              class="rounded-lg bg-gray-800 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              @click="saveTexts"
            >
              {{ saving ? 'Guardando…' : 'Guardar textos' }}
            </button>
          </div>
        </div>

        <!-- ── CONTACTO ── -->
        <div v-else-if="activeTab === 'contacto'">
          <div class="space-y-6">
            <div>
              <h3 class="text-base font-bold text-gray-900 mb-4">Datos de contacto</h3>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">Email</label>
                  <input v-model="editContact.email" type="email" class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">WhatsApp</label>
                  <input v-model="editContact.whatsapp" type="tel" placeholder="+34 600 000 000" class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">Ubicación</label>
                  <input v-model="editContact.ubicacion" type="text" class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">Instagram URL</label>
                  <input v-model="editContact.instagram" type="url" placeholder="https://www.instagram.com/inaka.moments" class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
                </div>
              </div>
            </div>

            <div v-if="saveSuccess" class="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              ✓ Cambios guardados correctamente
            </div>

            <button
              v-if="hasContactChanges"
              type="button"
              :disabled="saving"
              class="rounded-lg bg-gray-800 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              @click="saveContact"
            >
              {{ saving ? 'Guardando…' : 'Guardar contacto' }}
            </button>
          </div>
        </div>

        <!-- ── CATÁLOGO ── -->
        <div v-else-if="activeTab === 'catalogo'">
          <h3 class="text-base font-bold text-gray-900 mb-1">Catálogo PDF</h3>
          <p class="text-sm text-gray-500 mb-6">Sube el catálogo para que los visitantes puedan descargarlo desde la web.</p>

          <div v-if="currentCatalogo?.filename" class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ currentCatalogo.filename }}</p>
              <p class="text-xs text-gray-400 mt-0.5">
                Subido el {{ new Date(currentCatalogo.updatedAt).toLocaleDateString('es-ES') }}
              </p>
            </div>
            <button
              type="button"
              class="text-sm text-red-600 font-medium hover:text-red-700 transition-colors"
              @click="deleteCatalogo"
            >
              Eliminar
            </button>
          </div>

          <label class="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 text-sm font-semibold text-white cursor-pointer transition-opacity hover:opacity-90">
            <span>{{ uploading ? 'Subiendo…' : 'Subir catálogo PDF' }}</span>
            <input type="file" accept="application/pdf" class="hidden" :disabled="uploading" @change="uploadCatalogo" />
          </label>

          <div v-if="uploadError" class="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {{ uploadError }}
          </div>

          <div v-if="saveSuccess" class="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            ✓ Catálogo actualizado correctamente
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const activeTab = ref('galeria')
const tabs = [
  { id: 'galeria', label: '📷 Galería' },
  { id: 'textos', label: '✏️ Textos' },
  { id: 'contacto', label: '📧 Contacto' },
  { id: 'catalogo', label: '📄 Catálogo PDF' },
]

const { data: config } = await useFetch<any>('/api/admin/config')

const editTexts = reactive(JSON.parse(JSON.stringify(config.value?.texts || {})))
const editContact = reactive(JSON.parse(JSON.stringify(config.value?.contact || {})))

const saving = ref(false)
const saveSuccess = ref(false)
const uploading = ref(false)
const uploadError = ref('')
const currentCatalogo = ref(config.value?.catalogo || null)

// Pending uploads (new files not yet saved)
const pendingUploads = ref<{ idx: number; file: File; preview: string }[]>([])
const pendingRemovals = ref<number[]>([])
const localGaleria = ref<any[]>([... (config.value?.galeria || [])])

function getGaleriaItem(idx: number) {
  return localGaleria.value[idx] || null
}

function hasChanges(a: any[], b: any[]) {
  return JSON.stringify(a) !== JSON.stringify(b)
}

const hasGalleryChanges = computed(() => {
  return pendingUploads.value.length > 0 || pendingRemovals.value.length > 0
})

const hasTextChanges = computed(() => {
  return JSON.stringify(editTexts) !== JSON.stringify(config.value?.texts)
})

const hasContactChanges = computed(() => {
  return JSON.stringify(editContact) !== JSON.stringify(config.value?.contact)
})

async function uploadImage(idx: number, event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const preview = URL.createObjectURL(file)
  pendingUploads.value.push({ idx, file, preview })
  localGaleria.value[idx] = { url: preview, alt: `Imagen ${idx + 1}`, categoria: 'General' }
}

async function replaceImage(idx: number, event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const preview = URL.createObjectURL(file)
  const existing = localGaleria.value[idx] || {}
  localGaleria.value[idx] = { ...existing, url: preview }
  pendingUploads.value = pendingUploads.value.filter(p => p.idx !== idx)
  pendingUploads.value.push({ idx, file, preview })
}

function removeImage(idx: number) {
  if (localGaleria.value[idx]?.url?.startsWith('blob:')) {
    URL.revokeObjectURL(localGaleria.value[idx].url)
  }
  localGaleria.value[idx] = null
  pendingRemovals.value.push(idx)
}

async function saveGallery() {
  saving.value = true
  saveSuccess.value = false
  try {
    // In a real implementation, we'd upload files to a storage API here
    // For now, we store the data URL / blob URL references
    await $fetch('/api/admin/galeria', {
      method: 'PUT',
      body: { galeria: localGaleria.value.filter(Boolean) },
    })
    saveSuccess.value = true
    pendingUploads.value = []
    pendingRemovals.value = []
    setTimeout(() => (saveSuccess.value = false), 3000)
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

async function saveTexts() {
  saving.value = true
  saveSuccess.value = false
  try {
    await $fetch('/api/admin/config', {
      method: 'PUT',
      body: { texts: editTexts },
    })
    saveSuccess.value = true
    setTimeout(() => (saveSuccess.value = false), 3000)
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

async function saveContact() {
  saving.value = true
  saveSuccess.value = false
  try {
    await $fetch('/api/admin/config', {
      method: 'PUT',
      body: { contact: editContact },
    })
    saveSuccess.value = true
    setTimeout(() => (saveSuccess.value = false), 3000)
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

async function uploadCatalogo(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  uploadError.value = ''
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ filename: string }>('/api/admin/catalogo', {
      method: 'POST',
      body: fd,
    })
    currentCatalogo.value = { filename: res.filename, updatedAt: new Date().toISOString() }
    saveSuccess.value = true
    setTimeout(() => (saveSuccess.value = false), 3000)
  } catch (e: any) {
    uploadError.value = e?.data?.message || 'Error al subir el archivo'
  } finally {
    uploading.value = false
  }
}

async function deleteCatalogo() {
  currentCatalogo.value = null
}
</script>
