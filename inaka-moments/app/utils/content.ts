// Contenido estático reutilizable entre la home y páginas internas.

export interface ProcesoPaso {
  icono: string
  titulo: string
  descripcion: string
}

/**
 * Los 4 pasos del proceso "Cómo funciona". Compartidos por la página
 * `/como-funciona` y el teaser de la home (`HowItWorksSection`).
 */
export const PROCESO_PASOS: ProcesoPaso[] = [
  {
    icono: '🛍️',
    titulo: 'Elige lo que te gusta',
    descripcion: 'Explora el catálogo y los packs. Cada elemento tiene su precio para que combines a tu gusto: arcos, columnas, letreros, candy bar…',
  },
  {
    icono: '🧮',
    titulo: 'Configura tu presupuesto',
    descripcion: 'Móntalo en el configurador y ve el precio estimado al instante, o cuéntanos tu idea. Te respondemos en menos de 24 h.',
  },
  {
    icono: '📅',
    titulo: 'Confirma tu fecha',
    descripcion: 'Cuando aceptes la propuesta, bloqueamos tu fecha en la agenda. El pago se realiza al momento de agendar.',
  },
  {
    icono: '🎈',
    titulo: 'Nosotros montamos',
    descripcion: 'El día del evento llegamos, montamos y lo dejamos todo perfecto. Tú solo tienes que disfrutar del momento.',
  },
]
