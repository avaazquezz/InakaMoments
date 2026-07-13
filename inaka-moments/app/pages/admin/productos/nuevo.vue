<template>
  <div class="max-w-2xl rounded-2xl bg-white p-6 ring-1 ring-inaka-nude">
    <AdminProductForm :submitting="submitting" @submit="onSubmit" />
  </div>
</template>

<script setup lang="ts">
import type { ProductFormData } from '~/components/admin/ProductForm.vue'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Nuevo producto — Panel Inaka Moments' })

const toast = useToast()
const submitting = ref(false)

async function onSubmit(form: ProductFormData) {
  submitting.value = true
  try {
    await $fetch('/api/admin/products', { method: 'POST', body: form })
    toast.success('Producto creado.')
    await navigateTo('/admin/productos')
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido crear el producto.')
  }
  finally {
    submitting.value = false
  }
}
</script>
