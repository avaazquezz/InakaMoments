-- ═════════════════════════════════════════════════════════════════════════
-- Inaka Moments — solicitudes de reseña por enlace desde un evento
--
-- Sustituye al envío automático por email: la dueña elige un evento reciente
-- en /admin/resenas y comparte el enlace a mano (WhatsApp, Instagram, email).
-- `event_id` único = como mucho una solicitud por evento (el constraint es la
-- comprobación de "ya pedida", igual que `testimonials_quote_id_key`).
-- ═════════════════════════════════════════════════════════════════════════

alter table public.testimonials
  add column event_id uuid references public.events(id) on delete set null,
  add constraint testimonials_event_id_key unique (event_id);

comment on column public.testimonials.event_id is
  'Evento de la agenda desde el que se creó el enlace de reseña. NULL = enlace para un cliente sin evento en el panel (o solicitud antigua por email, ver quote_id).';
