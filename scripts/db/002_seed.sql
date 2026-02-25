-- scripts/db/002_seed.sql
-- Seed inicial - Proyecto Intermodular Lovelace
-- NOTA: Contraseñas hasheadas con bcryptjs (cost=10), compatibles con el backend NestJS.
-- Para regenerar los hashes: npx ts-node --transpile-only backend/scripts/generate-hashes.ts
-- Credenciales de desarrollo:
-- - admin@lovelace.edu        → password: SuperAdmin2026!
-- - carlos.ruiz@lovelace.edu  → password: Admin2026!
-- - maria.garcia@lovelace.edu → password: Usuario2026!

BEGIN;

-- =========================
-- USUARIOS
-- =========================

INSERT INTO users (id, email, password_hash, role, nombre, apellido1, apellido2, is_active)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'admin@lovelace.edu',
    '$2b$10$Jh863TCoTT35wZNnA9SKnO60JQtjUjOsriyimGlJcREOFzmxuSnMe',
    'SUPERADMIN',
    'Ana',
    'Martínez',
    'López',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'carlos.ruiz@lovelace.edu',
    '$2b$10$joyUnNU5Q0fjNMyYVIpMTOXiqOlr63V8cyra8a8g2cAMeBZ7Y20Hq',
    'ADMIN',
    'Carlos',
    'Ruiz',
    'Fernández',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'maria.garcia@lovelace.edu',
    '$2b$10$SLRIylg/BSp2Nl5732vPLuI1LgVeSSyQGv2RyjCABxPu89Bes7qmq',
    'USER',
    'María',
    'García',
    'Sánchez',
    true
  )
ON CONFLICT DO NOTHING;

-- =========================
-- PRODUCTOS
-- =========================

INSERT INTO products (
  id, nombre, descripcion, sku, precio, stock, categoria, activo
)
VALUES
  (
    '99999999-1111-1111-1111-111111111111',
    'Patata Agria (Nacional)',
    'Patata para freír, calibre medio',
    'VER-001',
    1.25,
    75,
    'Verduras y Hortalizas',
    true
  ),
  (
    '99999999-2222-2222-2222-222222222222',
    'Cebolla Dulce',
    'Cebolla dulce para sofritos',
    'VER-002',
    0.95,
    35,
    'Verduras y Hortalizas',
    true
  ),
  (
    '99999999-3333-3333-3333-333333333333',
    'Tomate Rama',
    'Tomate fresco de temporada',
    'VER-003',
    2.35,
    22,
    'Verduras y Hortalizas',
    true
  ),
  (
    '99999999-4444-4444-4444-444444444444',
    'Pechuga de Pollo (Fileteada)',
    'Pechuga de pollo limpia y fileteada',
    'CAR-001',
    7.85,
    18,
    'Carnes y Aves',
    true
  ),
  (
    '99999999-5555-5555-5555-555555555555',
    'Ternera (Solomillo)',
    'Solomillo de ternera',
    'CAR-002',
    12.50,
    8,
    'Carnes y Aves',
    true
  ),
  (
    '99999999-6666-6666-6666-666666666666',
    'Leche Fresca Completa (Litro)',
    'Leche fresca de vaca',
    'LAC-001',
    1.50,
    45,
    'Lácteos y Derivados',
    true
  ),
  (
    '99999999-7777-7777-7777-777777777777',
    'Mantequilla sin Sal',
    'Mantequilla natural',
    'LAC-002',
    3.25,
    12,
    'Lácteos y Derivados',
    true
  ),
  (
    '99999999-8888-8888-8888-888888888888',
    'Aceite de Oliva Virgen Extra',
    'Aceite de primera presión',
    'ACE-001',
    8.50,
    15,
    'Aceites y Condimentos',
    true
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    'Sal Marina Fina',
    'Sal de mar refinada',
    'ACE-002',
    0.60,
    25,
    'Aceites y Condimentos',
    true
  ),
  (
    '99999999-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Cuchillo Chef 20cm Profesional',
    'Cuchillo para truculenias',
    'UTE-001',
    35.90,
    8,
    'Utensilios de Cocina',
    true
  ),
  (
    '99999999-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Tabla de Corte Polietileno (Grande)',
    'Tabla de corte higiénica',
    'UTE-002',
    18.75,
    12,
    'Utensilios de Cocina',
    true
  ),
  (
    '99999999-cccc-cccc-cccc-cccccccccccc',
    'Batidora de Varillas Eléctrica',
    'Batidora eléctrica profesional',
    'UTE-003',
    125.00,
    3,
    'Utensilios de Cocina',
    true
  )
ON CONFLICT DO NOTHING;

-- =========================
-- MOVIMIENTOS DE INVENTARIO
-- =========================

INSERT INTO inventory_movements (
  id, producto_id, tipo, cantidad, motivo, usuario_id, observaciones
)
VALUES
  (uuid_generate_v4(), '99999999-1111-1111-1111-111111111111', 'ENTRY', 75, 'Stock inicial', '11111111-1111-1111-1111-111111111111', NULL),
  (uuid_generate_v4(), '99999999-2222-2222-2222-222222222222', 'ENTRY', 35, 'Stock inicial', '11111111-1111-1111-1111-111111111111', NULL),
  (uuid_generate_v4(), '99999999-3333-3333-3333-333333333333', 'ENTRY', 22, 'Stock inicial', '11111111-1111-1111-1111-111111111111', NULL),
  (uuid_generate_v4(), '99999999-4444-4444-4444-444444444444', 'ENTRY', 18, 'Stock inicial', '11111111-1111-1111-1111-111111111111', NULL),
  (uuid_generate_v4(), '99999999-5555-5555-5555-555555555555', 'ENTRY', 8, 'Stock inicial', '11111111-1111-1111-1111-111111111111', NULL),
  (uuid_generate_v4(), '99999999-6666-6666-6666-666666666666', 'ENTRY', 45, 'Stock inicial', '11111111-1111-1111-1111-111111111111', NULL),
  (uuid_generate_v4(), '99999999-7777-7777-7777-777777777777', 'ENTRY', 12, 'Stock inicial', '11111111-1111-1111-1111-111111111111', NULL),
  (uuid_generate_v4(), '99999999-8888-8888-8888-888888888888', 'ENTRY', 15, 'Stock inicial', '11111111-1111-1111-1111-111111111111', NULL),
  (uuid_generate_v4(), '99999999-9999-9999-9999-999999999999', 'ENTRY', 25, 'Stock inicial', '11111111-1111-1111-1111-111111111111', NULL),
  (uuid_generate_v4(), '99999999-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ENTRY', 8, 'Stock inicial', '11111111-1111-1111-1111-111111111111', NULL),
  (uuid_generate_v4(), '99999999-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ENTRY', 12, 'Stock inicial', '11111111-1111-1111-1111-111111111111', NULL),
  (uuid_generate_v4(), '99999999-cccc-cccc-cccc-cccccccccccc', 'ENTRY', 3, 'Stock inicial', '11111111-1111-1111-1111-111111111111', NULL)
ON CONFLICT DO NOTHING;

COMMIT;
