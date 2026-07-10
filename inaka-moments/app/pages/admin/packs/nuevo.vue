<template>
  <div class="max-w-2xl rounded-2xl bg-white p-6 ring-1 ring-inaka-nude">
    <AdminPackForm :submitting="submitting" @submit="onSubmit" />
  </div>
</template>

<script setup lang="ts">
import type { PackFormData } from '~/components/admin/PackForm.vue'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Nuevo pack — Panel Inaka Moments' })

const toast = useToast()
const submitting = ref(false)

async function onSubmit(form: PackFormData) {
  submitting.value = true
  try {
    await $fetch('/api/admin/packs', { method: 'POST', body: form })
    toast.success('Pack creado.')
    await navigateTo('/admin/packs')
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido crear el pack.')
  }
  finally {
    submitting.value = false
  }
}
</script>
