# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────────────────────
# Inaka Moments — imagen de producción (Nuxt 4 / Nitro node-server)
# Multi-stage: deps → builder → runner. Imagen final mínima: solo .output.
# Build:  docker build -f docker/Dockerfile -t inaka-moments .
# ─────────────────────────────────────────────────────────────────────────────

# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# ---- Dependencies (con caché de npm entre builds) ----
FROM base AS deps
ENV NODE_ENV=development
COPY package.json package-lock.json ./
# --ignore-scripts: evita el postinstall (nuxt prepare) sin el código fuente;
# nuxt build ya hace su propio prepare en la etapa builder.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts

# ---- Builder ----
FROM deps AS builder
COPY . .
RUN npm run build

# ---- Runner (imagen final) ----
FROM base AS runner

# Usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nodeapp -u 1001

# Artefacto autocontenido de Nitro (no necesita node_modules)
COPY --from=builder --chown=nodeapp:nodejs /app/.output ./.output

USER nodeapp

ENV NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000 \
    HOST=0.0.0.0 \
    PORT=3000

EXPOSE 3000

# Healthcheck contra el endpoint /api/health (wget viene en busybox/alpine)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", ".output/server/index.mjs"]
