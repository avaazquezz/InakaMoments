<template>
  <div class="rounded-2xl bg-white p-5 ring-1 ring-inaka-nude">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h3 class="text-sm font-bold text-inaka-terra">
        Preguntas frecuentes
      </h3>
      <button
        type="button"
        class="shrink-0 rounded-lg bg-inaka-terra px-3 py-1.5 text-xs font-semibold text-inaka-cream hover:opacity-90"
        @click="openNew"
      >
        + Añadir
      </button>
    </div>

    <AdminEmptyState
      v-if="(data ?? []).length === 0"
      title="Sin preguntas todavía"
    />
    <ul
      v-else
      class="flex flex-col divide-y divide-inaka-nude/70"
    >
      <li
        v-for="faq in data"
        :key="faq.id"
        class="flex items-start justify-between gap-3 py-3"
      >
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-inaka-terra">
            {{ faq.question }}
          </p>
          <p class="mt-0.5 text-xs text-inaka-terra/50">
            {{ faq.category || 'Sin categoría' }} · {{ faq.published ? 'Publicada' : 'Oculta' }}
          </p>
        </div>
        <div class="flex shrink-0 items-center gap-3">
          <button
            type="button"
            class="text-xs font-semibold text-inaka-gold hover:underline"
            @click="openEdit(faq)"
          >
            Editar
          </button>
          <button
            type="button"
            class="text-xs font-semibold text-red-500 hover:underline"
            @click="askDelete(faq)"
          >
            Borrar
          </button>
        </div>
      </li>
    </ul>

    <AdminModal
      :open="!!editing"
      :title="`${editing?.id ? 'Editar' : 'Nueva'} pregunta`"
      size="lg"
      @close="editing = null"
    >
      <form
        v-if="editing"
        class="flex flex-col gap-4"
        @submit.prevent="save"
      >
        <AdminField
          v-slot="{ id }"
          label="Pregunta"
          required
        >
          <input
            :id="id"
            v-model="editing.question"
            type="text"
            required
            class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
          >
        </AdminField>
        <AdminField
          v-slot="{ id }"
          label="Respuesta"
          required
        >
          <textarea
            :id="id"
            v-model="editing.answer"
            rows="4"
            required
            class="resize-none rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
          />
        </AdminField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminField
            v-slot="{ id }"
            label="Categoría"
          >
            <input
              :id="id"
              v-model="editing.category"
              type="text"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
            >
          </AdminField>
          <AdminField
            v-slot="{ id }"
            label="Orden"
          >
            <input
              :id="id"
              v-model.number="editing.sort_order"
              type="number"
              class="rounded-lg border border-inaka-beige bg-white px-3 py-2 text-sm text-inaka-terra outline-none focus:border-inaka-terra"
            >
          </AdminField>
        </div>
        <label class="flex items-center gap-2">
          <input
            v-model="editing.published"
            type="checkbox"
            class="h-4 w-4 accent-inaka-terra"
          >
          <span class="text-sm text-inaka-terra">Publicada</span>
        </label>
        <div class="mt-2 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            class="rounded-lg border border-inaka-beige px-4 py-2 text-sm font-medium text-inaka-terra/80 hover:bg-inaka-nude/50"
            @click="editing = null"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="rounded-lg bg-inaka-terra px-4 py-2 text-sm font-semibold text-inaka-cream hover:opacity-90"
          >
            Guardar
          </button>
        </div>
      </form>
    </AdminModal>

    <AdminConfirmDialog
      :open="!!toDelete"
      title="¿Borrar esta pregunta?"
      danger
      @cancel="toDelete = null"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
interface Faq {
  id: string
  question: string
  answer: string
  category: string | null
  published: boolean
  sort_order: number
}

const { data, refresh } = await useFetch<Faq[]>('/api/admin/faqs')
const toast = useToast()

const editing = ref<Partial<Faq> | null>(null)
const saving = ref(false)
const toDelete = ref<Faq | null>(null)

function openNew() {
  editing.value = { question: '', answer: '', category: '', published: true, sort_order: 0 }
}
function openEdit(faq: Faq) {
  editing.value = { ...faq }
}

async function save() {
  if (!editing.value) return
  saving.value = true
  try {
    if (editing.value.id) {
      await $fetch(`/api/admin/faqs/${editing.value.id}`, { method: 'PATCH', body: editing.value })
    }
    else {
      await $fetch('/api/admin/faqs', { method: 'POST', body: editing.value })
    }
    toast.success('FAQ guardada.')
    editing.value = null
    await refresh()
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido guardar.'))
  }
  finally {
    saving.value = false
  }
}

function askDelete(faq: Faq) { toDelete.value = faq }
async function confirmDelete() {
  if (!toDelete.value) return
  try {
    await $fetch(`/api/admin/faqs/${toDelete.value.id}`, { method: 'DELETE' })
    toast.success('FAQ borrada.')
    await refresh()
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'No se ha podido borrar.'))
  }
  finally {
    toDelete.value = null
  }
}
</script>
