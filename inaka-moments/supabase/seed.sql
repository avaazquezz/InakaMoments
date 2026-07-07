-- ═════════════════════════════════════════════════════════════════════════
-- Inaka Moments — SEED
-- Datos reales del "CATÁLOGO PRODUCTOS INAKA MOMENTS 2026" + textos actuales
-- de la web. Idempotente: on conflict do nothing (no pisa ediciones del admin).
-- ═════════════════════════════════════════════════════════════════════════

-- ── site_content ───────────────────────────────────────────────────────────
insert into public.site_content (section, data) values
('hero', '{
  "tagline": "Eventos con alma",
  "titulo": "Momentos que ",
  "titulo_span": "perduran",
  "subtitulo": "Diseñamos experiencias únicas para cumpleaños, baby showers, comuniones y toda celebración que merezca ser recordada. Cada detalle cuidado con mimo para que tu historia sea inolvidable.",
  "cta_principal": "Diseñar mi evento",
  "cta_secundario": "Descargar Catálogo"
}'),
('about', '{
  "titulo_principal": "Cada momento,",
  "titulo_secundario": "una obra de arte.",
  "parrafo_1": "En <strong>Inaka Moments</strong> creemos que los eventos más especiales de tu vida merecen ser vividos con todos los sentidos.",
  "parrafo_2": "Desde un baby shower íntimo hasta una celebración corporativa de gran escala, cada proyecto lo abordamos con la misma dedicación: escucharte, entender tu visión y convertirla en algo que supere tus expectativas.",
  "quote": "Nació de la pasión por transformar espacios en recuerdos. De la creencia de que los detalles lo son todo.",
  "cta_enlace": "Conoce cómo trabajamos"
}'),
('footer', '{
  "tagline_titulo": "Cada detalle,",
  "tagline_span": "una historia.",
  "tagline_sub": "Creamos experiencias únicas para los momentos más importantes de tu vida. Con alma, con mimo, con arte."
}'),
('contacto', '{
  "email": "nadine.tcae@gmail.com",
  "whatsapp": "+34000000000",
  "ubicacion": "Abrera, Cataluña, España",
  "instagram": "https://www.instagram.com/inaka.moments",
  "horario": {
    "lunes_viernes": "9:00 — 18:00",
    "sabados": "10:00 — 14:00",
    "domingos": "Cerrado"
  }
}'),
('settings', '{
  "desmontaje_precio": 15,
  "km_incluidos": 30,
  "plus_gasolina": "a consultar según distancia",
  "umbral_detallito": 120,
  "antelacion_dias": 30,
  "pago_al_agendar": true,
  "fianza_alquiler": "según estructura, reembolsable al comprobar el estado",
  "moneda": "EUR"
}')
on conflict (section) do nothing;

-- ── Productos (catálogo 2026) ──────────────────────────────────────────────
insert into public.products
  (slug, name, category, description, base_price, price_is_from, pricing, sizes, options, event_types, is_rental, sort_order) values

('columna-organica', 'Columna orgánica', 'estructuras',
 'Columna de globos orgánica personalizada según temática. Disponible en varias alturas, con opción de añadir extras.',
 20, false,
 '[{"label":"1 columna","price":20},{"label":"Pack 2 columnas","price":35}]',
 '["Varias alturas"]', '[]', '[]', false, 10),

('arco-organico', 'Arco orgánico', 'estructuras',
 'Arco de globos orgánico personalizado según temática. Opción de añadir extras.',
 50, true, '[]', '["200cm"]', '[]', '[]', false, 20),

('aro-360-parcial', 'Aro 360º decoración parcial', 'estructuras',
 'Aro 360º con decoración parcial de globos, personalizado según temática. Opción de añadir extras.',
 65, true, '[]', '["180cm","220cm"]', '[]', '[]', false, 30),

('aro-360-completo', 'Aro 360º completo', 'estructuras',
 'Aro 360º completamente decorado con globos, personalizado según temática. Opción de alquiler de estructura (consultar).',
 75, true, '[]', '["180cm","220cm"]', '[]', '[]', true, 40),

