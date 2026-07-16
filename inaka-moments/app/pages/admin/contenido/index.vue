<template>
  <div class="flex flex-col gap-5">
    <!-- Pestañas -->
    <div class="flex flex-wrap gap-2 border-b border-inaka-beige pb-3">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
        :class="activeTab === tab.id ? 'bg-inaka-terra text-inaka-cream' : 'bg-inaka-nude/60 text-inaka-terra/70 hover:bg-inaka-nude'"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- FAQs -->
    <AdminFaqManager v-if="activeTab === 'faqs'" />

    <!-- Reglas de negocio -->
    <AdminSiteContentEditor
      v-if="activeTab === 'reglas'"
      section="settings"
      title="Reglas de negocio"
      :fields="[
        { key: 'desmontaje_precio', label: 'Precio desmontaje (€)', type: 'number' },
        { key: 'km_incluidos', label: 'Km incluidos', type: 'number' },
        { key: 'plus_gasolina', label: 'Texto plus de gasolina' },
        { key: 'umbral_detallito', label: 'Umbral detallito gratis (€)', type: 'number' },
        { key: 'antelacion_dias', label: 'Antelación mínima (días)', type: 'number' },
        { key: 'pago_al_agendar', label: 'Pago al agendar', type: 'checkbox' },
        { key: 'fianza_alquiler', label: 'Texto fianza alquiler' },
        { key: 'bizum_telefono', label: 'Teléfono Bizum (reserva)' },
        { key: 'senal_porcentaje', label: 'Porcentaje de la reserva (%)', type: 'number' },
        { key: 'moneda', label: 'Moneda' },
      ]"
    />

    <!-- PDF del catálogo -->
    <div
      v-if="activeTab === 'pdf'"
      class="max-w-md rounded-2xl bg-white p-5 ring-1 ring-inaka-nude"
    >
      <h3 class="mb-2 text-sm font-bold text-inaka-terra">
        PDF del catálogo
      </h3>
      <p class="mb-4 text-xs text-inaka-terra/50">
        El PDF que se descarga desde la web. El enlace público no cambia al reemplazarlo.
      </p>

      <div
        v-if="pendingPdfStatus"
        class="h-16 animate-pulse rounded-xl bg-inaka-cream"
      />
      <template v-else>
        <div
          v-if="pdfStatus?.exists"
          class="mb-4 flex items-center justify-between gap-3 rounded-xl bg-inaka-cream px-4 py-3"
        >
          <div class="min-w-0">
            <a
              :href="catalogPdfUrl"
              target="_blank"
              rel="noopener"
              class="text-sm font-semibold text-inaka-gold hover:underline"
            >Ver catálogo actual</a>
            <p
              v-if="pdfStatus.updatedAt"
              class="mt-0.5 text-xs text-inaka-terra/50"
            >
              Actualizado el {{ formatFecha(pdfStatus.updatedAt) }}
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 text-xs font-semibold text-red-500 hover:underline"
            @click="confirmingDeletePdf = true"
          >
            Borrar
          </button>
        </div>
        <p
          v-else
          class="mb-4 text-xs text-inaka-terra/50"
        >
          Sin catálogo subido todavía.
        </p>

        <label class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-inaka-beige px-6 py-10 text-inaka-terra/50 hover:border-inaka-terra/40">
          <svg
            v-if="!uploadingPdf"
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4"
          /></svg>
          <svg
            v-else
            class="h-6 w-6 animate-spin"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          /></svg>
          <span class="text-xs font-medium">{{ uploadingPdf ? 'Subiendo…' : (pdfStatus?.exists ? 'Subir y reemplazar' : 'Subir PDF') }}</span>
          <input
            type="file"
            accept="application/pdf"
            class="hidden"
            :disabled="uploadingPdf"
            @change="onPdfSelect"
          >
        </label>
      </template>
    </div>

    <AdminConfirmDialog
      :open="confirmingDeletePdf"
      title="¿Borrar el catálogo actual?"
      message="La web se quedará sin PDF descargable hasta que subas uno nuevo."
      danger
      @cancel="confirmingDeletePdf = false"
      @confirm="deletePdf"
    />
  </div>
</template>

<script setup lang="ts">
import { CATALOG_PDF_PATH } from '~~/shared/catalogPdf'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Contenido y ajustes — Panel Inaka Moments' })

const tabs = [
  { id: 'faqs', label: 'FAQs' },
  { id: 'reglas', label: 'Reglas de negocio' },
  { id: 'pdf', label: 'PDF catálogo' },
] as const

const activeTab = ref<(typeof tabs)[number]['id']>('faqs')

const toast = useToast()
const uploadingPdf = ref(false)
const catalogPdfUrl = storagePublicUrl('catalog', CATALOG_PDF_PATH)

interface CatalogPdfStatus { exists: boolean, updatedAt: string | null }
const { data: pdfStatus, pending: pendingPdfStatus, refresh: refreshPdfStatus } = await useFetch<CatalogPdfStatus>('/api/admin/catalog-pdf')

async function onPdfSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  uploadingPdf.value = true
  try {
    const form = new FormData()
    form.append('file', file)
    await $fetch('/api/admin/catalog-pdf', { method: 'POST', body: form })
    toast.success('PDF actualizado.')
    await refreshPdfStatus()
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido subir el PDF.'))
  }
  finally {
    uploadingPdf.value = false
  }
}

const confirmingDeletePdf = ref(false)
async function deletePdf() {
  try {
    await $fetch('/api/admin/catalog-pdf', { method: 'DELETE' })
    toast.success('Catálogo borrado.')
    await refreshPdfStatus()
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido borrar el catálogo.'))
  }
  finally {
    confirmingDeletePdf.value = false
  }
}

function formatFecha(iso: string): string {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
}
</script>
