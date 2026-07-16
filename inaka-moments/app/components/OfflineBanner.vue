<template>
  <Transition name="offline-slide">
    <div
      v-if="offline"
      class="fixed inset-x-0 top-0 z-[70] flex items-center justify-center gap-2 bg-inaka-terra px-4 py-2 text-center text-xs font-semibold text-inaka-cream shadow-md"
      role="status"
    >
      <Icon
        name="lucide:wifi-off"
        class="h-4 w-4 shrink-0"
        aria-hidden="true"
      />
      Sin conexión. Algunos datos pueden no estar actualizados.
    </div>
  </Transition>
</template>

<script setup lang="ts">
const offline = ref(false)

function update() {
  offline.value = !navigator.onLine
}

onMounted(() => {
  update()
  window.addEventListener('online', update)
  window.addEventListener('offline', update)
})
onUnmounted(() => {
  window.removeEventListener('online', update)
  window.removeEventListener('offline', update)
})
</script>

<style scoped>
.offline-slide-enter-active,
.offline-slide-leave-active {
  transition: transform 0.25s ease;
}
.offline-slide-enter-from,
.offline-slide-leave-to {
  transform: translateY(-100%);
}
</style>
