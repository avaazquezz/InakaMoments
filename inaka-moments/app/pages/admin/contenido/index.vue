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

    <!-- Textos web -->
    <div v-if="activeTab === 'textos'" class="flex flex-col gap-4">
      <AdminSiteContentEditor
        section="hero"
        title="Portada (Hero)"
        :fields="[
          { key: 'tagline', label: 'Tagline' },
          { key: 'titulo', label: 'Título' },
          { key: 'titulo_span', label: 'Título (resaltado)' },
          { key: 'subtitulo', label: 'Subtítulo', type: 'textarea' },
          { key: 'cta_principal', label: 'Botón principal' },
          { key: 'cta_secundario', label: 'Botón secundario' },
        ]"
      />
      <AdminSiteContentEditor
        section="about"
        title="Sobre nosotros"
        :fields="[
          { key: 'titulo_principal', label: 'Título principal' },
          { key: 'titulo_secundario', label: 'Título secundario' },
          { key: 'parrafo_1', label: 'Párrafo 1', type: 'textarea' },
          { key: 'parrafo_2', label: 'Párrafo 2', type: 'textarea' },
          { key: 'quote', label: 'Cita' },
          { key: 'cta_enlace', label: 'Texto del enlace' },
        ]"
      />
      <AdminSiteContentEditor
        section="footer"
        title="Pie de página"
        :fields="[
          { key: 'tagline_titulo', label: 'Título' },
          { key: 'tagline_span', label: 'Título (resaltado)' },
          { key: 'tagline_sub', label: 'Subtítulo', type: 'textarea' },
        ]"
      />
      <AdminSiteContentEditor
        section="contacto"
        title="Datos de contacto"
        :fields="[
          { key: 'email', label: 'Email' },
          { key: 'ubicacion', label: 'Ubicación' },
          { key: 'instagram', label: 'URL de Instagram' },
          { key: 'horario.lunes_viernes', label: 'Horario lunes-viernes' },
          { key: 'horario.sabados', label: 'Horario sábados' },
          { key: 'horario.domingos', label: 'Horario domingos' },
        ]"
      />
    </div>

    <!-- FAQs -->
    <AdminFaqManager v-if="activeTab === 'faqs'" />

    <!-- Ocasiones -->
    <div v-if="activeTab === 'ocasiones'" class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
      <h3 class="mb-4 text-sm font-bold text-inaka-terra">Ocasiones (páginas SEO)</h3>
      <div v-if="pendingOccasions" class="h-32 animate-pulse rounded-xl bg-inaka-cream" />
      <ul v-else class="flex flex-col divide-y divide-inaka-nude/70">
        <li v-for="oc in occasions" :key="oc.slug" class="flex items-center justify-between gap-3 py-3">
          <div>
            <p class="text-sm font-semibold text-inaka-terra">{{ oc.title }}</p>
            <p class="text-xs text-inaka-terra/50">/ocasiones/{{ oc.slug }} · {{ oc.published ? 'Publicada' : 'Oculta' }}</p>
          </div>
          <NuxtLink :to="`/admin/contenido/ocasiones/${oc.slug}`" class="text-xs font-semibold text-inaka-gold hover:underline">Editar</NuxtLink>
        </li>
      </ul>
    </div>

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
        { key: 'moneda', label: 'Moneda' },
      ]"
    />

    <!-- PDF del catálogo -->
    <div v-if="activeTab === 'pdf'" class="max-w-md rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
      <h3 class="mb-2 text-sm font-bold text-inaka-terra">PDF del catálogo</h3>
      <p class="mb-4 text-xs text-inaka-terra/50">Sustituye el catálogo descargable. El enlace público no cambia.</p>
      <label class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-inaka-beige px-6 py-10 text-inaka-terra/50 hover:border-inaka-terra/40">
        <svg v-if="!uploadingPdf" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
        <svg v-else class="h-6 w-6 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        <span class="text-xs font-medium">{{ uploadingPdf ? 'Subiendo…' : 'Subir nuevo PDF' }}</span>
        <input type="file" accept="application/pdf" class="hidden" :disabled="uploadingPdf" @change="onPdfSelect" />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Contenido y ajustes — Panel Inaka Moments' })

const tabs = [
  { id: 'textos', label: 'Textos web' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'ocasiones', label: 'Ocasiones' },
  { id: 'reglas', label: 'Reglas de negocio' },
  { id: 'pdf', label: 'PDF catálogo' },
] as const

const activeTab = ref<(typeof tabs)[number]['id']>('textos')

interface AdminOccasion { slug: string, title: string, published: boolean }
const { data: occasions, pending: pendingOccasions } = await useFetch<AdminOccasion[]>('/api/admin/occasions')

const toast = useToast()
const uploadingPdf = ref(false)

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
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido subir el PDF.')
  }
  finally {
    uploadingPdf.value = false
  }
}
</script>
