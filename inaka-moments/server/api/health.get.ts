// Endpoint de salud para healthchecks de Docker/Traefik/uptime monitoring.
export default defineEventHandler(() => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
}))
