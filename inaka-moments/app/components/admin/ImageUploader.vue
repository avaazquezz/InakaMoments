<template>
  <div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
    <div
      v-for="(path, i) in modelValue"
      :key="path"
      class="group relative aspect-square overflow-hidden rounded-xl border border-inaka-beige bg-inaka-nude/30"
    >
      <img :src="storagePublicUrl(bucket, path)" class="h-full w-full object-cover" :alt="`Imagen ${i + 1}`" />
      <span v-if="i === 0" class="absolute left-1.5 top-1.5 rounded bg-inaka-terra px-1.5 py-0.5 text-[10px] font-bold text-inaka-cream">Portada</span>
      <div class="absolute inset-0 flex items-center justify-center gap-1.5 bg-inaka-terra/50 transition-all md:bg-inaka-terra/0 md:opacity-0 md:group-hover:bg-inaka-terra/50 md:group-hover:opacity-100 md:focus-within:opacity-100">
        <button type="button" class="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-inaka-terra disabled:opacity-30" :disabled="i === 0" aria-label="Mover antes" @click="moveUp(i)">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button type="button" class="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-inaka-terra disabled:opacity-30" :disabled="i === modelValue.length - 1" aria-label="Mover después" @click="moveDown(i)">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
        <button type="button" class="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600" aria-label="Quitar imagen" @click="remove(i)">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>

    <div v-for="u in uploading" :key="u.tempId" class="relative aspect-square overflow-hidden rounded-xl border border-inaka-beige">
      <img :src="u.previewUrl" class="h-full w-full object-cover opacity-40" alt="Subiendo…" />
      <div class="absolute inset-0 flex items-center justify-center bg-white/50">
        <svg v-if="!u.error" class="h-6 w-6 animate-spin text-inaka-terra" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        <span v-else class="rounded bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white">Error</span>
      </div>
    </div>

    <label
      v-if="!max || modelValue.length + uploading.length < max"
      class="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-inaka-beige text-inaka-terra/40 transition-colors hover:border-inaka-terra/50 hover:text-inaka-terra/70"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
      <span class="text-xs font-medium">Añadir</span>
      <input type="file" accept="image/*" multiple class="hidden" @change="onSelect" />
    </label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  bucket: 'gallery' | 'catalog-media'
  modelValue: string[]
  max?: number
}>()

const emit = defineEmits<{ 'update:modelValue': [string[]], 'uploaded': [path: string] }>()

const toast = useToast()

interface UploadingItem { tempId: number, previewUrl: string, error?: boolean }
const uploading = ref<UploadingItem[]>([])
let nextTempId = 1

function onSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) handleFiles(Array.from(input.files))
  input.value = ''
}

function onDrop(e: DragEvent) {
  if (e.dataTransfer?.files) handleFiles(Array.from(e.dataTransfer.files))
}

async function handleFiles(files: File[]) {
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue
    const tempId = nextTempId++
    const previewUrl = URL.createObjectURL(file)
    uploading.value = [...uploading.value, { tempId, previewUrl }]

    try {
      const form = new FormData()
      form.append('bucket', props.bucket)
      form.append('file', file)
      const res = await $fetch<{ path: string }>('/api/admin/upload', { method: 'POST', body: form })
      emit('update:modelValue', [...props.modelValue, res.path])
      emit('uploaded', res.path)
      uploading.value = uploading.value.filter(u => u.tempId !== tempId)
      URL.revokeObjectURL(previewUrl)
    }
    catch (err: any) {
      const item = uploading.value.find(u => u.tempId === tempId)
      if (item) item.error = true
      toast.error(err?.data?.message ?? 'No se pudo subir la imagen.')
      setTimeout(() => {
        uploading.value = uploading.value.filter(u => u.tempId !== tempId)
        URL.revokeObjectURL(previewUrl)
      }, 2500)
    }
  }
}

function remove(i: number) {
  const next = [...props.modelValue]
  next.splice(i, 1)
  emit('update:modelValue', next)
}

function moveUp(i: number) {
  if (i === 0) return
  const next = [...props.modelValue]
  ;[next[i - 1], next[i]] = [next[i]!, next[i - 1]!]
  emit('update:modelValue', next)
}

function moveDown(i: number) {
  if (i === props.modelValue.length - 1) return
  const next = [...props.modelValue]
  ;[next[i + 1], next[i]] = [next[i]!, next[i + 1]!]
  emit('update:modelValue', next)
}
</script>
