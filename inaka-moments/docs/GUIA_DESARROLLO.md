# Guía de Desarrollo — Inaka Moments v2 (SaaS + catálogo à-la-carte)

> **Qué es este documento.** Guía maestra para llevar `inaka-moments/` de una landing estática a un producto completo: **catálogo de productos con configurador de presupuesto**, backend real (Supabase Cloud), **pagos con Stripe** (señal + fianzas), panel `/admin` tipo SaaS, rediseño manteniendo la paleta, i18n (ca/es), PWA y despliegue Docker + Traefik. Escrita para que **un agente de IA la implemente fase a fase sin ambigüedad**: cada fase incluye *qué*, *por qué* y *cómo* (comandos, rutas, snippets, criterios de aceptación).
>
> **Cómo usarla:** implementar en orden (0 → 8); no pasar de fase sin cumplir sus *Criterios de aceptación*.

---

## 0. Contexto y estado actual (auditoría)

App **Nuxt 4.3 SSR + Vue 3.5 + Tailwind** en `inaka-moments/`. Negocio: **decoración de eventos con globos** (Abrera, Cataluña; radio ~30 km). Email `nadine.tcae@gmail.com`, Instagram `inaka.moments`. Eslogan: *"Momentos bonitos, recuerdos para siempre"*.

**Bugs verificados a corregir:**
1. **Rutas rotas (Nuxt 4):** `srcDir=app/` pero las páginas están en `pages/` raíz → no se compilan; `app/app.vue` sin `<NuxtPage/>`; `/servicios`, `/galeria`, `/contacto` dan 404. `error/404.vue` no cableado (Nuxt 4 espera `app/error.vue`).
2. **Nav móvil rota:** header activo `app/components/TheHeader.vue` sin menú móvil; el bueno está en `components/TheHeader.vue` (raíz) → código muerto.
3. **Sin persistencia:** el `LeadWizard` manda el lead por EmailJS (cliente) y se pierde. No hay BD/auth/`server/`.
4. **Contenido hardcodeado y desalineado con el negocio:** galerías con placeholders `picsum`, servicios genéricos, sin precios ni productos, taxonomía de eventos equivocada, copys con francés y caracteres corruptos en `aviso-legal.vue`.

**Paleta (MANTENER)** — `tailwind.config.js` → `inaka`: terra `#8B3A2A`, gold `#C9A96E`, mauve `#C4909A`, beige `#D4BFA0`, nude `#E8D0C8`, cream `#FAFAF8`. Sin fuente propia hoy.

**Scaffolding reutilizable** (ramas remotas): `origin/phase/5-production` (`docker/Dockerfile`, `docker-compose.yml`, `traefik-dynamic.yml`, `DEPLOY.md`); `origin/phase/3-admin-panel` (`server/data/config.json` → semilla; `dashboard.vue` → referencia UI).

### 0.1 Modelo de negocio real (extraído del catálogo 2026)

**À-la-carte:** *"cada elemento tiene su propio precio… crea la combinación perfecta según tu presupuesto. Tú eliges y nosotros creamos."* Todos los productos combinables entre sí.

**Productos y precios (semilla real):**
| Producto | Precio | Notas |
|---|---|---|
| Columna orgánica | 1→20€ · pack 2→35€ | varias alturas, +extras |
| Arco orgánico | desde 50€ | 200cm |
| Aro 360 parcial | desde 65€ | 180/220cm |
| Aro completo 360 | desde 75€ | 180/220cm · alquiler estructura (consultar) |
| Arco orgánico cuadrado | desde 50€ | 150/180/200cm |
| Composición arco con funda + guirnalda | desde 95€ | 180/200cm |
| Wall balloon / pared | peq. (150×100) desde 95€ · grande (250×200) desde 135€ | |
| Conjunto globos helio (≤25 ud) | desde 60€ | látex o aluminio |
| Arco con funda temática (extra) | desde 40€ | 180/200cm · alquiler estructura |
| Cilindros decorativos S/M/L con funda | a consultar | alquiler |
| Letreros LED (Happy Birthday / Oh Baby) | 15€ | |
| Osito babyshower/revelación | 15€ | lazo color personalizado |
| Cajas decorativas baby | con globos 15€ · sin 10€ | |
| Decoración con flores | a consultar | naturales/artificiales |
| Números LED (0-9, 70cm) | 1→10€ · 2→20€ | |
| Fondos temáticos / telas | desde 25€ | |
| Pack regalos/recuerdos invitados | a consultar | mín. 8 ud |
| Candy bar / mesa dulce temática | desde 120€ | |
| **Pack Baby "Dulce Espera"** | **130€** | letras cajas baby + osito + cartel LED + arco con funda + guirnalda |

**Reglas de negocio (deben ser configurables en el admin):** montaje incluido; **desmontaje +15€**; **+30 km → plus gasolina**; **> 120€ → detallito gratis**; **agendar mínimo 1 mes de antelación**; **pago al agendar**; **alquiler de estructura → fianza reembolsable** (se devuelve al comprobar estado).

**Ocasiones reales (taxonomía correcta):** cumpleaños, comuniones, bautizos, baby shower/revelación, graduaciones, despedidas, jubilaciones, inauguraciones/corporativo. *(Nota: "boda" no está en el catálogo; incluir solo si la dueña lo confirma; usar `otro` para el resto.)*

