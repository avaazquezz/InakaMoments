<template>
  <div class="flex min-h-screen flex-col bg-inaka-cream font-sans text-inaka-terra">
    <NuxtPwaManifest />
    <OfflineBanner />
    <TheHeader />
    <div class="flex-1">
      <slot />
    </div>
    <TheFooter />
    <CookieBanner />
  </div>
</template>
