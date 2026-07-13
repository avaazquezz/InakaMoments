<template>
  <div class="flex flex-col gap-6">
    <div v-if="pending" class="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude" />

    <template v-else-if="album">
      <!-- Datos del álbum -->
      <form class="grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 ring-1 ring-inaka-nude sm:grid-cols-2" @submit.prevent="saveAlbum">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-inaka-terra">Título</label>
          <input v-model="form.title" type="text" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-inaka-terra">Ocasión</label>
          <select v-model="form.event_type" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra">
            <option v-for="et in EVENT_TYPES" :key="et" :value="et">{{ EVENT_TYPE_LABELS[et] }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-inaka-terra">Fecha</label>
          <input v-model="form.event_date" type="date" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
        </div>
        <label class="mt-6 flex items-center gap-2">
          <input v-model="form.published" type="checkbox" class="h-4 w-4 accent-inaka-terra" />
          <span class="text-sm text-inaka-terra">Publicado (visible en la galería pública)</span>
        </label>
        <div class="flex items-center gap-4 sm:col-span-2">
          <button type="submit" :disabled="savingAlbum" class="rounded-xl bg-inaka-terra px-6 py-2.5 text-sm font-semibold text-inaka-cream hover:opacity-90">
            {{ savingAlbum ? 'Guardando…' : 'Guardar álbum' }}
          </button>
          <button type="button" class="text-sm font-semibold text-red-500 hover:underline" @click="confirmingDelete = true">Borrar álbum</button>
        </div>
      </form>

      <!-- Fotos -->
      <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
        <h2 class="mb-4 text-sm font-bold text-inaka-terra">Fotos</h2>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div v-for="img in album.gallery_images" :key="img.id" class="group relative aspect-square overflow-hidden rounded-xl border border-inaka-beige bg-inaka-nude/30">
            <img :src="storagePublicUrl('gallery', img.storage_path)" class="h-full w-full object-cover" :alt="img.alt ?? ''" />
            <span v-if="album.cover_image_id === img.id" class="absolute left-1.5 top-1.5 rounded bg-inaka-terra px-1.5 py-0.5 text-[10px] font-bold text-inaka-cream">Portada</span>
            <span v-if="img.featured" class="absolute right-1.5 top-1.5 rounded bg-inaka-gold px-1.5 py-0.5 text-[10px] font-bold text-inaka-terra">★</span>
            <div class="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-inaka-terra/0 p-1 opacity-0 transition-all group-hover:bg-inaka-terra/60 group-hover:opacity-100">
              <button type="button" class="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-inaka-terra" @click="setCover(img.id)">Portada</button>
              <button type="button" class="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-inaka-terra" @click="toggleFeatured(img)">{{ img.featured ? 'Quitar ★' : 'Destacar' }}</button>
              <button type="button" class="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-red-600" @click="imageToDelete = img.id">Borrar</button>
            </div>
          </div>

          <div v-for="u in uploading" :key="u.tempId" class="relative aspect-square overflow-hidden rounded-xl border border-inaka-beige">
            <img :src="u.previewUrl" class="h-full w-full object-cover opacity-40" alt="Subiendo…" />
            <div class="absolute inset-0 flex items-center justify-center bg-white/50">
              <svg class="h-6 w-6 animate-spin text-inaka-terra" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </div>
          </div>

          <label class="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-inaka-beige text-inaka-terra/40 hover:border-inaka-terra/50 hover:text-inaka-terra/70">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
            <span class="text-xs font-medium">Añadir</span>
            <input type="file" accept="image/*" multiple class="hidden" @change="onSelect" />
          </label>
        </div>
      </div>
    </template>

    <AdminConfirmDialog
      :open="confirmingDelete"
      title="¿Borrar este álbum?"
      message="Se borrarán también todas sus fotos. Esta acción no se puede deshacer."
      danger
      @cancel="confirmingDelete = false"
      @confirm="deleteAlbum"
    />

    <AdminConfirmDialog
      :open="!!imageToDelete"
      title="¿Borrar esta foto?"
      message="Esta acción no se puede deshacer."
      danger
      @cancel="imageToDelete = null"
      @confirm="removeImage"
    />
  </div>
</template>

<script setup lang="ts">
import { EVENT_TYPES, EVENT_TYPE_LABELS, type EventType } from '~~/shared/eventTypes'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Álbum — Panel Inaka Moments' })

interface GalleryImage { id: string, storage_path: string, alt: string | null, featured: boolean, sort_order: number }
interface AlbumDetail {
  id: string
  title: string
  event_type: EventType
  event_date: string | null
  published: boolean
  cover_image_id: string | null
  gallery_images: GalleryImage[]
}

const route = useRoute()
const toast = useToast()

const { data: album, pending, refresh } = await useFetch<AlbumDetail>(`/api/admin/albums/${route.params.id}`)

const form = reactive({ title: '', event_type: 'cumpleanos' as EventType, event_date: '', published: false })
watchEffect(() => {
  if (album.value) {
    form.title = album.value.title
    form.event_type = album.value.event_type
    form.event_date = album.value.event_date ?? ''
    form.published = album.value.published
  }
})

const confirmingDelete = ref(false)
async function deleteAlbum() {
  try {
    await $fetch(`/api/admin/albums/${route.params.id}`, { method: 'DELETE' })
    toast.success('Álbum borrado.')
    await navigateTo('/admin/galeria')
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido borrar el álbum.')
  }
  finally {
    confirmingDelete.value = false
  }
}

const savingAlbum = ref(false)
async function saveAlbum() {
  savingAlbum.value = true
  try {
    await $fetch(`/api/admin/albums/${route.params.id}`, { method: 'PATCH', body: form })
    toast.success('Álbum guardado.')
    await refresh()
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido guardar el álbum.')
  }
  finally {
    savingAlbum.value = false
  }
}

interface UploadingItem { tempId: number, previewUrl: string }
const uploading = ref<UploadingItem[]>([])
let nextTempId = 1

function onSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) handleFiles(Array.from(input.files))
  input.value = ''
}

