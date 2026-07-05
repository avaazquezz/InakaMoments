-- ═════════════════════════════════════════════════════════════════════════
-- Inaka Moments — 0001: esquema inicial
-- Enums, tablas, índices y triggers de updated_at.
-- Modelo completo: contenido web, catálogo (productos/packs), leads+CRM,
-- presupuestos (configurador), agenda, pagos, inventario alquiler y galería.
-- ═════════════════════════════════════════════════════════════════════════

create extension if not exists moddatetime schema extensions;

-- ── Enums ──────────────────────────────────────────────────────────────────
create type public.event_type as enum (
  'cumpleanos','comunion','bautizo','baby_shower','graduacion',
  'despedida','jubilacion','corporativo','boda','otro'
);
create type public.lead_status   as enum ('nuevo','contactado','presupuestado','ganado','perdido');
create type public.quote_status  as enum ('borrador','enviado','aceptado','rechazado','caducado');
create type public.event_status  as enum ('tentativo','confirmado','completado','cancelado');
create type public.payment_type  as enum ('senal','resto','fianza','reembolso_fianza');
create type public.payment_status as enum ('pendiente','pagado','reembolsado','fallido');

-- ── Contenido web ──────────────────────────────────────────────────────────
create table public.site_content (
  section    text primary key,
  data       jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
comment on table public.site_content is 'Contenido editable por sección: hero, about, footer, contacto, settings (reglas de negocio)';

create table public.faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  category   text,
  sort_order int not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  author     text not null,
  event_type public.event_type,
  quote      text not null,
  rating     int check (rating between 1 and 5),
  source     text,
  published  boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.occasions (
  slug            text primary key,
  event_type      public.event_type not null,
  title           text not null,
  hero            jsonb not null default '{}',
  intro           text,
  seo_title       text,
  seo_description text,
  featured_product_ids jsonb not null default '[]',
  published       boolean not null default false,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
comment on table public.occasions is 'Landings por ocasión (SEO local)';

-- ── Catálogo ───────────────────────────────────────────────────────────────
create table public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text unique not null,
  category      text not null,
  description   text,
  base_price    numeric(10,2),                 -- null = "a consultar"
  price_is_from boolean not null default true, -- "desde X€"
  pricing       jsonb not null default '[]',   -- tramos: [{"label":"1 columna","price":20}]
  sizes         jsonb not null default '[]',   -- ["150cm","180cm","200cm"]
  options       jsonb not null default '[]',   -- ["Látex","Aluminio"]
  event_types   jsonb not null default '[]',   -- [] = todas las ocasiones
  is_rental     boolean not null default false,
  deposit       numeric(10,2) not null default 0,
  stock         int not null default 1,
  images        jsonb not null default '[]',   -- rutas en bucket catalog-media
  active        boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.products is 'Catálogo à-la-carte (catálogo Inaka Moments 2026)';

create table public.packs (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text,
  price       numeric(10,2),
  includes    jsonb not null default '[]',
  event_types jsonb not null default '[]',
  images      jsonb not null default '[]',
  active      boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Leads + CRM ────────────────────────────────────────────────────────────
create table public.leads (
  id          uuid primary key default gen_random_uuid(),
  tipo        text,
  fecha       date,
  invitados   text,
  espacios    jsonb not null default '[]',
  estilo      text,
  nombre      text not null,
  email       text not null,
  telefono    text,
  ideas_extra text,
  status      public.lead_status not null default 'nuevo',
  notes       text,
  source      text,                        -- origen: wizard, configurador, whatsapp…
  utm         jsonb not null default '{}',
  tags        jsonb not null default '[]',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.lead_activities (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads(id) on delete cascade,
  type       text not null default 'nota',  -- nota, llamada, email, seguimiento…
  note       text,
  due_date   date,
  done       boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Presupuestos (configurador) ────────────────────────────────────────────
create table public.quotes (
  id             uuid primary key default gen_random_uuid(),
  lead_id        uuid references public.leads(id) on delete set null,
  client_name    text,
  client_email   text,
  client_phone   text,
  event_type     public.event_type,
  event_date     date,
  status         public.quote_status not null default 'borrador',
  subtotal       numeric(10,2) not null default 0,
  adjustments    jsonb not null default '[]', -- desmontaje +15, gasolina, descuentos
  total          numeric(10,2) not null default 0,
  deposit_amount numeric(10,2),               -- señal a cobrar
  valid_until    date,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.quote_items (
  id         uuid primary key default gen_random_uuid(),
  quote_id   uuid not null references public.quotes(id) on delete cascade,
  product_id uuid references public.products(id),
  pack_id    uuid references public.packs(id),
  label      text not null,
  qty        int not null default 1 check (qty > 0),
  unit_price numeric(10,2),
  options    jsonb not null default '{}',
  line_total numeric(10,2),
  created_at timestamptz not null default now()
);

-- ── Agenda ─────────────────────────────────────────────────────────────────
create table public.events (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  event_type     public.event_type,
  event_date     date not null,
  start_time     time,
  end_time       time,
  location       text,
  km             numeric,
  travel_fee     numeric(10,2),
  client_name    text,
  client_contact text,
  status         public.event_status not null default 'tentativo',
  quote_id       uuid references public.quotes(id) on delete set null,
  lead_id        uuid references public.leads(id) on delete set null,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
-- Evita doble reserva confirmada el mismo día
create unique index events_confirmed_date on public.events(event_date) where status = 'confirmado';

-- ── Pagos ──────────────────────────────────────────────────────────────────
create table public.payments (
  id                      uuid primary key default gen_random_uuid(),
  quote_id                uuid references public.quotes(id) on delete set null,
  event_id                uuid references public.events(id) on delete set null,
  type                    public.payment_type not null,
  amount                  numeric(10,2) not null,
  status                  public.payment_status not null default 'pendiente',
  method                  text,             -- stripe, bizum, transferencia, efectivo
  stripe_payment_intent   text,
  stripe_checkout_session text,
  created_at              timestamptz not null default now()
);

-- ── Inventario de alquiler ─────────────────────────────────────────────────
create table public.rental_bookings (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products(id),
  event_id       uuid references public.events(id) on delete cascade,
  date_from      date not null,
  date_to        date not null,
  deposit_amount numeric(10,2) not null default 0,
  deposit_status public.payment_status not null default 'pendiente',
  created_at     timestamptz not null default now(),
  check (date_to >= date_from)
);

-- ── Galería / portfolio ("eventos reales") ─────────────────────────────────
create table public.event_albums (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  event_type     public.event_type not null,
  event_date     date,
  cover_image_id uuid,
  published      boolean not null default false,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.gallery_images (
  id           uuid primary key default gen_random_uuid(),
  album_id     uuid not null references public.event_albums(id) on delete cascade,
  storage_path text not null,        -- ruta en bucket 'gallery'
  alt          text,
  sort_order   int not null default 0,
  featured     boolean not null default false, -- carrusel del home
  created_at   timestamptz not null default now()
);

alter table public.event_albums
  add constraint event_albums_cover_fk
  foreign key (cover_image_id) references public.gallery_images(id) on delete set null;

-- ── Índices ────────────────────────────────────────────────────────────────
create index leads_status_idx           on public.leads(status);
create index leads_created_at_idx       on public.leads(created_at desc);
create index lead_activities_lead_idx   on public.lead_activities(lead_id);
create index quotes_status_idx          on public.quotes(status);
create index quotes_lead_idx            on public.quotes(lead_id);
create index quote_items_quote_idx      on public.quote_items(quote_id);
create index quote_items_product_idx    on public.quote_items(product_id);
create index quote_items_pack_idx       on public.quote_items(pack_id);
create index events_date_idx            on public.events(event_date);
create index events_status_idx          on public.events(status);
create index events_quote_idx           on public.events(quote_id);
create index events_lead_idx            on public.events(lead_id);
create index payments_quote_idx         on public.payments(quote_id);
create index payments_event_idx         on public.payments(event_id);
create index payments_checkout_idx      on public.payments(stripe_checkout_session);
create index rental_bookings_prod_idx   on public.rental_bookings(product_id, date_from, date_to);
create index rental_bookings_event_idx  on public.rental_bookings(event_id);
create index gallery_images_album_idx   on public.gallery_images(album_id);
create index gallery_images_featured_idx on public.gallery_images(sort_order) where featured;
create index products_category_idx      on public.products(category);
create index products_active_idx        on public.products(active, sort_order);

-- ── Triggers updated_at ────────────────────────────────────────────────────
create trigger set_updated_at before update on public.site_content  for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.faqs          for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.testimonials  for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.occasions     for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.products      for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.packs         for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.leads         for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.quotes        for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.events        for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.event_albums  for each row execute function extensions.moddatetime(updated_at);
