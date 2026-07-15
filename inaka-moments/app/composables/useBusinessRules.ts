/**
 * Reglas de negocio del catálogo (montaje, desmontaje, desplazamiento,
 * detallito, antelación, pago, fianza) derivadas de `site_content.settings`.
 *
 * Fuente única compartida por la página `/como-funciona` ("Condiciones claras")
 * y la sección "Por qué Inaka" de la home (`WhyInakaSection`). Editable por la
 * dueña desde el admin (Fase 4) al cambiar `settings`.
 */

export interface BusinessRule {
  icono: string
  titulo: string
  texto: string
}

export function useBusinessRules() {
  const { data: settings } = useSiteSection('settings', {
    desmontaje_precio: 15,
    km_incluidos: 30,
    plus_gasolina: 'a consultar según distancia',
    umbral_detallito: 120,
    antelacion_dias: 30,
    pago_al_agendar: true,
    fianza_alquiler: 'según estructura, reembolsable al comprobar el estado',
  })

  const rules = computed<BusinessRule[]>(() => [
    {
      icono: 'lucide:wrench',
      titulo: 'Montaje incluido',
      texto: `Todos los precios incluyen el montaje. Desmontaje opcional por +${formatEUR(settings.value.desmontaje_precio)}.`,
    },
    {
      icono: 'lucide:car',
      titulo: 'Nos desplazamos',
      texto: `Los primeros ${settings.value.km_incluidos} km están incluidos. A partir de ahí, un pequeño plus de gasolina (${settings.value.plus_gasolina}).`,
    },
    {
      icono: 'lucide:gift',
      titulo: 'Detallito de regalo',
      texto: `Si tu pedido supera los ${formatEUR(settings.value.umbral_detallito)}, te llevas un detallito de Inaka Moments acorde a tu evento.`,
    },
    {
      icono: 'lucide:clock',
      titulo: 'Reserva con antelación',
      texto: `Agenda con un mínimo de ${Math.max(1, Math.round(settings.value.antelacion_dias / 30))} mes de antelación para preparar cada detalle con mimo.`,
    },
    {
      icono: 'lucide:credit-card',
      titulo: 'Pago al agendar',
      texto: 'El pago se realiza al momento de agendar: así tu fecha queda bloqueada en nuestra agenda.',
    },
    {
      icono: 'lucide:refresh-cw',
      titulo: 'Alquiler con fianza',
      texto: `Algunas estructuras pueden alquilarse con fianza (${settings.value.fianza_alquiler}).`,
    },
  ])

  return { settings, rules }
}
