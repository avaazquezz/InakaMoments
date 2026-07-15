/**
 * Etiquetas y colores en español del estado de un cliente potencial
 * (lead_status), compartidos entre el embudo del inicio, su leyenda y
 * AdminStatusBadge — un mismo estado nunca sale de un color en un sitio y
 * de otro en otro. "Ganado"/"Perdido" se muestran como "Confirmado"/
 * "Cancelado" para encajar con el vocabulario de negocio de la dueña (el
 * valor en BD no cambia).
 *
 * `chip`: fondo suave + texto, para insignias (StatusBadge).
 * `bar`: color sólido en hex, para el relleno de barra/leyenda del embudo
 * — validado con la skill dataviz (chroma + separación CVD); los tonos de
 * marca (`inaka-gold`/`inaka-mauve`) son demasiado desaturados para leerse
 * como relleno sólido, así que aquí llevan una versión más saturada del
 * mismo tono.
 */
export const LEAD_STATUSES = ['nuevo', 'contactado', 'presupuestado', 'ganado', 'perdido'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  presupuestado: 'Presupuestado',
  ganado: 'Confirmado',
  perdido: 'Cancelado',
}

export const LEAD_STATUS_STYLES: Record<LeadStatus, { chip: string, bar: string }> = {
  nuevo: { chip: 'bg-inaka-gold/20 text-inaka-terra', bar: '#D6A63C' },
  contactado: { chip: 'bg-inaka-mauve/20 text-inaka-terra', bar: '#C2637E' },
  presupuestado: { chip: 'bg-inaka-terra/10 text-inaka-terra', bar: '#8B3A2A' },
  ganado: { chip: 'bg-green-100 text-green-700', bar: '#16A34A' },
  perdido: { chip: 'bg-red-100 text-red-700', bar: '#DC2626' },
}