async function handleFiles(files: File[]) {
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue
    const tempId = nextTempId++
    const previewUrl = URL.createObjectURL(file)
    uploading.value = [...uploading.value, { tempId, previewUrl }]

    try {
      const form2 = new FormData()
      form2.append('bucket', 'gallery')
      form2.append('file', file)
      const res = await $fetch<{ path: string }>('/api/admin/upload', { method: 'POST', body: form2 })
      await $fetch(`/api/admin/albums/${route.params.id}/images`, {
        method: 'POST',
        body: { storage_path: res.path, sort_order: (album.value?.gallery_images.length ?? 0) },
      })
      await refresh()
    }
    catch (err: any) {
      toast.error(err?.data?.message ?? 'No se ha podido subir la foto.')
    }
    finally {
      uploading.value = uploading.value.filter(u => u.tempId !== tempId)
      URL.revokeObjectURL(previewUrl)
    }
  }
}

async function setCover(imageId: string) {
  try {
    await $fetch(`/api/admin/albums/${route.params.id}`, { method: 'PATCH', body: { ...form, cover_image_id: imageId } })
    toast.success('Portada actualizada.')
    await refresh()
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido actualizar la portada.')
  }
}

async function toggleFeatured(img: GalleryImage) {
  try {
    await $fetch(`/api/admin/images/${img.id}`, { method: 'PATCH', body: { featured: !img.featured } })
    await refresh()
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido actualizar la foto.')
  }
}

const imageToDelete = ref<string | null>(null)
async function removeImage() {
  if (!imageToDelete.value) return
  try {
    await $fetch(`/api/admin/images/${imageToDelete.value}`, { method: 'DELETE' })
    toast.success('Foto borrada.')
    await refresh()
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido borrar la foto.')
  }
  finally {
    imageToDelete.value = null
  }
}
</script>