('arco-organico-cuadrado', 'Arco orgánico cuadrado', 'estructuras',
 'Arco cuadrado de globos orgánico personalizado según temática. Opción de añadir extras.',
 50, true, '[]', '["150cm","180cm","200cm"]', '[]', '[]', false, 50),

('composicion-arco-funda-guirnalda', 'Composición arco con funda + guirnalda', 'estructuras',
 'Composición de arco personalizado con funda según temática más guirnalda de globos.',
 95, true, '[]', '["180cm","200cm"]', '[]', '[]', false, 60),

('wall-balloon', 'Wall balloon / pared de globos', 'estructuras',
 'Pared completa de globos personalizada según temática. Opción de añadir extras.',
 95, true,
 '[{"label":"Pequeña (150×100cm)","price":95},{"label":"Grande (250×200cm)","price":135}]',
 '["150×100cm","250×200cm"]', '[]', '[]', false, 70),

('globos-helio', 'Conjunto globos de helio', 'globos',
 'Conjunto de globos de helio de hasta 25 unidades, personalizados según temática.',
 60, true, '[]', '[]', '["Látex","Aluminio"]', '[]', false, 80),

('arco-funda-tematica', 'Arco con funda temática', 'extras',
 'Arco con funda temática para crear una decoración más personalizada. Opción de alquiler de estructura (consultar).',
 40, true, '[]', '["180cm","200cm"]', '[]', '[]', true, 90),

('cilindros-decorativos', 'Cilindros decorativos con funda', 'extras',
 'Cilindros decorativos con funda temática. Precio a consultar según tamaño. Opción de alquiler de estructuras (consultar).',
 null, true, '[]', '["S","M","L"]', '[]', '[]', true, 100),

('letreros-led', 'Letrero LED', 'led',
 'Letreros LED para iluminar tu celebración.',
 15, false, '[]', '[]', '["Happy Birthday","Oh Baby"]', '[]', false, 110),

('osito-babyshower', 'Osito babyshower / revelación', 'baby',
 'Osito de peluche para babyshower o revelación de sexo, con lazo de color personalizado a elegir.',
 15, false, '[]', '[]', '[]', '["baby_shower"]', false, 120),

('cajas-baby', 'Cajas decorativas BABY', 'baby',
 'Cajas decorativas con letras B-A-B-Y.',
 10, false,
 '[{"label":"Sin globos","price":10},{"label":"Con globos","price":15}]',
 '[]', '[]', '["baby_shower"]', false, 130),

('decoracion-flores', 'Decoración con flores', 'flores',
 'Decoración floral para tu evento. Precio a consultar.',
 null, true, '[]', '[]', '["Naturales","Artificiales"]', '[]', false, 140),

('numeros-led', 'Números LED (0-9)', 'led',
 'Números LED de 70 cm de altura para cumpleaños y aniversarios.',
 10, false,
 '[{"label":"1 número","price":10},{"label":"2 números","price":20}]',
 '["70cm"]', '[]', '[]', false, 150),

('fondos-telas', 'Fondos temáticos / telas decorativas', 'extras',
 'Fondos temáticos y telas decorativas. Consultar para ajustar según tamaño.',
 25, true, '[]', '[]', '[]', '[]', false, 160),

('pack-regalos-invitados', 'Pack regalos / recuerdos invitados', 'detalles',
 'Packs de regalos y recuerdos para invitados, personalizados según temática. Mínimo 8 unidades. Precio a consultar según cantidad de invitados y contenido.',
 null, true, '[]', '[]', '[]', '[]', false, 170),

('candy-bar', 'Candy bar / mesa dulce temática', 'mesa-dulce',
 'Candy bar o mesa dulce temática completa. Consultar y confirmar número de invitados.',
 120, true, '[]', '[]', '[]', '[]', false, 180)

on conflict (slug) do nothing;

-- ── Packs ──────────────────────────────────────────────────────────────────
insert into public.packs (slug, name, description, price, includes, event_types, sort_order) values
('pack-baby-dulce-espera', 'Pack Baby "Dulce Espera"',
 'El pack completo para tu babyshower o revelación: todo lo necesario para una bienvenida inolvidable.',
 130,
 '["Letras cajas BABY","Osito de revelación","Cartel LED Oh Baby","Composición arco personalizado con funda a elegir","Guirnalda de globos personalizada"]',
 '["baby_shower"]', 10)
