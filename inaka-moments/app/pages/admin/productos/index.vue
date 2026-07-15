<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-1 flex-wrap items-center gap-2">
        <input v-model="search" type="text" placeholder="Buscar por nombre…" class="w-56 rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
        <select v-model="activeFilter" class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra">
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
      </div>
      <NuxtLink to="/admin/productos/nuevo" class="inline-flex items-center gap-1.5 rounded-xl bg-inaka-terra px-4 py-2.5 text-sm font-semibold text-inaka-cream hover:opacity-90">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
        Nuevo producto
      </NuxtLink>
    </div>

    <div v-if="pending" class="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude" />
    <AdminEmptyState v-else-if="filtered.length === 0" title="No hay productos" message="Crea el primero o ajusta los filtros." />

    <div v-else class="overflow-hidden rounded-2xl bg-white ring-1 ring-inaka-nude">
      <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="bg-inaka-cream text-xs uppercase tracking-wide text-inaka-terra/50">
          <tr>
            <th class="px-4 py-3">Producto</th>
            <th class="px-4 py-3">Categoría</th>
            <th class="px-4 py-3">Precio</th>
            <th class="px-4 py-3">Estado</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody class="divide-y divide-inaka-nude/70">
          <tr v-for="p in filtered" :key="p.id" class="hover:bg-inaka-cream/50">
            <td class="px-4 py-3 font-medium text-inaka-terra">{{ p.name }}</td>
            <td class="px-4 py-3 text-inaka-terra/60">{{ p.category }}</td>
            <td class="px-4 py-3 text-inaka-terra/60">{{ p.base_price != null ? formatEUR(p.base_price) : 'A consultar' }}</td>
            <td class="px-4 py-3">
              <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                {{ p.active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <NuxtLink :to="`/admin/productos/${p.id}`" class="mr-3 text-xs font-semibold text-inaka-gold hover:underline">Editar</NuxtLink>
              <button type="button" class="text-xs font-semibold text-red-500 hover:underline" @click="askDelete(p)">Borrar</button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <AdminConfirmDialog
      :open="!!toDelete"
      title="¿Borrar este producto?"
      :message="toDelete ? `«${toDelete.name}» se eliminará permanentemente.` : ''"
      danger
      @cancel="toDelete = null"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Productos — Panel Inaka Moments' })

interface AdminProduct {
  id: string
  name: string
  category: string
  base_price: number | null
  active: boolean
}

const { data, pending, refresh } = await useFetch<AdminProduct[]>('/api/admin/products')
const toast = useToast()

const search = ref('')
const activeFilter = ref('')
const toDelete = ref<AdminProduct | null>(null)

const filtered = computed(() => {
  let list = data.value ?? []
  if (search.value.trim()) list = list.filter(p => p.name.toLowerCase().includes(search.value.trim().toLowerCase()))
  if (activeFilter.value) list = list.filter(p => String(p.active) === activeFilter.value)
  return list
})

function formatEUR(n: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)
}

function askDelete(p: AdminProduct) { toDelete.value = p }

async function confirmDelete() {
  if (!toDelete.value) return
  try {
    await $fetch(`/api/admin/products/${toDelete.value.id}`, { method: 'DELETE' })
    toast.success('Producto borrado.')
    await refresh()
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido borrar el producto.')
  }
  finally {
    toDelete.value = null
  }
}
</script>
