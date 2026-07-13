-- Estado de la señal del presupuesto (Fase 5 — Bizum manual, sin Stripe).
-- Reutiliza el enum payment_status ya existente (mismo usado en rental_bookings.deposit_status).
alter table public.quotes
  add column deposit_status public.payment_status not null default 'pendiente';

comment on column public.quotes.deposit_status is
  'Estado de la señal (Bizum/transferencia), marcado a mano por la dueña. No hay pasarela de pago.';
