/** Valores del enum `event_type` de Postgres y sus etiquetas en español. */
export const EVENT_TYPES = [
  'cumpleanos', 'comunion', 'bautizo', 'baby_shower', 'graduacion',
  'despedida', 'jubilacion', 'corporativo', 'boda', 'otro',
] as const

export type EventType = (typeof EVENT_TYPES)[number]

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  cumpleanos: 'Cumpleaños',
  baby_shower: 'Baby Shower',
  bautizo: 'Bautizo',
  comunion: 'Comunión',
  graduacion: 'Graduación',
  despedida: 'Despedida',
  jubilacion: 'Jubilación',
  corporativo: 'Corporativo',
  boda: 'Boda',
  otro: 'Otro',
}
