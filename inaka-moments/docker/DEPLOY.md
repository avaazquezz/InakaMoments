# Inaka Moments — Docker y despliegue

Todo el proyecto está dockerizado con dos entornos:

| Entorno | Fichero | Qué hace |
|---|---|---|
| **Desarrollo** | `docker/docker-compose.dev.yml` | Nuxt dev con hot reload en `http://localhost:3000`, código montado como volumen |
| **Producción** | `docker/docker-compose.yml` | Build multi-stage + contenedor mínimo detrás de Traefik con TLS |

Atajos npm (desde `inaka-moments/`):

```bash
npm run docker:dev     # entorno de desarrollo con hot reload
npm run docker:build   # construir la imagen de producción
npm run docker:prod    # levantar producción (build + up -d)
npm run docker:down    # parar producción
```

---

## 1. Desarrollo

```bash
docker compose -f docker/docker-compose.dev.yml up
```

- Sirve en `http://localhost:3000` con **hot reload** (el código se monta desde el host).
- `node_modules` vive en un volumen del contenedor: no interfiere con los del host.
- Lee `.env` si existe (opcional). Primera ejecución tarda más (`npm ci`).

Para reinstalar dependencias limpias: `docker compose -f docker/docker-compose.dev.yml down -v`.

## 2. Imagen de producción

`docker/Dockerfile` — multi-stage sobre `node:22-alpine`:

1. **deps** — `npm ci --ignore-scripts` con caché de npm de BuildKit (builds repetidos muy rápidos).
2. **builder** — `nuxt build` → artefacto Nitro autocontenido en `.output`.
3. **runner** — imagen final mínima: solo `.output`, **usuario no-root** (`nodeapp`), `HEALTHCHECK` integrado contra `/api/health`.

```bash
docker build -f docker/Dockerfile -t inaka-moments .
docker run --rm -p 3000:3000 --env-file .env inaka-moments
```

Notas de seguridad:
- `.dockerignore` excluye `.env*` — **los secretos nunca entran en la imagen**; se inyectan en runtime (`--env-file` / `env_file` / entorno del VPS).
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
# Crear .env de producción (ver variables abajo) y luego:
docker compose -f docker/docker-compose.yml up -d --build
```

El compose define (vía labels de Traefik):
- Router HTTPS para `inakamoments.com` y `www.` con certificado Let's Encrypt (`certresolver=le`).
- Redirección **www → apex** permanente.
- Cabeceras de seguridad: **HSTS** (1 año, preload), `nosniff`, `referrer-policy`, `frameDeny`.
  - La **CSP** fina se añade en Fase 8, cuando el conjunto de dominios externos (Supabase, Stripe, Turnstile, analítica) esté cerrado.
- `/admin` es una **ruta de la misma app** — no necesita router ni subdominio propio.

### ¿Tu Traefik usa proveedor de ficheros en vez de labels?

Copia `docker/traefik-dynamic.yml` al directorio dynamic de tu Traefik
(p. ej. `/home/vazquezdev/servicios/traefik/dynamic/inaka-moments.yml`).
**No uses ambos a la vez** (labels + file) o tendrás routers duplicados.

## 4. Variables de entorno (runtime)

Se leen del `.env` junto a `package.json` (ver `.env.example`). Hoy:

```bash
NUXT_PUBLIC_EMAILJS_SERVICE_ID=...
NUXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NUXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
NUXT_PUBLIC_EMAILJS_RECIPIENT=...
```

En fases siguientes se añaden `SUPABASE_*`, `STRIPE_*`, `RESEND_API_KEY`, etc.
(ver `docs/GUIA_DESARROLLO.md` §4). Regla de oro: los secretos de servidor van
en `runtimeConfig` privado y **jamás** con prefijo `NUXT_PUBLIC_`.

## 5. Healthcheck y operación

- Endpoint: `GET /api/health` → `{ "status": "ok", "timestamp": "..." }`.
- Docker lo comprueba cada 30 s (`docker ps` muestra `healthy`/`unhealthy`).
- Logs: `docker logs -f inaka-moments`.
- Actualizar a una nueva versión: `git pull && npm run docker:prod` (build + recreate).
- Rollback rápido: `docker compose -f docker/docker-compose.yml up -d` con la imagen anterior etiquetada (`docker tag`).
