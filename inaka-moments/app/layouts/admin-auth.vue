<template>
  <div class="flex min-h-screen items-center justify-center bg-inaka-cream px-4 font-sans">
    <OfflineBanner />
    <div class="w-full max-w-sm">
      <div class="mb-8 flex justify-center">
        <img src="/logo.png" alt="Inaka Moments" class="h-16 w-auto" />
      </div>
      <div class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-inaka-nude">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [{ rel: 'manifest', href: '/admin-manifest.webmanifest' }],
  meta: [{ name: 'apple-mobile-web-app-title', content: 'Inaka Panel' }],
})
</script>
