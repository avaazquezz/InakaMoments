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
        { key: 'desmontaje_precio', label: 'Precio desmontaje (€)', type: 'number', default: SETTINGS_DEFAULTS.desmontaje_precio },
        { key: 'km_incluidos', label: 'Km incluidos', type: 'number', default: SETTINGS_DEFAULTS.km_incluidos },
        { key: 'plus_gasolina', label: 'Texto plus de gasolina', default: SETTINGS_DEFAULTS.plus_gasolina },
        { key: 'umbral_detallito', label: 'Umbral detallito gratis (€)', type: 'number', default: SETTINGS_DEFAULTS.umbral_detallito },
        { key: 'antelacion_dias', label: 'Antelación mínima (días)', type: 'number', default: SETTINGS_DEFAULTS.antelacion_dias },
        { key: 'pago_al_agendar', label: 'Pago al agendar', type: 'checkbox', default: SETTINGS_DEFAULTS.pago_al_agendar },
        { key: 'fianza_alquiler', label: 'Texto fianza alquiler', default: SETTINGS_DEFAULTS.fianza_alquiler },
        { key: 'bizum_telefono', label: 'Teléfono Bizum (reserva)' },
        { key: 'senal_porcentaje', label: 'Porcentaje de la reserva (%)', type: 'number', default: 50 },
        { key: 'moneda', label: 'Moneda', default: 'EUR' },
      ]"
    />

    <!-- Hero (home) -->
    <AdminSiteContentEditor
      v-if="activeTab === 'hero'"
      section="hero"
      title="Portada (hero)"
      :fields="[
        { key: 'tagline', label: 'Etiqueta pequeña', default: 'Eventos con alma' },
        { key: 'titulo', label: 'Título', default: 'Momentos que ' },
        { key: 'titulo_span', label: 'Título (resaltado)', default: 'perduran' },
        { key: 'subtitulo', label: 'Subtítulo', type: 'textarea', default: 'Diseñamos experiencias únicas para cumpleaños, baby showers, comuniones y toda celebración que merezca ser recordada. Cada detalle cuidado con mimo para que tu historia sea inolvidable.' },
        { key: 'cta_principal', label: 'Botón principal', default: 'Diseñar mi evento' },
        { key: 'cta_secundario', label: 'Botón secundario', default: 'Descargar Catálogo' },
      ]"
    />

    <!-- Sobre nosotros (home) -->
    <AdminSiteContentEditor
      v-if="activeTab === 'about'"
      section="about"
      title="Sobre nosotros (home)"
      :fields="[
        { key: 'titulo_principal', label: 'Título', default: 'Cada momento,' },
        { key: 'titulo_secundario', label: 'Título (resaltado)', default: 'una obra de arte.' },
        { key: 'quote', label: 'Cita', type: 'textarea', default: 'Nació de la pasión por transformar espacios en recuerdos. De la creencia de que los detalles lo son todo.' },
      ]"
    />

    <!-- Footer -->
    <AdminSiteContentEditor
      v-if="activeTab === 'footer'"
      section="footer"
      title="Pie de página"
      :fields="[
        { key: 'tagline_titulo', label: 'Frase (línea 1)', default: 'Cada detalle,' },
        { key: 'tagline_span', label: 'Frase (línea 2, resaltada)', default: 'una historia.' },
        { key: 'tagline_sub', label: 'Frase (descripción)', type: 'textarea', default: 'Creamos experiencias únicas para los momentos más importantes de tu vida. Con alma, con mimo, con arte.' },
      ]"
    />

    <!-- Contacto -->
    <AdminSiteContentEditor
      v-if="activeTab === 'contacto'"
      section="contacto"
      title="Datos de contacto"
      :fields="[
        { key: 'email', label: 'Email de contacto', default: 'nadine.tcae@gmail.com' },
        { key: 'telefono', label: 'Teléfono público (vacío = oculto en la web)', default: '' },
        { key: 'ubicacion', label: 'Ubicación', default: 'Abrera, Cataluña, España' },
        { key: 'instagram', label: 'URL de Instagram', default: 'https://www.instagram.com/inaka.moments' },
        { key: 'horario.disponibilidad', label: 'Disponibilidad (línea corta)', default: 'Respondemos en menos de 24 horas, todos los días' },
        { key: 'horario.mensaje', label: 'Mensaje de horario', type: 'textarea', default: 'Ofrecemos la máxima calidad de servicio a nuestros clientes en todo momento.' },
      ]"
    />

    <!-- Ocasiones (SEO por landing) -->
    <div
      v-if="activeTab === 'ocasiones'"
      class="max-w-2xl rounded-2xl bg-white p-5 ring-1 ring-inaka-nude"
    >
      <h3 class="mb-1 text-sm font-bold text-inaka-terra">
        Landings de ocasiones
      </h3>
      <p class="mb-4 text-xs text-inaka-terra/50">
        Título, introducción, SEO y productos destacados de cada página /ocasiones/&lt;slug&gt;.
      </p>
      <div
        v-if="pendingOccasions"
        class="h-24 animate-pulse rounded-xl bg-inaka-cream"
      />
      <ul
        v-else
        class="divide-y divide-inaka-nude/70"
      >
        <li
          v-for="oc in occasions"
          :key="oc.slug"
        >
          <NuxtLink
            :to="`/admin/contenido/ocasiones/${oc.slug}`"
            class="flex items-center justify-between gap-3 py-3 text-sm text-inaka-terra hover:text-inaka-gold"
          >
            <span class="font-medium">{{ oc.title }}</span>
            <span
              class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              :class="oc.published ? 'bg-inaka-gold/20 text-inaka-terra' : 'bg-inaka-nude/60 text-inaka-terra/50'"
            >{{ oc.published ? 'Publicada' : 'Borrador' }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

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
import { SETTINGS_DEFAULTS } from '~/composables/useBusinessRules'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Contenido y ajustes — Panel Inaka Moments' })

const tabs = [
  { id: 'faqs', label: 'FAQs' },
  { id: 'reglas', label: 'Reglas de negocio' },
  { id: 'hero', label: 'Portada' },
  { id: 'about', label: 'Sobre nosotros' },
  { id: 'footer', label: 'Pie de página' },
  { id: 'contacto', label: 'Contacto' },
  { id: 'ocasiones', label: 'Ocasiones' },
  { id: 'pdf', label: 'PDF catálogo' },
] as const

const activeTab = ref<(typeof tabs)[number]['id']>('faqs')

const toast = useToast()

interface AdminOccasion { slug: string, title: string, published: boolean }
const { data: occasions, pending: pendingOccasions } = await useFetch<AdminOccasion[]>('/api/admin/occasions')
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