on conflict (slug) do nothing;

-- ── Ocasiones (landings SEO) ───────────────────────────────────────────────
insert into public.occasions (slug, event_type, title, intro, seo_title, seo_description, published, sort_order) values
('cumpleanos', 'cumpleanos', 'Decoración de cumpleaños',
 'Fiestas que transforman cualquier espacio en un lugar mágico para celebrar un año más. Arcos, columnas, números LED y mesas dulces personalizadas.',
 'Decoración de cumpleaños con globos en Abrera y Barcelona — Inaka Moments',
 'Decoración de cumpleaños con globos personalizada: arcos, columnas, números LED y candy bar. Servicio en Abrera, Baix Llobregat y alrededores de Barcelona.',
 true, 10),
('baby-shower', 'baby_shower', 'Baby shower y revelación de sexo',
 'El comienzo de una vida merece una bienvenida inolvidable. Pack "Dulce Espera", cajas BABY, osito de revelación y mucho más.',
 'Decoración baby shower y revelación de sexo en Abrera y Barcelona — Inaka Moments',
 'Decoración para baby shower y revelación de sexo: pack Dulce Espera desde 130€, arcos de globos, cartel LED Oh Baby. Abrera, Baix Llobregat y Barcelona.',
 true, 20),
('bautizos', 'bautizo', 'Decoración de bautizos',
 'Delicadeza y ternura para un día lleno de emoción y familia. Arcos orgánicos, flores, telas y detalles con alma.',
 'Decoración de bautizos en Abrera y Barcelona — Inaka Moments',
 'Decoración de bautizos con globos y flores: arcos orgánicos, fondos temáticos y candy bar. Servicio en Abrera, Baix Llobregat y Barcelona.',
 true, 30),
('comuniones', 'comunion', 'Decoración de comuniones',
 'Celebraciones elegantes para uno de los días más especiales de la familia. Aros 360º, photocall y mesas dulces.',
 'Decoración de comuniones en Abrera y Barcelona — Inaka Moments',
 'Decoración de comuniones: aros 360º personalizados, photocall, mesa dulce y detalles para invitados. Abrera, Baix Llobregat y Barcelona.',
 true, 40),
('graduaciones', 'graduacion', 'Decoración de graduaciones',
 'Cierres de etapa que se celebran a lo grande. Columnas, arcos, letreros LED y photocall para el recuerdo.',
 'Decoración de graduaciones en Abrera y Barcelona — Inaka Moments',
 'Decoración de graduaciones con globos: columnas, arcos, letreros LED y photocall. Servicio en Abrera, Baix Llobregat y Barcelona.',
 true, 50),
('despedidas', 'despedida', 'Decoración de despedidas',
 'Despedidas que se recuerdan: ambientación completa con globos, letreros y photocall para la última gran fiesta.',
 'Decoración de despedidas en Abrera y Barcelona — Inaka Moments',
 'Decoración de despedidas de soltera y soltero con globos, letreros LED y photocall. Abrera, Baix Llobregat y Barcelona.',
 true, 60),
('jubilaciones', 'jubilacion', 'Decoración de jubilaciones',
 'Homenajes a toda una vida de trabajo: decoración cálida y personalizada para celebrar el comienzo de una nueva etapa.',
 'Decoración de jubilaciones en Abrera y Barcelona — Inaka Moments',
 'Decoración de fiestas de jubilación con globos y detalles personalizados. Servicio en Abrera, Baix Llobregat y Barcelona.',
 true, 70),
('corporativo', 'corporativo', 'Eventos corporativos e inauguraciones',
 'Profesionalidad y diseño para eventos de empresa e inauguraciones que dejan huella: branding, arcos de bienvenida y wall balloons.',
 'Decoración de eventos corporativos e inauguraciones en Barcelona — Inaka Moments',
 'Decoración corporativa con globos: inauguraciones, arcos de bienvenida, paredes de globos con branding. Abrera, Baix Llobregat y Barcelona.',
 true, 80)
