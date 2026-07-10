-- Añade dirección del evento y distancia calculada (haversine desde Abrera).
alter table public.quotes
  add column location    text,
  add column distance_km numeric(6,2);

comment on column public.quotes.location is
  'Dirección del evento tal y como la introdujo el cliente (texto libre).';
comment on column public.quotes.distance_km is
  'Distancia en línea recta (km) desde Abrera, calculada server-side (Nominatim + haversine) al enviar. NULL si no se pudo geocodificar.';
