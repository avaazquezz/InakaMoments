-- ═════════════════════════════════════════════════════════════════════════
-- Inaka Moments — Fase 5: solicitudes de reseña
--
-- `testimonials` pasa a cubrir todo el ciclo: solicitud enviada al cliente
-- (quote_id/token/client_email/requested_at) → respuesta del cliente
-- (author/quote/rating/responded_at) → moderación (published, ya existía).
-- Una fila creada a mano por la dueña (como hasta ahora) simplemente deja
-- estas columnas nuevas a NULL.
-- ═════════════════════════════════════════════════════════════════════════

alter table public.testimonials
  alter column author drop not null,
  alter column quote  drop not null,
  add column quote_id     uuid references public.quotes(id) on delete set null,
  add column token        text,
  add column client_email text,
  add column requested_at timestamptz,
  add column responded_at timestamptz,
  add constraint testimonials_quote_id_key unique (quote_id),
  add constraint testimonials_token_key    unique (token);

comment on column public.testimonials.quote_id is
  'Presupuesto de origen si esta fila nació de una solicitud automática/manual. NULL = reseña escrita a mano por la dueña.';
comment on column public.testimonials.token is
  'Token opaco (UUID) del enlace público /resena/[token]. NULL para reseñas sin solicitud.';
comment on column public.testimonials.client_email is
  'Email al que se envió la solicitud (copia local; no depende de que el presupuesto/lead conserve el suyo).';
comment on column public.testimonials.requested_at is
  'Cuándo se envió el email de solicitud. NULL = fila creada a mano, sin solicitud asociada.';
comment on column public.testimonials.responded_at is
  'Cuándo el cliente envió el formulario público. NULL = solicitud pendiente de respuesta (o fila manual).';
