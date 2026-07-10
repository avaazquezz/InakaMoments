// ═════════════════════════════════════════════════════════════════════════
// Inaka Moments — Utilidades de fecha (día civil, sin hora/zona)
//
// Módulo PURO y sin dependencias, importable desde cliente y servidor
// (`~~/shared/dates`). Existe por un motivo concreto: `date.toISOString()`
// convierte a UTC, así que para cualquier `Date` construida a medianoche
// local en una zona con offset positivo (España) resta un día. Aquí se
// serializa siempre a partir de los componentes locales (getFullYear/
// getMonth/getDate), nunca de toISOString().
// ═════════════════════════════════════════════════════════════════════════

/** Serializa una fecha a 'YYYY-MM-DD' usando sus componentes LOCALES. */
export function formatISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Fecha de hoy en 'YYYY-MM-DD' (hora local). */
export function todayISO(): string {
  return formatISODate(new Date())
}

/** Fecha de hoy + n días en 'YYYY-MM-DD' (hora local). */
export function addDaysISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return formatISODate(d)
}
