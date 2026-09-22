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

    <AdminEmptyState
      v-else-if="(data ?? []).length === 0"
      title="Aún no hay clientes"
      message="Los contactos que lleguen desde la web aparecerán aquí. También puedes añadir uno a mano (llamada, Instagram...) con «Nuevo cliente»."
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
        <p class="px-1 text-xs font-bold uppercase tracking-wide text-inaka-terra/80">
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
              <p class="truncate text-xs text-inaka-terra/80">{{ lead.email }}</p>
              <p
                v-if="lead.tipo"
                class="mt-1 text-xs text-inaka-terra/80"
              >{{ lead.tipo }}</p>
            </NuxtLink>
            <select
              :aria-label="`Estado de ${lead.nombre}`"
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
            class="rounded-xl border border-dashed border-inaka-beige px-3 py-6 text-center text-xs text-inaka-terra/80"
          >
            Vacío
          </p>
        </div>
      </div>
    </div>

    <p
      class="sr-only"
      role="status"
      aria-live="polite"
    >
      {{ announcement }}
    </p>

    <!-- Modal nuevo lead -->
    <AdminModal
      :open="creating"
      title="Nuevo cliente"
      @close="creating = false"
    >
      <form
        class="flex flex-col gap-3"
        @submit.prevent="createLead"
      >
        <AdminField
          v-slot="{ id }"
          label="Nombre"
          required
        >
          <input
            :id="id"
            v-model="form.nombre"
            type="text"
            required
            class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
          >
        </AdminField>
        <AdminField
          v-slot="{ id }"
          label="Email"
          required
        >
          <input
            :id="id"
            v-model="form.email"
            type="email"
            required
            class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
          >
        </AdminField>
        <AdminField
          v-slot="{ id }"
          label="Teléfono (opcional)"
        >
          <input
            :id="id"
            v-model="form.telefono"
            type="text"
            class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
          >
        </AdminField>
        <AdminField
          v-slot="{ id }"
          label="Tipo de evento (opcional)"
        >
          <input
            :id="id"
            v-model="form.tipo"
            type="text"
            class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
          >
        </AdminField>
        <div class="mt-2 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            class="rounded-lg border border-inaka-beige px-4 py-2 text-sm font-medium text-inaka-terra/80 hover:bg-inaka-nude/50"
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
    </AdminModal>
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

const announcement = ref('')

async function changeStatus(lead: AdminLead, status: string) {
  try {
    await $fetch(`/api/admin/leads/${lead.id}`, { method: 'PATCH', body: { ...lead, status } })
    await refresh()
    announcement.value = `${lead.nombre} movido a ${LEAD_STATUS_LABELS[status as keyof typeof LEAD_STATUS_LABELS] ?? status}`
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