on conflict (slug) do nothing;

-- ── FAQs (reglas reales del catálogo) ──────────────────────────────────────
insert into public.faqs (question, answer, category, sort_order) values
('¿El montaje está incluido en el precio?',
 'Sí, todos los precios incluyen el montaje. Si también deseas el desmontaje, se añade un plus de 15€.',
 'precios', 10),
('¿Hacéis eventos fuera de Abrera?',
 'Sí. Nos desplazamos por el Baix Llobregat y alrededores de Barcelona. En eventos a más de 30 km se añade un plus de gasolina.',
 'general', 20),
('¿Hay algún regalo por volumen de pedido?',
 'Sí: si tu pedido supera los 120€, te llevas un detallito de Inaka Moments acorde a tu evento.',
 'precios', 30),
('¿Con cuánta antelación debo reservar?',
 'Es necesario agendar el evento con un mínimo de un mes de antelación para poder preparar cada detalle con mimo.',
 'reservas', 40),
('¿Cuándo se realiza el pago?',
 'Los pagos se realizan al momento de agendar el evento: así bloqueamos tu fecha en nuestra agenda.',
 'reservas', 50),
('¿Cómo funciona el alquiler de estructuras?',
 'Algunas estructuras (aros, arcos con funda, cilindros) pueden alquilarse abonando una fianza, que se devuelve al finalizar el evento tras comprobar el estado del material.',
 'precios', 60),
('¿Puedo pedir algo que no aparece en el catálogo?',
 'Claro. Consúltanos sin compromiso: te asesoramos según tu espacio, tu presupuesto y la temática que tengas en mente.',
 'general', 70),
('¿Puedo combinar varios productos?',
 'Sí, todos nuestros productos pueden combinarse entre sí. Tú eliges lo que más te gusta y nosotros nos encargamos de darle forma y convertirlo en un momento único.',
 'general', 80)
on conflict do nothing;

-- ── Galería PLACEHOLDER (reemplazar con fotos reales desde el panel, Fase 4) ─
-- UUIDs fijos → idempotente. storage_path admite URL absoluta (placeholder)
-- o ruta relativa dentro del bucket 'gallery' (fotos reales).
insert into public.event_albums (id, title, event_type, published, sort_order) values
('a0000000-0000-4000-8000-000000000001', 'Cumpleaños Colorido',        'cumpleanos',  true, 10),
('a0000000-0000-4000-8000-000000000002', 'Baby Shower "Dulce Espera"', 'baby_shower', true, 20),
('a0000000-0000-4000-8000-000000000003', 'Bautizo Clásico',            'bautizo',     true, 30),
('a0000000-0000-4000-8000-000000000004', 'Comunión Elegante',          'comunion',    true, 40),
('a0000000-0000-4000-8000-000000000005', 'Graduación Dorada',          'graduacion',  true, 50),
('a0000000-0000-4000-8000-000000000006', 'Inauguración Corporativa',   'corporativo', true, 60)
on conflict (id) do nothing;

insert into public.gallery_images (id, album_id, storage_path, alt, featured, sort_order) values
('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'https://picsum.photos/seed/cumple-colorido/800/1000',   'Decoración de cumpleaños colorido con globos', true, 10),
('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002', 'https://picsum.photos/seed/baby-shower-boho/800/1000',  'Baby shower Dulce Espera con arco de globos',  true, 20),
('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000003', 'https://picsum.photos/seed/bautizo-clasico/800/1000',   'Decoración de bautizo clásico',                true, 30),
('b0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000004', 'https://picsum.photos/seed/comunion-elegante/800/1000', 'Comunión elegante con aro 360',                true, 40),
('b0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000005', 'https://picsum.photos/seed/graduacion-dorada/800/1000', 'Graduación con columnas doradas',              true, 50),
('b0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000006', 'https://picsum.photos/seed/inauguracion-corp/800/1000', 'Inauguración corporativa con wall balloon',    true, 60)
on conflict (id) do nothing;

update public.event_albums a set cover_image_id = i.id
from public.gallery_images i
where i.album_id = a.id and a.cover_image_id is null;
