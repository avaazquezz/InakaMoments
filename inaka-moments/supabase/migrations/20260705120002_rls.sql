-- ═════════════════════════════════════════════════════════════════════════
-- Inaka Moments — 0002: Row Level Security
--
-- Modelo de seguridad (BFF):
--   · RLS ACTIVADO en TODAS las tablas.
--   · anon/authenticated: SELECT solo sobre contenido publicado/activo.
--   · Tablas de gestión (leads, quotes, events, payments, …): SIN políticas
--     → cero acceso desde el navegador. Toda escritura y gestión pasa por
--     server/api/** con la service_role key (bypassa RLS).
-- ═════════════════════════════════════════════════════════════════════════

-- ── Activar RLS en todo ────────────────────────────────────────────────────
alter table public.site_content    enable row level security;
alter table public.faqs            enable row level security;
alter table public.testimonials    enable row level security;
alter table public.occasions       enable row level security;
alter table public.products        enable row level security;
alter table public.packs           enable row level security;
alter table public.leads           enable row level security;
alter table public.lead_activities enable row level security;
alter table public.quotes          enable row level security;
alter table public.quote_items     enable row level security;
alter table public.events          enable row level security;
alter table public.payments        enable row level security;
alter table public.rental_bookings enable row level security;
alter table public.event_albums    enable row level security;
alter table public.gallery_images  enable row level security;

-- ── Lectura pública (anon + authenticated) solo de lo publicado/activo ─────
create policy "public read site_content" on public.site_content
  for select to anon, authenticated using (true);

create policy "public read published faqs" on public.faqs
  for select to anon, authenticated using (published);

create policy "public read published testimonials" on public.testimonials
  for select to anon, authenticated using (published);

create policy "public read published occasions" on public.occasions
  for select to anon, authenticated using (published);

create policy "public read active products" on public.products
  for select to anon, authenticated using (active);

create policy "public read active packs" on public.packs
  for select to anon, authenticated using (active);

create policy "public read published albums" on public.event_albums
  for select to anon, authenticated using (published);

create policy "public read images of published albums" on public.gallery_images
  for select to anon, authenticated using (
    exists (
      select 1 from public.event_albums a
      where a.id = album_id and a.published
    )
  );

-- leads, lead_activities, quotes, quote_items, events, payments y
-- rental_bookings quedan deliberadamente SIN políticas: inaccesibles para
-- anon/authenticated. Solo la service_role (servidor) puede operarlas.
