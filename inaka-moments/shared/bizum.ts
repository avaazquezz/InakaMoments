// ═════════════════════════════════════════════════════════════════════════
// Inaka Moments — Concepto de Bizum para la señal (Fase 5, manual sin Stripe)
//
// Módulo PURO y sin dependencias (mismo patrón que shared/dates.ts): genera
// un texto identificable para que la dueña reconozca el Bizum entrante sin
// necesidad de guardarlo en BD. Se calcula igual en servidor (email de
// confirmación) que en cliente si hiciera falta mostrarlo en el futuro.
// ═════════════════════════════════════════════════════════════════════════

/** Texto de concepto para el Bizum de la señal: "Fiesta {cliente} {fecha}". */
export function bizumConcept(input: { clientName: string, eventDate: string }): string {
  return `Fiesta ${input.clientName} ${input.eventDate}`
}
