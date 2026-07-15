<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <input v-model="search" type="text" placeholder="Buscar por nombre…" class="w-56 rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra" />
      <NuxtLink to="/admin/packs/nuevo" class="inline-flex items-center gap-1.5 rounded-xl bg-inaka-terra px-4 py-2.5 text-sm font-semibold text-inaka-cream hover:opacity-90">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
        Nuevo pack
      </NuxtLink>
    </div>

    <div v-if="pending" class="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude" />
    <AdminEmptyState v-else-if="filtered.length === 0" title="No hay packs" message="Crea el primero o ajusta la búsqueda." />

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="p in filtered" :key="p.id" class="flex flex-col gap-2 rounded-2xl bg-white p-4 ring-1 ring-inaka-nude">
        <div class="flex items-start justify-between gap-2">
          <p class="font-bold text-inaka-terra">{{ p.name }}</p>
          <span class="rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
            {{ p.active ? 'Activo' : 'Inactivo' }}
          </span>
        </div>
        <p class="text-sm font-semibold text-inaka-terra/70">{{ p.price != null ? formatEUR(p.price) : 'A consultar' }}</p>
        <div class="mt-2 flex items-center gap-3">
          <NuxtLink :to="`/admin/packs/${p.id}`" class="text-xs font-semibold text-inaka-gold hover:underline">Editar</NuxtLink>
          <button type="button" class="text-xs font-semibold text-red-500 hover:underline" @click="askDelete(p)">Borrar</button>
        </div>
      </div>
    </div>

    <AdminConfirmDialog
      :open="!!toDelete"
      title="¿Borrar este pack?"
      :message="toDelete ? `«${toDelete.name}» se eliminará permanentemente.` : ''"
      danger
      @cancel="toDelete = null"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Packs — Panel Inaka Moments' })

interface AdminPack { id: string, name: string, price: number | null, active: boolean }

const { data, pending, refresh } = await useFetch<AdminPack[]>('/api/admin/packs')
const toast = useToast()

const search = ref('')
const toDelete = ref<AdminPack | null>(null)

const filtered = computed(() => {
  const list = data.value ?? []
  if (!search.value.trim()) return list
  return list.filter(p => p.name.toLowerCase().includes(search.value.trim().toLowerCase()))
})

function formatEUR(n: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)
}

function askDelete(p: AdminPack) { toDelete.value = p }

async function confirmDelete() {
  if (!toDelete.value) return
  try {
    await $fetch(`/api/admin/packs/${toDelete.value.id}`, { method: 'DELETE' })
    toast.success('Pack borrado.')
    await refresh()
  }
  catch (err: any) {
    toast.error(err?.data?.message ?? 'No se ha podido borrar el pack.')
  }
  finally {
    toDelete.value = null
  }
}
</script>
