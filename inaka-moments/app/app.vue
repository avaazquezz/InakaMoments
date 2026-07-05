<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Smooth scroll for anchor links (global)
onMounted(() => {
  document.documentElement.style.scrollBehavior = 'smooth'
})
</script>
