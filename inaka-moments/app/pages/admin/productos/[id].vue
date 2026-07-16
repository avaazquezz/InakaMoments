<template>
  <div class="max-w-2xl">
    <div
      v-if="pending"
      class="h-96 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude"
    />
    <div
      v-else-if="data"
      class="rounded-2xl bg-white p-6 ring-1 ring-inaka-nude"
    >
      <AdminProductForm
        :initial="data"
        :submitting="submitting"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductFormData } from '~/components/admin/ProductForm.vue'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Editar producto — Panel Inaka Moments' })

const route = useRoute()
const toast = useToast()
const submitting = ref(false)

const { data, pending } = await useFetch<ProductFormData>(`/api/admin/products/${route.params.id}`)

async function onSubmit(form: ProductFormData) {
  submitting.value = true
  try {
    await $fetch(`/api/admin/products/${route.params.id}`, { method: 'PATCH', body: form })
    toast.success('Producto guardado.')
    await navigateTo('/admin/productos')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido guardar el producto.'))
  }
  finally {
    submitting.value = false
  }
}
</script>
