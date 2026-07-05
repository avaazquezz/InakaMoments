-- ═════════════════════════════════════════════════════════════════════════
-- Inaka Moments — 0003: buckets de Storage
--
--   · gallery        → fotos de eventos reales (galería/portfolio)
--   · catalog-media  → fotos de productos y packs del catálogo
--   · catalog        → PDF del catálogo descargable
--
-- Todos con lectura pública (URL pública). SIN políticas de escritura para
-- anon/authenticated: las subidas pasan por server/api/admin/** (service_role).
-- Límites de tamaño y MIME para evitar subidas indebidas.
-- ═════════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('gallery',       'gallery',       true, 10485760, array['image/jpeg','image/png','image/webp','image/avif']),
  ('catalog-media', 'catalog-media', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif']),
  ('catalog',       'catalog',       true, 26214400, array['application/pdf'])
on conflict (id) do nothing;
