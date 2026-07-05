# Inaka Moments — Web + SaaS de gestión

> *"Momentos bonitos, recuerdos para siempre"* — Decoración de eventos con globos
> en Abrera (Baix Llobregat, Barcelona). Web pública + panel de administración.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend/SSR | **Nuxt 4** (Vue 3, Nitro) + Tailwind CSS |
| Backend | **Supabase Cloud** (Postgres + RLS, Auth, Storage) — proyecto `inaka-moments` (eu-west-3) |
| Emails | EmailJS (legado) → transaccional server-side (Fase 2+) |
| Despliegue | **Docker** multi-stage + **Traefik** (TLS Let's Encrypt) en VPS |

📘 **La hoja de ruta completa del proyecto está en [`docs/GUIA_DESARROLLO.md`](docs/GUIA_DESARROLLO.md)** — fases 0-8 con estado, criterios de aceptación y decisiones de arquitectura. Consúltala antes de tocar código.

## Arranque rápido

```bash
cp .env.example .env      # y rellena las claves (Supabase, EmailJS)

# Opción A — local (requiere Node 20+; 22 recomendado)
npm install
npm run dev               # http://localhost:3000

# Opción B — Docker (no requiere Node en el host)
docker compose up         # http://localhost:3000 con hot reload
```

## Scripts

```bash
npm run dev               # desarrollo local
npm run build             # build de producción (Nitro)
npm run preview           # previsualizar el build

npm run docker:dev        # = docker compose up (dev con hot reload)
npm run docker:dev:down   # parar dev
npm run docker:build      # construir imagen de producción (~167MB, non-root)
npm run docker:prod       # producción: docker compose -f docker-compose.prod.yml up -d --build
npm run docker:prod:down  # parar producción
```

Despliegue en VPS con Traefik: ver **[`docker/DEPLOY.md`](docker/DEPLOY.md)**.

## Estructura

```
app/                  # código Nuxt (srcDir)
  components/         # UI pública (Hero, LeadWizard, galerías…)
  layouts/            # default (público) · admin (Fase 4)
  pages/              # rutas: index, servicios, galeria, contacto, legales
  types/database.ts   # tipos generados del esquema Supabase (no editar a mano)
server/
  api/                # endpoints Nitro (health; leads/quotes en Fase 2+)
  utils/supabase.ts   # cliente service_role (SOLO servidor)
  plugins/            # polyfill WebSocket para Node < 22
supabase/
  migrations/         # esquema versionado (init, RLS, storage)
  seed.sql            # datos reales del catálogo 2026
docker/               # Dockerfile, traefik-dynamic.yml, DEPLOY.md
docker-compose.yml    # DESARROLLO (por defecto)
docker-compose.prod.yml # PRODUCCIÓN (Traefik + TLS)
docs/GUIA_DESARROLLO.md # guía maestra del proyecto
```

## Base de datos

Esquema en `supabase/migrations/` (15 tablas: catálogo, leads+CRM, presupuestos,
agenda, pagos, alquiler, galería, contenido). **RLS activado en todo**: el
navegador solo lee contenido publicado; toda escritura pasa por `server/api/**`
con la `service_role` key.

Regenerar tipos tras cambiar el esquema:

```bash
supabase gen types typescript --project-id kdjsbvvmcilbcycgxygo > app/types/database.ts
```

## Convenciones

- Paleta de marca en `tailwind.config.js` (`inaka-terra/gold/mauve/beige/nude/cream`) — **no cambiar**.
- Taxonomía de ocasiones: `event_type` enum (cumpleaños, baby_shower, bautizo, comunión, graduación, despedida, jubilación, corporativo, otro).
- Secretos: solo en `.env` (gitignored) y `runtimeConfig` privado. Nunca `NUXT_PUBLIC_` para claves de servidor.
