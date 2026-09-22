// Contenido estático reutilizable entre la home y páginas internas.

/**
 * og:image por defecto para páginas sin foto propia. Pasa por IPX (mismo
 * pipeline que NuxtImg) para no compartir el logo.png crudo de 1.1MB tal
 * cual: recortado a 1200x630 (tamaño estándar de preview de WhatsApp/
 * Facebook/Instagram) y servido en webp.
 */
export const DEFAULT_OG_IMAGE = 'https://inakamoments.com/_ipx/f_webp&s_1200x630&q_82/logo.png'

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
    icono: 'lucide:shopping-bag',
    titulo: 'Elige lo que te gusta',
    descripcion: 'Explora el catálogo y los packs. Cada elemento tiene su precio para que combines a tu gusto: arcos, columnas, letreros, candy bar…',
  },
  {
    icono: 'lucide:calculator',
    titulo: 'Configura tu presupuesto',
    descripcion: 'Móntalo en el configurador y ve el precio estimado al instante, o cuéntanos tu idea. Te respondemos en menos de 24 h.',
  },
  {
    icono: 'lucide:calendar-check',
    titulo: 'Confirma tu fecha',
    descripcion: 'Cuando aceptes la propuesta, bloqueamos tu fecha en la agenda. El pago se realiza al momento de agendar.',
  },
  {
    icono: 'lucide:party-popper',
    titulo: 'Nosotros montamos',
    descripcion: 'El día del evento llegamos, montamos y lo dejamos todo perfecto. Tú solo tienes que disfrutar del momento.',
  },
]