---

## 1. Decisiones de producto (cerradas con el cliente)

| Área | Decisión |
|---|---|
| Backend | **Supabase Cloud** (Postgres + Auth + Storage). Sin MinIO. |
| Catálogo | **Completo: catálogo público navegable + configurador de presupuesto + módulo Productos/Packs en admin.** |
| Pagos | **Señal online con Stripe** al reservar + gestión de **fianzas** de alquiler. |
| Panel `/admin` | Galería, Contenido/catálogo, **Productos y Packs**, **Leads + CRM**, **Presupuestos/Quotes**, **Agenda/Reservas**, **Inventario alquiler + fianzas**, **Reportes**. |
| Reservas + email | El cliente configura/pide fecha → aviso a la dueña → la dueña **acepta la reserva** → **email de confirmación al cliente desde el correo del negocio** + cobro de señal. |
| Agenda | Interna + aprobación de reservas; regla de **1 mes de antelación** y **choque de fecha** validados. |
| Web nueva | Catálogo, Configurador, **Packs**, **Landings por ocasión (SEO)**, **FAQ + Cómo funciona/Precios**, **Reseñas**, Portfolio de eventos reales. |
| Rediseño | **Elevar** (tipografía, animaciones, nav móvil, responsive). Mantener paleta. |
| Extras | Analítica + embudo, **i18n ca/es**, **PWA del panel**. |
| Fuera de v1 | Blog/Ideas (fase futura), multiusuario/roles, tienda con checkout completo (solo señal por ahora). |
| Remitente email | Recomendado dominio propio verificado (`hola@inakamoments.com`); alternativa SMTP del Gmail de la dueña. |

---

## 2. Arquitectura objetivo

```
   inakamoments.com  (Traefik + TLS Let's Encrypt)
                 │
                 ▼
     ┌───────────────────────────┐
     │  Nuxt 4 (SSR, Nitro)       │  Docker
     │  · Web pública (ca/es)     │
     │  · Catálogo + Configurador │
     │  · Panel /admin (PWA)      │
     │  · server/api (BFF)        │
     └───────────┬───────────────┘
        service_role (solo server)
                 ▼
     Supabase Cloud: Postgres (RLS) · Auth · Storage
                 │
   ┌─────────────┼───────────────┬───────────────┐
   ▼             ▼               ▼               ▼
 Stripe       Resend/SMTP     Turnstile      Plausible/Umami
 (señal/       (emails)       (anti-spam)    (analítica+embudo)
  fianzas)
```

**Principios:** un solo despliegue Nuxt (web + `/admin`); **BFF seguro** (toda escritura y pagos por `server/api/**` con service_role / claves privadas; el navegador nunca ve secretos); lecturas públicas con anon key + RLS (solo publicado).

**Módulos Nuxt:** `@nuxtjs/tailwindcss`, `@nuxtjs/supabase`, `@nuxtjs/i18n`, `@nuxt/image`, `@vite-pwa/nuxt`, `@nuxtjs/sitemap`, `@nuxtjs/turnstile`. **Pagos:** `stripe` (server) + `@stripe/stripe-js` (client).

**Estructura de carpetas (Nuxt 4, `srcDir = app/`):**
```
app/
  app.vue error.vue
  assets/css/  components/  components/admin/  composables/
  layouts/{default,admin}.vue  middleware/admin.ts
  pages/
    index.vue catalogo.vue catalogo/[slug].vue configurador.vue
    packs.vue packs/[slug].vue ocasiones/[slug].vue
    galeria.vue faq.vue como-funciona.vue resenas.vue contacto.vue
    aviso-legal.vue politica-privacidad.vue
    admin/{login,index,galeria,contenido,productos,packs,leads,presupuestos,agenda,inventario,reportes,ajustes}.vue
server/
  api/{leads.post.ts, quotes.post.ts, stripe-webhook.post.ts}
  api/admin/**   utils/{supabase,email,stripe,validation}.ts
i18n/locales/{es,ca}.json
supabase/{config.toml, migrations/*.sql, seed.sql}
docker/{Dockerfile,docker-compose.yml,docker-compose.dev.yml,traefik-dynamic.yml,DEPLOY.md}
docs/GUIA_DESARROLLO.md
```

---

## 3. Modelo de datos (Postgres / Supabase)

> Migraciones versionadas en `supabase/migrations/`. Todas con `id uuid default gen_random_uuid()`, `created_at timestamptz default now()`, **RLS activado**. Precios en `numeric(10,2)` (euros).

**Enums:**
```sql
create type event_type    as enum ('cumpleanos','comunion','bautizo','baby_shower','graduacion','despedida','jubilacion','corporativo','boda','otro');
create type lead_status    as enum ('nuevo','contactado','presupuestado','ganado','perdido');
create type quote_status   as enum ('borrador','enviado','aceptado','rechazado','caducado');
create type event_status   as enum ('tentativo','confirmado','completado','cancelado');
create type payment_type   as enum ('senal','resto','fianza','reembolso_fianza');
create type payment_status as enum ('pendiente','pagado','reembolsado','fallido');
```

