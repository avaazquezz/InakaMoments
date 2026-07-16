<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-center justify-end">
      <button
        type="button"
        class="rounded-xl bg-inaka-terra px-4 py-2.5 text-sm font-semibold text-inaka-cream hover:opacity-90"
        @click="creating = true"
      >
        + Nuevo cliente
      </button>
    </div>

    <div
      v-if="pending"
      class="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-inaka-nude"
    />

    <div
      v-else
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      <div
        v-for="col in columns"
        :key="col.status"
        class="flex flex-col gap-2"
      >
        <p class="px-1 text-xs font-bold uppercase tracking-wide text-inaka-terra/50">
          {{ col.label }} ({{ leadsByStatus(col.status).length }})
        </p>
        <div class="flex flex-col gap-2">
          <div
            v-for="lead in leadsByStatus(col.status)"
            :key="lead.id"
            class="rounded-xl bg-white p-3 ring-1 ring-inaka-nude"
          >
            <NuxtLink
              :to="`/admin/leads/${lead.id}`"
              class="block"
            >
              <p class="truncate text-sm font-semibold text-inaka-terra">{{ lead.nombre }}</p>
              <p class="truncate text-xs text-inaka-terra/50">{{ lead.email }}</p>
              <p
                v-if="lead.tipo"
                class="mt-1 text-xs text-inaka-terra/40"
              >{{ lead.tipo }}</p>
            </NuxtLink>
            <select
              class="mt-2 w-full rounded-lg border border-inaka-beige bg-inaka-cream px-2 py-1 text-xs text-inaka-terra outline-none focus:border-inaka-terra"
              :value="lead.status"
              @change="changeStatus(lead, ($event.target as HTMLSelectElement).value)"
            >
              <option
                v-for="c in columns"
                :key="c.status"
                :value="c.status"
              >
                {{ c.label }}
              </option>
            </select>
          </div>
          <p
            v-if="leadsByStatus(col.status).length === 0"
            class="rounded-xl border border-dashed border-inaka-beige px-3 py-6 text-center text-xs text-inaka-terra/30"
          >
            Vacío
          </p>
        </div>
      </div>
    </div>

    <!-- Modal nuevo lead -->
    <Teleport to="body">
      <div
        v-if="creating"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-inaka-terra/40 backdrop-blur-sm"
          @click="creating = false"
        />
        <div class="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          <h2 class="mb-4 text-lg font-bold text-inaka-terra">
            Nuevo cliente
          </h2>
          <form
            class="flex flex-col gap-3"
            @submit.prevent="createLead"
          >
            <input
              v-model="form.nombre"
              type="text"
              placeholder="Nombre"
              required
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
            >
            <input
              v-model="form.email"
              type="email"
              placeholder="Email"
              required
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
            >
            <input
              v-model="form.telefono"
              type="text"
              placeholder="Teléfono (opcional)"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
            >
            <input
              v-model="form.tipo"
              type="text"
              placeholder="Tipo de evento (opcional)"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
            >
            <div class="mt-2 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                class="rounded-lg border border-inaka-beige px-4 py-2 text-sm font-medium text-inaka-terra/70 hover:bg-inaka-nude/50"
                @click="creating = false"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="rounded-lg bg-inaka-terra px-4 py-2 text-sm font-semibold text-inaka-cream hover:opacity-90"
              >
                Crear
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Clientes — Panel Inaka Moments' })

interface AdminLead { id: string, nombre: string, email: string, tipo: string | null, status: string }

const { data, pending, refresh } = await useFetch<AdminLead[]>('/api/admin/leads')
const toast = useToast()

const columns = LEAD_STATUSES.map(status => ({ status, label: LEAD_STATUS_LABELS[status] }))

function leadsByStatus(status: string) {
  return (data.value ?? []).filter(l => l.status === status)
}

async function changeStatus(lead: AdminLead, status: string) {
  try {
    await $fetch(`/api/admin/leads/${lead.id}`, { method: 'PATCH', body: { ...lead, status } })
    await refresh()
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido cambiar el estado.'))
  }
}

const creating = ref(false)
const submitting = ref(false)
const form = reactive({ nombre: '', email: '', telefono: '', tipo: '' })

async function createLead() {
  submitting.value = true
  try {
    await $fetch('/api/admin/leads', { method: 'POST', body: form })
    toast.success('Cliente creado.')
    creating.value = false
    Object.assign(form, { nombre: '', email: '', telefono: '', tipo: '' })
    await refresh()
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido crear el lead.'))
  }
  finally {
    submitting.value = false
  }
}
</script>
