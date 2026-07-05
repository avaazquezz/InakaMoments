# Inaka Moments — Docker y despliegue

Docker Compose está integrado en la raíz del proyecto con dos entornos:

| Entorno | Fichero | Comando |
|---|---|---|
| **Desarrollo** (por defecto) | `docker-compose.yml` | `docker compose up` |
| **Producción** (Traefik+TLS) | `docker-compose.prod.yml` | `docker compose -f docker-compose.prod.yml up -d --build` |

Atajos npm equivalentes (desde `inaka-moments/`):

```bash
npm run docker:dev         # desarrollo con hot reload → http://localhost:3000
npm run docker:dev:down    # parar desarrollo
npm run docker:build       # construir la imagen de producción
npm run docker:prod        # levantar producción (build + up -d)
npm run docker:prod:down   # parar producción
```

---

## 1. Desarrollo — `docker compose up`

- Sirve en `http://localhost:3000` con **hot reload** (el código se monta desde el host).
- `node_modules`, `.nuxt` y `.output` viven en volúmenes del contenedor: no
  interfieren con los del host ni dejan ficheros de root en tu working copy.
- **Instalación inteligente**: las dependencias solo se reinstalan si cambió
  `package-lock.json` (arranques posteriores en segundos).
- Lee `.env` si existe (Supabase, EmailJS…).

Reset completo de dependencias del contenedor: `docker compose down -v`.

## 2. Imagen de producción

`docker/Dockerfile` — multi-stage sobre `node:22-alpine`:

1. **deps** — `npm ci --ignore-scripts` con caché de npm de BuildKit (builds repetidos muy rápidos).
2. **builder** — `nuxt build` → artefacto Nitro autocontenido en `.output`.
3. **runner** — imagen final mínima (~167MB): solo `.output`, **usuario no-root**
   (`nodeapp`), `HEALTHCHECK` integrado contra `/api/health`.

```bash
docker build -f docker/Dockerfile -t inaka-moments .
docker run --rm -p 3000:3000 --env-file .env \
  -e NUXT_PUBLIC_SUPABASE_URL="$SUPABASE_URL" \
  -e NUXT_PUBLIC_SUPABASE_KEY="$SUPABASE_KEY" \
  -e NUXT_SUPABASE_SERVICE_KEY="$SUPABASE_SERVICE_KEY" \
  inaka-moments
```

> ℹ️ La imagen se construye **sin** secretos, y en runtime Nuxt solo mapea
> variables `NUXT_*` sobre su runtimeConfig. Con `docker compose` no tienes que
> hacer nada: `docker-compose.prod.yml` ya **puentea** las variables canónicas
> del `.env` (`SUPABASE_URL` → `NUXT_PUBLIC_SUPABASE_URL`, etc.). El bloque de
> arriba solo aplica si usas `docker run` a pelo.

Seguridad:
- `.dockerignore` excluye `.env*` — **los secretos nunca entran en la imagen**;
  se inyectan en runtime (`--env-file` / `env_file` / entorno del VPS).
- El contenedor corre como usuario sin privilegios.

## 3. Producción en el VPS (Traefik)

Requisitos previos (una sola vez):

```bash
# Red compartida con Traefik
docker network create web

# DNS: A/AAAA de inakamoments.com y www.inakamoments.com → IP del VPS
```

Despliegue:

```bash
cd inaka-moments
# Crear .env de producción (ver .env.example) y luego:
docker compose -f docker-compose.prod.yml up -d --build
```

El compose de producción define (vía labels de Traefik):
- Router HTTPS para `inakamoments.com` y `www.` con Let's Encrypt (`certresolver=le`).
- Redirección **www → apex** permanente.
- Cabeceras de seguridad: **HSTS** (1 año, preload), `nosniff`, `referrer-policy`, `frameDeny`.
  - La **CSP** fina se añade en Fase 8, cuando el conjunto de dominios externos
    (Supabase, Stripe, Turnstile, analítica) esté cerrado.
- `/admin` es una **ruta de la misma app** — no necesita router ni subdominio propio.

### ¿Tu Traefik usa proveedor de ficheros en vez de labels?

Copia `docker/traefik-dynamic.yml` al directorio dynamic de tu Traefik
(p. ej. `/home/vazquezdev/servicios/traefik/dynamic/inaka-moments.yml`).
**No uses ambos a la vez** (labels + file) o tendrás routers duplicados.

## 4. Variables de entorno (runtime)

Se leen del `.env` junto a `package.json` (ver `.env.example`):

```bash
# Supabase (proyecto inaka-moments, ref kdjsbvvmcilbcycgxygo)
SUPABASE_URL=...
SUPABASE_KEY=...              # publishable/anon (pública)
SUPABASE_SERVICE_KEY=...      # service_role — SOLO servidor

NUXT_PUBLIC_SITE_URL=https://inakamoments.com

# EmailJS (legado/fallback)
NUXT_PUBLIC_EMAILJS_*=...
```

En fases siguientes se añaden `STRIPE_*`, `RESEND_API_KEY`, `NUXT_TURNSTILE_*`, etc.
(ver `docs/GUIA_DESARROLLO.md` §4). Regla de oro: los secretos de servidor van
en `runtimeConfig` privado y **jamás** con prefijo `NUXT_PUBLIC_`.

## 5. Healthcheck y operación

- Endpoint: `GET /api/health` → `{ "status": "ok", "timestamp": "..." }`.
- Docker lo comprueba cada 30 s (`docker ps` muestra `healthy`/`unhealthy`).
- Logs: `docker logs -f inaka-moments`.
- Actualizar versión: `git pull && npm run docker:prod` (build + recreate).
- Rollback rápido: etiquetar la imagen anterior (`docker tag`) y `up -d` con ella.