**Contenido y web:**
```sql
create table site_content (section text primary key, data jsonb not null default '{}', updated_at timestamptz default now());
-- secciones: hero, about, footer, contacto, settings(reglas: desmontaje=15, km_free=30, umbral_detallito=120, antelacion_dias=30, gasolina, fianza)

create table faqs (id uuid primary key default gen_random_uuid(), question text, answer text, category text, sort_order int default 0, published boolean default true);

create table testimonials (id uuid primary key default gen_random_uuid(), author text, event_type event_type, quote text, rating int check (rating between 1 and 5), source text, published boolean default false, sort_order int default 0);

-- Landings por ocasión (SEO)
create table occasions (
  slug text primary key, event_type event_type, title text, hero jsonb, intro text,
  seo_title text, seo_description text, featured_product_ids jsonb default '[]',
  published boolean default false, sort_order int default 0
);
```

**Catálogo (productos y packs):**
```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text unique not null, category text not null,
  description text,
  base_price numeric(10,2),           -- null si "a consultar"
  price_is_from boolean default true, -- "desde X€"
  pricing jsonb default '[]',         -- tramos: [{"label":"1 columna","price":20},{"label":"Pack 2","price":35}]
  sizes jsonb default '[]',           -- ["150cm","180cm","200cm"]
  options jsonb default '[]',         -- ["látex","aluminio"] u opciones/extras
  event_types jsonb default '[]',
  is_rental boolean default false, deposit numeric(10,2) default 0, stock int default 1,
  images jsonb default '[]',          -- rutas en bucket 'catalog-media'
  active boolean default true, sort_order int default 0,
  created_at timestamptz default now()
);

create table packs (
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text unique not null, description text,
  price numeric(10,2), includes jsonb default '[]', event_types jsonb default '[]',
  images jsonb default '[]', active boolean default true, sort_order int default 0
);
```

**Presupuestos (configurador) y pagos:**
```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  tipo text, fecha date, invitados text, espacios jsonb default '[]', estilo text,
  nombre text, email text, telefono text, ideas_extra text,
  status lead_status default 'nuevo', notes text,
  source text, utm jsonb default '{}', tags jsonb default '[]',   -- CRM
  created_at timestamptz default now()
);

create table lead_activities (   -- seguimientos CRM
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  type text, note text, due_date date, done boolean default false, created_at timestamptz default now()
);

create table quotes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  client_name text, client_email text, client_phone text,
  event_type event_type, event_date date,
  status quote_status default 'borrador',
  subtotal numeric(10,2) default 0,
  adjustments jsonb default '[]',      -- desmontaje +15, gasolina, descuentos
  total numeric(10,2) default 0,
  deposit_amount numeric(10,2),        -- señal a cobrar
  valid_until date, notes text, created_at timestamptz default now()
);

create table quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references quotes(id) on delete cascade,
  product_id uuid references products(id), pack_id uuid references packs(id),
  label text, qty int default 1, unit_price numeric(10,2), options jsonb default '{}',
  line_total numeric(10,2)
);

create table events (
  id uuid primary key default gen_random_uuid(),
  title text, event_type event_type, event_date date not null,
  start_time time, end_time time, location text, km numeric, travel_fee numeric(10,2),
  client_name text, client_contact text,
  status event_status default 'tentativo',
  quote_id uuid references quotes(id) on delete set null,
  lead_id uuid references leads(id) on delete set null,
  notes text, created_at timestamptz default now()
);
create unique index events_confirmed_date on events(event_date) where status='confirmado';

create table payments (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references quotes(id), event_id uuid references events(id),
  type payment_type, amount numeric(10,2), status payment_status default 'pendiente',
  stripe_payment_intent text, stripe_checkout_session text,
  created_at timestamptz default now()
);

-- Inventario de alquiler / disponibilidad de estructuras
create table rental_bookings (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id), event_id uuid references events(id),
  date_from date, date_to date,
  deposit_amount numeric(10,2), deposit_status payment_status default 'pendiente'
);
```

**Galería / portfolio (eventos reales):**
```sql
create table event_albums (id uuid primary key default gen_random_uuid(), title text, event_type event_type, event_date date, cover_image_id uuid, published boolean default false, sort_order int default 0, created_at timestamptz default now());
create table gallery_images (id uuid primary key default gen_random_uuid(), album_id uuid references event_albums(id) on delete cascade, storage_path text, alt text, sort_order int default 0, featured boolean default false, created_at timestamptz default now());
```

**RLS (resumen):** SELECT `anon` solo de publicado en `products/packs/occasions/faqs/testimonials/event_albums/gallery_images/site_content`. `leads/quotes/quote_items/events/payments/rental_bookings/lead_activities`: **cero acceso anon** (alta de leads y de quotes del configurador y toda gestión → server con service_role). Escrituras admin y pagos → `server/api/**`.

**Storage buckets:** `gallery` (público), `catalog-media` (público, fotos de productos/packs), `catalog` (PDF público). Subidas solo por server (service_role).

**Tipos:** `supabase gen types typescript --project-id <id> > app/types/database.ts`.

---

## 4. Variables de entorno (`.env.example`)

