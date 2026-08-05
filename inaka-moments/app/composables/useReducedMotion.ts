/** true si el usuario prefiere menos movimiento — comprobar antes de animar/autoplay. */
export function prefersReducedMotion(): boolean {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
