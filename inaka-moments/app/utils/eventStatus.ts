/**
 * Color único para el estado de un evento (event_status), compartido entre
 * el chip del calendario, su leyenda y AdminStatusBadge — evita que el
 * mismo estado salga con colores distintos según la vista.
 */
export const EVENT_STATUSES = ['tentativo', 'confirmado', 'completado', 'cancelado'] as const
export type EventStatus = (typeof EVENT_STATUSES)[number]

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  tentativo: 'Sin confirmar',
  confirmado: 'Confirmado',
  completado: 'Completado',
  cancelado: 'Cancelado',
}

export const EVENT_STATUS_STYLES: Record<EventStatus, { chip: string, dot: string }> = {
  tentativo: { chip: 'bg-inaka-gold/20 text-inaka-terra', dot: 'bg-inaka-gold' },
  confirmado: { chip: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  completado: { chip: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  cancelado: { chip: 'bg-red-100 text-red-700 line-through', dot: 'bg-red-500' },
}
