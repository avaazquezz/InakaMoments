<template>
  <form class="flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-inaka-nude" @submit.prevent="save">
    <h3 class="text-sm font-bold text-inaka-terra">{{ title }}</h3>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div v-for="f in fields" :key="f.key" class="flex flex-col gap-1.5" :class="f.type === 'textarea' ? 'sm:col-span-2' : ''">
        <label class="text-xs font-semibold text-inaka-terra/70">{{ f.label }}</label>
        <textarea v-if="f.type === 'textarea'" v-model="values[f.key]" rows="3" class="resize-none rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
        <label v-else-if="f.type === 'checkbox'" class="flex items-center gap-2 py-2">
          <input v-model="values[f.key]" type="checkbox" class="h-4 w-4 accent-inaka-terra" />
          <span class="text-sm text-inaka-terra">Activado</span>
        </label>
        <input v-else :type="f.type === 'number' ? 'number' : 'text'" v-model="values[f.key]" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
      </div>
    </div>
    <button type="submit" :disabled="saving" class="self-start rounded-lg bg-inaka-terra px-5 py-2.5 text-xs font-semibold text-inaka-cream hover:opacity-90">
      {{ saving ? 'Guardando…' : 'Guardar' }}
    </button>
  </form>
</template>

<script setup lang="ts">
export interface SiteContentField {
  key: string // admite notación con puntos, p. ej. 'horario.lunes_viernes'
  label: string
  type?: 'text' | 'textarea' | 'number' | 'checkbox'
}

const props = defineProps<{
  section: string
  title: string
  fields: SiteContentField[]
}>()

const toast = useToast()
const { data } = await useFetch<{ section: string, data: Record<string, unknown> }>(`/api/admin/site-content/${props.section}`)

function getPath(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
}
function setPath(obj: Record<string, any>, path: string, val: unknown) {
  const keys = path.split('.')
  let cur = obj
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]!] = cur[keys[i]!] ?? {}
    cur = cur[keys[i]!]
  }
  cur[keys[keys.length - 1]!] = val
}

const values = reactive<Record<string, any>>({})

watchEffect(() => {
  if (!data.value?.data) return
  for (const f of props.fields) {
    const raw = getPath(data.value.data, f.key)
    if (f.type === 'checkbox') values[f.key] = raw ?? false
    else if (f.type === 'number') values[f.key] = raw ?? 0
    else values[f.key] = raw ?? ''
  }
})

const saving = ref(false)
async function save() {
  saving.value = true
  const payload = JSON.parse(JSON.stringify(data.value?.data ?? {}))
  for (const f of props.fields) {
    const v = values[f.key]
    setPath(payload, f.key, f.type === 'number' ? Number(v) || 0 : v)
  }
  try {
    await $fetch(`/api/admin/site-content/${props.section}`, { method: 'PATCH', body: { data: payload } })
    toast.success('Guardado.')
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido guardar.')
  }
  finally {
    saving.value = false
  }
}
</script>
