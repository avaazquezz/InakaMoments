<template>
  <div class="max-w-2xl">
    <div v-if="pending" class="h-96 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude" />
    <div v-else-if="data" class="rounded-2xl bg-white p-6 ring-1 ring-inaka-nude">
      <AdminPackForm :initial="data" :submitting="submitting" @submit="onSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PackFormData } from '~/components/admin/PackForm.vue'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Editar pack — Panel Inaka Moments' })

const route = useRoute()
const toast = useToast()
const submitting = ref(false)

const { data, pending } = await useFetch<PackFormData>(`/api/admin/packs/${route.params.id}`)

async function onSubmit(form: PackFormData) {
  submitting.value = true
  try {
    await $fetch(`/api/admin/packs/${route.params.id}`, { method: 'PATCH', body: form })
    toast.success('Pack guardado.')
    await navigateTo('/admin/packs')
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido guardar el pack.')
  }
  finally {
    submitting.value = false
  }
}
</script>
