# ---- Base: Node 22 Alpine ----
FROM node:22-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Builder ----
FROM deps AS builder
COPY . .
RUN npm run build

# ---- Runner ----
FROM base AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodeapp -u 1001
USER nodeapp

# Copy built artifact
COPY --from=builder --chown=nodeapp:nodejs /app/.output ./.output
COPY --from=builder --chown=nodeapp:nodejs /app/package.json ./

# Expose port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]