```bash
# Supabase
SUPABASE_URL=  SUPABASE_KEY=(anon)  SUPABASE_SERVICE_KEY=(solo server)
# Sitio
NUXT_PUBLIC_SITE_URL=https://inakamoments.com
# Stripe
STRIPE_SECRET_KEY=            NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=   STRIPE_WEBHOOK_SECRET=
# Email (Resend o SMTP)
RESEND_API_KEY=  EMAIL_FROM="Inaka Moments <hola@inakamoments.com>"  EMAIL_BUSINESS=nadine.tcae@gmail.com
# Anti-spam
NUXT_PUBLIC_TURNSTILE_SITE_KEY=  NUXT_TURNSTILE_SECRET_KEY=
# Analítica
NUXT_PUBLIC_PLAUSIBLE_DOMAIN=inakamoments.com
# EmailJS (legado/fallback opcional)
NUXT_PUBLIC_EMAILJS_SERVICE_ID=  NUXT_PUBLIC_EMAILJS_TEMPLATE_ID=  NUXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```
> Secretos (`SUPABASE_SERVICE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `SMTP_*`, `NUXT_TURNSTILE_SECRET_KEY`) → `runtimeConfig` privado (solo server). **Rotar** claves EmailJS previas; destinatario = correo del negocio.

---

## FASE 0 — Reestructura y fundamentos ✅ COMPLETADA
> **✅ HECHA Y VERIFICADA** (julio 2026): multipágina activa (`app/pages/*` + layout + `<NuxtPage/>`), `app/error.vue` operativo, menú móvil rescatado, código muerto raíz borrado, footer legal cableado, taxonomía real de ocasiones en wizard/galería/carrusel/servicios/metas, copys corruptos corregidos. **Además se adelantó la dockerización completa** (ver Fase 7): imagen prod 167MB non-root con healthcheck, composes dev (hot reload verificado) y prod (Traefik+HSTS), `/api/health`, scripts npm y `DEPLOY.md`. Criterios de aceptación verificados con build de producción, curl de todas las rutas y navegación real en Chrome.
**Objetivo:** que el sitio multipágina y la nav móvil funcionen; taxonomía correcta.
**Por qué:** hoy los enlaces dan 404 y no hay menú móvil; sin base navegable nada funciona.
**Cómo:** (1) `app/pages/index.vue` con el home; (2) `app/app.vue` → `<NuxtLayout><NuxtPage/></NuxtLayout>`; (3) `app/layouts/default.vue` (header/footer); (4) mover `pages/*` → `app/pages/`; (5) `error/404.vue` → `app/error.vue`; (6) rescatar menú móvil a `app/components/TheHeader.vue` y borrar `components/`+`error/` raíz; (7) footer legal cableado; (8) sustituir taxonomía boda/comunión/cumple/empresa por las **ocasiones reales**.
**Aceptación:** navegar todas las rutas sin 404 ✅; hamburguesa a 375px ✅; `app/error.vue` en ruta inexistente ✅.

## FASE 1 — Backend Supabase + modelo de datos completo ✅ COMPLETADA
> **✅ HECHA Y VERIFICADA** (julio 2026). Proyecto Supabase Cloud **`inaka-moments`** (ref `kdjsbvvmcilbcycgxygo`, eu-west-3 París, free tier). 3 migraciones versionadas en `supabase/migrations/` (init: 15 tablas + enums + índices + triggers moddatetime; RLS: todo activado, SELECT anon solo publicado/activo; storage: buckets `gallery`/`catalog-media`/`catalog` con límites MIME/tamaño). Seed real aplicado: **18 productos, 1 pack (Dulce Espera 130€), 8 ocasiones SEO, 8 FAQs, 5 secciones de contenido**. `@nuxtjs/supabase` v2 integrado (redirectOptions solo `/admin`), `server/utils/supabase.ts` (service_role tipado), tipos en `app/types/database.ts`, polyfill WebSocket para Node<22 (`server/plugins/websocket-polyfill.ts`). **Verificado:** advisors sin errores (solo INFO esperados en tablas bloqueadas); REST anon: products/packs/occasions legibles, `leads/quotes/events/payments` → `[]` e INSERT → 401; buckets creados; build y dev OK.
> **⚠️ Pendiente manual:** copiar la **service_role key** del Dashboard (Settings → API keys) a `SUPABASE_SERVICE_KEY` en `.env` — el MCP no expone claves secretas. Necesaria a partir de Fase 2.
**Objetivo:** infra de datos lista (proyecto, migraciones §3, RLS, buckets, tipos, cliente server).
**Por qué:** base de catálogo, presupuestos, pagos, agenda, CRM y contenido.
**Cómo:** crear proyectos Cloud (dev+prod); `npm i @nuxtjs/supabase @supabase/supabase-js`; configurar módulo + `redirectOptions` para `/admin`; `supabase init`; migraciones (init, RLS, storage); `seed.sql` con productos/packs/reglas reales (§0.1) y textos (desde `config.json`); `server/utils/supabase.ts` (service_role); generar tipos.
**Aceptación:** tablas creadas ✅; `get_advisors` sin fallos ✅; `select` anónimo a `leads/quotes/events/payments` = 0 filas ✅; buckets creados ✅; seed de productos visible ✅.

## FASE 2 — Web pública dinámica (catálogo, packs, ocasiones, contenido, leads) ✅ COMPLETADA
> **✅ HECHA Y VERIFICADA** (julio 2026). **Páginas nuevas desde BD:** `/catalogo` (+ficha `[slug]` con tramos/tamaños/opciones/alquiler y relacionados), `/packs` (+`[slug]`), `/ocasiones/[slug]` (8 landings SEO), `/faq` (acordeón por categorías), `/como-funciona` (4 pasos + reglas desde `site_content.settings`), `/resenas` (con estado vacío honesto). **Conectado a BD:** galería y carrusel del home (`event_albums/gallery_images` con `NuxtImg`), Hero/About/Footer/contacto (`site_content` con defaults seguros), teaser de catálogo en home. `/servicios` → **301** `/catalogo`; nav y footer (columnas Ocasiones+Enlaces SEO) actualizados; sitemap ampliado. **Leads seguros:** `POST /api/leads` con zod + honeypot + rate-limit (5/10min) + **Turnstile** verificado server-side + inserción service_role + aviso a la dueña vía Resend (si configurado) con **fallback EmailJS** en cliente; LeadWizard con **checkbox RGPD** y captura UTM. **RGPD:** banner de cookies esenciales + política actualizada (Supabase UE como encargado, Turnstile, cookies). **Verificado:** todas las rutas 200 con contenido SSR de BD; happy path persiste; sin consentimiento→400; honeypot→200 sin persistir; 6ª petición→429; token inválido→403; solo el lead legítimo en BD; build prod OK.
> **⚠️ Para producción:** crear widget real de Turnstile (dominio) y clave de Resend con dominio verificado — hoy usa claves de TEST (siempre pasan) y EmailJS como notificador efectivo.
**Objetivo:** la web lee todo de la BD e incorpora catálogo, packs, landings SEO, FAQ/cómo funciona/reseñas y captura de leads segura.
**Por qué:** reflejar el modelo real y dejar de perder leads.
**Cómo:**
1. Composables (`useProducts`, `usePacks`, `useSiteContent`, `useGallery`, `useFaqs`, `useTestimonials`) con `useAsyncData`.
2. **Catálogo** `catalogo.vue` + ficha `catalogo/[slug].vue` (foto, precio "desde", tamaños, extras, alquiler/fianza). **Packs** `packs.vue`/`[slug].vue`.
3. **Landings por ocasión** `ocasiones/[slug].vue` desde `occasions` (SEO local: título/intro/productos destacados).
4. **FAQ** `faq.vue`, **Cómo funciona/Precios** `como-funciona.vue` (reglas: montaje incluido, desmontaje +15€, +30km gasolina, >120€ detallito, 1 mes antelación, fianza), **Reseñas** `resenas.vue`.
5. Galería/portfolio y `SocialProofGallery` desde `event_albums`/`gallery_images` (`@nuxt/image`). Corregir copys.
6. `server/api/leads.post.ts`: zod + Turnstile + rate-limit + honeypot → insertar lead + aviso a la dueña (`server/utils/email.ts`). `LeadWizard`: checkbox RGPD + Turnstile. **Banner de cookies** + actualizar política.
**Aceptación:** catálogo/packs/ocasiones/FAQ/reseñas se ven desde BD; enviar lead lo persiste y avisa; sin consentimiento/Turnstile se rechaza.

## FASE 3 — Configurador de presupuesto (público) ✅ COMPLETADA
> **✅ HECHA Y VERIFICADA** (julio 2026). **Motor de precios puro y compartido** (`shared/configurator.ts`) usado por igual en cliente y servidor: resuelve tramos (`products.pricing`) → `base_price` → "a consultar", multiplica por cantidad, aplica reglas de `site_content.settings` (desmontaje +15€, umbral detallito 120€, >30 km gasolina "a consultar") y marca alquiler/fianza. **Página** `configurador.vue` paso a paso (ocasión → fecha → productos con tramo/tamaño/opción/cantidad → datos) con **panel de presupuesto en vivo** (`ConfiguratorSummary.vue`, sidebar en desktop + hoja inferior en móvil), estado en `useState` (`useConfigurator.ts`), deep-links `?ocasion=`, `?add=<slug>` y `?addPack=<slug>`. **Endpoint** `POST /api/quotes` (mismo blindaje que leads: rate-limit 5/10min + zod + honeypot + Turnstile server-side) que **recalcula precios desde la BD** (nunca confía en el cliente), rechaza fechas pasadas, e inserta `lead(presupuestado, source=configurador)` + `quote(enviado, subtotal/adjustments/total/valid_until=+30d)` + `quote_items` (con `options` jsonb tramo/tamaño/opciones; limpieza si fallan los items). **Emails** a la dueña y al cliente ("hemos recibido tu propuesta") vía Resend (`server/utils/email.ts`) con **fallback EmailJS** si Resend no está configurado. **CTAs cableados** (header "Presupuesto", hero, catálogo, ficha de producto/pack, packs) + sitemap. **Verificado:** test unitario del motor (30 aserciones cuadran con el catálogo real); `POST` real → `quote`+`quote_items`+`lead` correctos en Supabase (total 320€ con desmontaje+gasolina+alquiler+consulta); rechazos 400 (sin consentimiento / sin líneas / producto inexistente / fecha pasada), 403 (Turnstile "always-fail"), 200 sin persistir (honeypot), 429 (rate-limit); **flujo completo en navegador** (Chrome) añadiendo productos con total en vivo (Arco ×2 → 120€ dispara el detallito) y envío que persistió y **notificó por email**; build de producción OK.
> **🐛 Bug preexistente (Fase 2) corregido de paso:** `pages/catalogo.vue` + `pages/catalogo/[slug].vue` (y packs) hacían de `[slug]` una ruta *hija* sin `<NuxtPage/>` en el padre → **las fichas de producto/pack nunca renderizaban** (servían la lista). Resuelto moviendo las listas a `catalogo/index.vue` y `packs/index.vue` (rutas hermanas). Verificado: `/catalogo/<slug>` y `/packs/<slug>` ahora muestran la ficha.
> **⚠️ Para producción:** igual que Fase 2 — Turnstile y Resend con dominio verificado (hoy claves de TEST y EmailJS como notificador efectivo). La **señal** (`quotes.deposit_amount`) se deja `null`: la fija la dueña al aceptar (Fase 4/5).
**Objetivo:** que el cliente combine productos/packs, vea **precio estimado en vivo** y envíe una solicitud de presupuesto.
**Por qué:** es el corazón del modelo "tú eliges, nosotros creamos" y el mayor motor de conversión.
**Cómo:** `configurador.vue`: paso a paso (ocasión → fecha → productos con cantidades/opciones/extras → datos de contacto). Estado con `useState`; precio calculado desde `products.pricing`/`packs.price` + reglas (desmontaje, gasolina si aplica). Enviar → `server/api/quotes.post.ts` (zod + Turnstile) crea `lead` + `quote(status='enviado')` + `quote_items`; email a la dueña y al cliente ("hemos recibido tu propuesta"). Mostrar resumen con total y "sujeto a confirmación".
**Aceptación:** el total en vivo cuadra con el catálogo ✅; enviar crea `quote`+`quote_items` correctos y ambos emails salen ✅; accesible en móvil ✅.

### 3.1 — Reestructura y ampliación de la home ✅ COMPLETADA
> **✅ HECHA Y VERIFICADA** (julio 2026). Home reestructurada a 12 secciones **data-driven**; el `LeadWizard` se movió a `/contacto` (ancla `#lead-wizard`), se corrigieron todos los `/#lead-wizard` (→ `/configurador`, con `?ocasion=` en las landings), y se extrajo `PROCESO_PASOS` (`app/utils/content.ts`) + `useBusinessRules()` compartidos con `como-funciona.vue`. **Verificado:** build de producción OK; SSR muestra todas las secciones nuevas; **reseñas autoocultables probadas en ambos sentidos** (BD vacía → oculta; publicar testimonio → aparece; borrar → oculta); sin errores/hidratación en consola; recorrido en navegador (Chrome) con ritmo visual correcto; wizard operativo en `/contacto#lead-wizard`.

> **Por qué:** con el configurador ya en marcha, el bloque inferior de la home (`#lead-wizard` → "Diseña tu evento en 2 minutos") **duplicaba** `/configurador`, y la portada se quedaba corta frente al resto del sitio. Existen páginas de reseñas/FAQ/cómo-funciona/ocasiones que **no se asomaban en la home**. Objetivo: home rica, ordenada y orientada a conversión, con secciones **data-driven** (editables desde el `/admin` de Fase 4) y sin duplicar el configurador. *(Decisiones cerradas con el cliente.)*

**Arquitectura de la home** (`app/pages/index.vue`), con fondos alternos cream/white para ritmo visual:
Hero → About → **Por qué Inaka (valor)** → **Ocasiones** → CatalogTeaser → SocialProofGallery → **Cómo funciona (teaser)** → **Reseñas** *(se autooculta)* → **Zona de servicio** → **FAQ destacadas** → **Banda CTA final** *(reemplaza al `LeadWizard`)*. Instagram **no es sección propia**: se integra (más visible) en el bloque destacado del `TheFooter.vue`.

**Componentes nuevos** (`app/components/*Section.vue`, auto-importados, cada uno lee de datos ya existentes → sin tablas nuevas):
- `WhyInakaSection` (diferenciadores desde `site_content.settings`), `OccasionsSection` (`useOccasions`), `HowItWorksSection` (pasos → extraer a `app/utils/content.ts` `PROCESO_PASOS`, compartido con `como-funciona.vue`), `TestimonialsSection` (**`v-if` sobre `useTestimonials`** → sección oculta si no hay reseñas publicadas), `FaqTeaserSection` (`useFaqs`), `ServiceAreaSection` (SEO local; `settings.km_incluidos` + `site_content.contacto.ubicacion`), `FinalCtaSection` (→ `/configurador` + `/contacto`). Instagram se reforzó en `TheFooter.vue` (bloque destacado, `site_content.contacto.instagram`) en lugar de una sección propia.
- *(Opcional DRY)* `useBusinessRules()` compartido por `WhyInakaSection` y `como-funciona.vue`.

**Mover el `LeadWizard` a `/contacto`:** quitar la `<section id="lead-wizard">` de `index.vue` y añadirla en `contacto.vue` (el componente `LeadWizard.vue` no cambia). **Corregir enlaces `/#lead-wizard`** (rotos al mover el wizard) → `/configurador`: en `ocasiones/[slug].vue` (×2), `como-funciona.vue`, `resenas.vue`, `galeria.vue` y `SocialProofGallery.vue`.

**Reseñas gestionables por la jefa:** la sección de la home **se autooculta** mientras no haya testimonios `published` (hoy el seed no trae ninguno → oculta). En cuanto se publique uno (CRUD de **Fase 4**), aparece sola. No se inventan reseñas ficticias.

**Aceptación:** home sin duplicar el configurador; todas las secciones nuevas renderizan desde BD y son responsive; la sección de reseñas aparece/desaparece según haya testimonios publicados; el `LeadWizard` persiste leads desde `/contacto`; sin enlaces `/#lead-wizard` muertos.

## FASE 4 — Panel /admin (SaaS) + flujo de reservas
**Objetivo:** panel completo y responsive con todos los módulos y el flujo aprobar-reserva → email.
**Por qué:** núcleo del encargo: la dueña gestiona negocio y web sin tocar código.
**Cómo:** `app/layouts/admin.vue` (sidebar on-brand, responsive), `admin/login.vue` (Supabase Auth + reset password), middleware `/admin/**`. Módulos:
- **Dashboard/Reportes:** leads nuevos, próximos eventos, ingresos/señales, productos más pedidos, embudo.
- **Productos/Packs:** CRUD con precios/tramos, tamaños, extras, alquiler+fianza+stock, fotos (subida con pipeline: comprimir, recorte, quitar EXIF/GPS) → `catalog-media`.
- **Galería:** CRUD de álbumes/fotos, portada, `featured`, reordenar.
- **Contenido/Ajustes:** `site_content` (hero/about/footer/contacto), FAQs, reseñas, ocasiones (SEO), reemplazo de PDF, y **reglas de negocio** (km, desmontaje, umbral detallito, antelación, fianza). Estos datos **alimentan las nuevas secciones de la home** (§3.1): las **reglas** → "Por qué Inaka", `occasions` → "Ocasiones", `faqs` → "FAQ destacadas", `contacto` → "Zona de servicio"/"Instagram".
- **Reseñas (control de visibilidad de la home):** CRUD de `testimonials` con **publicar/despublicar** y reordenar. **Publicar la primera reseña hace aparecer la sección de reseñas de la home** (que hasta entonces está autooculta, §3.1); despublicar todas la vuelve a ocultar. Sin toggle manual: la visibilidad la gobierna el propio contenido publicado.
- **Leads + CRM:** pipeline kanban por `status`, notas, `lead_activities` (seguimientos), origen/UTM, tags.
- **Presupuestos:** ver/editar `quotes` (ajustar líneas, aplicar desmontaje/gasolina/descuento), enviar al cliente, **Aceptar** → confirma `event` en la fecha (valida antelación 1 mes y choque de fecha) + **email de confirmación al cliente desde el correo del negocio** + genera cobro de señal (Fase 5).
- **Agenda:** calendario mensual + lista de `events`; CRUD manual.
- **Inventario alquiler:** `rental_bookings` (disponibilidad por fecha, fianzas).
Todas las escrituras vía `server/api/admin/**` con zod + `serverSupabaseUser`. UX: estados carga/vacío, toasts, confirmaciones, ayuda.
**Aceptación:** login protege `/admin/**`; CRUD de productos refleja en la web; **Aceptar presupuesto** crea evento confirmado y envía email; agenda e inventario operativos; panel usable en móvil.

## FASE 5 — Pagos con Stripe (señal + fianzas)
**Objetivo:** cobrar la **señal al reservar** y gestionar **fianzas** de alquiler.
**Por qué:** el catálogo exige "pago al agendar" y fianza reembolsable por alquiler.
**Cómo:** `server/utils/stripe.ts`; al aceptar un presupuesto, crear **Checkout Session** por la señal (`payments.type='senal'`); `server/api/stripe-webhook.post.ts` (verifica `STRIPE_WEBHOOK_SECRET`) actualiza `payments.status` y confirma reserva. Para alquiler: **depósito de fianza** (Checkout o PaymentIntent con captura manual/hold) y devolución al cerrar el evento (`type='reembolso_fianza'`). En admin: registrar pagos manuales (Bizum/transferencia) y ver estado. Emails de recibo.
**Aceptación:** en modo test, aceptar reserva genera link de pago; pagar marca `payments.status='pagado'` y confirma; fianza registrada y reembolsable; webhook idempotente.

## FASE 6 — Diseño elevado, i18n y PWA
**Objetivo:** subir el listón visual (paleta intacta), optimizar mobile/tablet/web, bilingüe + PWA.
**Cómo:** tipografía autoalojada (`@fontsource`: serif display + sans cuerpo) y extender `tailwind.config.js`; pulir componentes y microanimaciones (`prefers-reduced-motion`); QA responsive 375/768/1280 + accesibilidad (focus, ARIA, contraste `gold`) — **incluir las nuevas secciones de la home (§3.1)** en la QA responsive; **i18n** (`@nuxtjs/i18n`) extrayendo textos a `i18n/locales/{ca,es}.json` + selector + hreflang — **incluir los copys de las secciones nuevas de la home** (§3.1); **PWA** (`@vite-pwa/nuxt`) alcance `/admin`. Admin con estética de marca.
**Aceptación:** Lighthouse mobile bueno; ca↔es traduce toda la UI; panel instalable; sin regresiones responsive.

## FASE 7 — Docker + despliegue
> **✅ ADELANTADA A FASE 0 (dockerización hecha y verificada).** Compose **integrado en la raíz del proyecto**: `docker-compose.yml` (DEV por defecto → `docker compose up`, hot reload, instalación inteligente solo si cambia el lockfile, node_modules/.nuxt/.output en volúmenes) y `docker-compose.prod.yml` (PROD tras Traefik: apex+www, redirect www→apex, HSTS/nosniff/referrer-policy/frameDeny, **puente de env** `SUPABASE_*` → `NUXT_*` porque la imagen se construye sin secretos). Además: `docker/Dockerfile` (multi-stage node:22-alpine, non-root, caché npm BuildKit, HEALTHCHECK → imagen 167MB), `docker/traefik-dynamic.yml` (alternativa proveedor file), `server/api/health.get.ts`, `.dockerignore` (excluye `.env*`, supabase/, docs/), scripts npm `docker:dev|dev:down|build|prod|prod:down` y `docker/DEPLOY.md`.
> **Pendiente para esta fase:** despliegue real en el VPS (DNS, red `web`, certificado Let's Encrypt emitido), añadir env de Supabase/Stripe/email/turnstile al compose cuando existan, SPF/DKIM del email, webhook de Stripe, y CSP fina (Fase 8).
**Objetivo:** entornos dev/prod reproducibles; prod tras Traefik con TLS.
**Cómo:** `docker/Dockerfile` (multi-stage node:22-alpine); `docker-compose.yml` (prod, Nuxt tras Traefik en `inakamoments.com`, `/admin` como ruta, env de Supabase/Stripe/email/turnstile); `docker-compose.dev.yml` (dev, hot reload, `supabase start` para BD local); `traefik-dynamic.yml` (http→https + CSP/HSTS); `DEPLOY.md` (DNS/TLS, SPF/DKIM del email, webhook de Stripe). `.env` fuera de git; secretos solo server.
**Aceptación:** dev sirve en :3000 con hot reload ✅; build+compose prod arranca ✅ (verificado local); Traefik emite certificado (pendiente VPS).

## FASE 8 — Calidad, legal, SEO avanzado, observabilidad, contenido real
**Objetivo:** cerrar "al 100%".
**Cómo:** (1) **Calidad:** ESLint+Prettier, Vitest (utils/API/cálculo del configurador), E2E Playwright (configurador→presupuesto→aceptar→pago señal→email), GitHub Actions. (2) **SEO:** datos estructurados `LocalBusiness`, `Product`(con `offers`/precio), `Service`, `FAQPage`, `Review`, `BreadcrumbList` — aprovechar que la **home ya surface Ocasiones/FAQ/Reseñas/Zona de servicio (§3.1)** para `FAQPage`+`Review` en portada, enlazado interno a ocasiones y **SEO local** (zona de servicio); **sitemap dinámico** (productos/packs/ocasiones/álbumes); OG por página; `routeRules` de caché; **Google Business Profile** + Search Console; CWV. (3) **Legal/RGPD:** cookies, consentimiento, retención, textos legales. (4) **Observabilidad:** Sentry, uptime, **backup** BD+Storage. (5) **Analítica:** Plausible/Umami con **embudo del configurador/wizard**. (6) **Contenido real:** cargar productos/precios/packs reales (§0.1), fotos reales por el panel, WhatsApp/email reales; go-live.
**Aceptación:** CI verde; Rich Results válidos (Product/FAQ/LocalBusiness); alertas activas; panel de analítica con embudo; contenido real publicado.

---

## Reutilización directa
- `docker/{Dockerfile,docker-compose.yml,traefik-dynamic.yml}` ← `origin/phase/5-production`.
- Seed de textos ← `origin/phase/3-admin-panel:server/data/config.json`; productos/packs ← catálogo §0.1.
- `dashboard.vue` (phase/3) como referencia de UI. Módulo oficial `@nuxtjs/supabase`.

## Checklist de lanzamiento
- [ ] Rutas + nav móvil
- [ ] Taxonomía real de ocasiones
- [ ] RLS verificado
- [x] Catálogo + packs desde BD
- [x] Configurador con precio en vivo
- [x] Home reestructurada (secciones nuevas + reseñas autoocultables + wizard en /contacto)
- [x] Lead/quote persistidos + anti-spam + RGPD
- [ ] Aceptar reserva → email + señal Stripe
- [ ] Fianzas de alquiler
- [ ] Agenda + inventario
- [ ] CRM + reportes
- [ ] Landings ocasión + FAQ + reseñas (SEO)
- [ ] i18n ca/es
- [ ] PWA
- [ ] Docker dev+prod + TLS + CSP/HSTS
- [ ] Tests + CI
- [ ] Backups + Sentry + uptime
- [ ] Datos estructurados Product/FAQ/LocalBusiness
- [ ] Analítica + embudo
- [ ] Contenido y fotos reales
- [ ] Claves rotadas, destinatario = negocio
