<template>
  <div class="admin-root flex min-h-screen items-center justify-center bg-inaka-cream px-4 font-sans">
    <OfflineBanner />
    <div class="w-full max-w-sm">
      <div class="mb-8 flex justify-center">
        <NuxtImg
          src="/logo.png"
          alt="Inaka Moments"
          class="h-16 w-auto"
          width="64"
          height="64"
          format="webp"
        />
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
  meta: [
    { name: 'apple-mobile-web-app-title', content: 'Inaka Panel' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})
</script>

<style>
/* Mismo foco de teclado visible que el layout del panel (admin.vue). */
.admin-root :focus-visible {
  outline: 2px solid #c9a96e;
  outline-offset: 2px;
}
</style>
