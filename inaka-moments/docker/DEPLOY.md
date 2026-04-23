# Inaka Moments — Deployment Guide (Fase 5)

## Pre requisitos

- Docker y Docker Compose instalados en el VPS
- Acceso SSH al VPS
- Dominios configurados y apuntando a la IP del VPS:
  - `inakamoments.com` → tu VPS
  - `admin.inakamoments.com` → tu VPS

---

## Paso 1 — Configurar Traefik

Copia el archivo de configuración en el VPS:

```
docker/traefik-dynamic.yml
→ /home/vazquezdev/servicios/traefik/dynamic/inaka-moments.yml
```

Traefik lo detectará automáticamente si `providers.file.directory` apunta a esa ubicación
(y ya lo hace según tu configuración actual).

**Comprueba que el archivo esté bien:**
```bash
# En el VPS
ls -la /home/vazquezdev/servicios/traefik/dynamic/inaka-moments.yml
```

---

## Paso 2 — Subir el proyecto al VPS

```bash
# En tu máquina local (desde el repositorio clonado)
scp -r inaka-moments vazquezdev@vazquezdev.pro:/home/vazquezdev/servicios/inaka-moments
```

O clona el repositorio directamente en el VPS:
```bash
git clone https://github.com/avaazquezz/InakaMoments.git /home/vazquezdev/servicios/inaka-moments
cd /home/vazquezdev/servicios/inaka-moments
git checkout main
```

---

## Paso 3 — Configurar variables de entorno

Crea el archivo `.env` en la raíz del proyecto en el VPS:

```bash
# /home/vazquezdev/servicios/inaka-moments/.env
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
NODE_ENV=production
PORT=3000
NUXT_PUBLIC_BASE_URL=https://inakamoments.com
```

---

## Paso 4 — Construir e iniciar

```bash
cd /home/vazquezdev/servicios/inaka-moments
docker compose -f docker/docker-compose.yml up -d --build
```

Ver los logs:
```bash
docker logs -f inaka-moments
```

---

## Paso 5 —SSL (Let's Encrypt automático)

Traefik maneja los certificados automáticamente cuando los dominios
apunten al VPS. La primera vez que accedes a `https://inakamoments.com`
se generará el certificado. No tienes que hacer nada manual.

---

## Paso 6 — Verificar

- Landing: `https://inakamoments.com`
- Admin: `https://admin.inakamoments.com`
- API config: `https://inakamoments.com/api/admin/config`

---

## Datos importantes

### Rutas de almacenamiento en el contenedor
```
/home/vazquezdev/uploads/inaka/   → imágenes de galería
/app/server/data/config.json       → textos, contacto y config de galería
```

### Contraseña admin
- Por defecto: `inaka2026`
- Cambiarla desde el admin panel (próximamente) o editando el hash:
  ```bash
  # En el VPS, regenerar hash (con Node):
  node -e "require('bcryptjs').hash('tu-nueva-password', 10).then(h => console.log(h))"
  # Luego escribir en:
  # /home/vazquezdev/servicios/inaka-moments/server/data/admin_hash.txt
  ```

### Comandos útiles
```bash
# Reiniciar
docker compose -f docker/docker-compose.yml restart

# Ver logs
docker logs -f inaka-moments

# Parar
docker compose -f docker/docker-compose.yml down

# Rebuild tras cambios
docker compose -f docker/docker-compose.yml up -d --build
```

---

## Solución de problemas

**502 Bad Gateway**
→ El contenedor no está funcionando. Ejecuta `docker logs -f inaka-moments`.

**SSL certificate error**
→ Los dominios aún no apuntan a la IP del VPS. Comprueba los DNS.

**Imágenes no cargan**
→ Las imágenes se guardan en el volumen Docker. Si haces `down` sin `volumes`,
   se pierden. El `docker-compose.yml` usa volúmenes persistentes (inaka-data).

**Admin no responde**
→ Comprueba que `admin.inakamoments.com` apunte correctamente al VPS.