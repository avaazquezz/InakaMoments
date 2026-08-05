/** Revela un elemento con fade+translate al entrar en viewport (una sola vez). Respeta prefers-reduced-motion. */
export function useScrollReveal(options?: { threshold?: number, rootMargin?: string }) {
  const target = ref<HTMLElement | null>(null)
  const visible = ref(false)

  onMounted(() => {
    if (!target.value) return
    if (prefersReducedMotion()) {
      visible.value = true
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    }, { threshold: options?.threshold ?? 0.15, rootMargin: options?.rootMargin ?? '0px 0px -10% 0px' })

    observer.observe(target.value)
    onUnmounted(() => observer.disconnect())
  })

  return { target, visible }
}
