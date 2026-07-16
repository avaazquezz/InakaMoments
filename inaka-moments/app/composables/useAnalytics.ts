interface UmamiGlobal { track: (eventName: string, data?: Record<string, unknown>) => void }

/**
 * Wrapper no-op-safe de Umami: sin `NUXT_PUBLIC_UMAMI_WEBSITE_ID` (o con
 * adblock) el script nunca carga y `window.umami` no existe — no debe
 * romper nada, solo dejar de trackear.
 */
export function useAnalytics() {
  function track(eventName: string, data?: Record<string, unknown>) {
    if (!import.meta.client) return
    ;(window as unknown as { umami?: UmamiGlobal }).umami?.track(eventName, data)
  }
  return { track }
}
