# Inaka Moments — atajos Docker. Ejecutar desde inaka-moments/.
# Equivalentes a los scripts npm docker:* ya existentes. Ver docker/DEPLOY.md.

.PHONY: dev dev-down prod prod-down build logs

dev: ## Desarrollo con hot reload → http://localhost:3000
	docker compose up

dev-down: ## Parar desarrollo
	docker compose down

build: ## Construir la imagen de producción
	docker build -f docker/Dockerfile -t inaka-moments .

prod: ## Levantar producción (build + up -d), tras Traefik
	docker compose -f docker-compose.prod.yml up -d --build

prod-down: ## Parar producción
	docker compose -f docker-compose.prod.yml down

logs: ## Logs de producción en vivo
	docker compose -f docker-compose.prod.yml logs -f
