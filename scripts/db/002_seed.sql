-- scripts/db/002_seed.sql
-- Seed inicial - Proyecto Intermodular Lovelace

BEGIN;

-- =========================
-- USUARIOS
-- =========================

-- SUPERADMIN (Jefe Economato)
INSERT INTO users (id, email, password_hash, role, nombre, apellido1)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'jefe@lovelace.local',
  'hash_superadmin',
  'SUPERADMIN',
  'Jefe',
  'Economato'
)
ON CONFLICT DO NOTHING;

-- ADMIN (Profesor)
INSERT INTO users (id, email, password_hash, role, nombre, apellido1)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'profe@lovelace.local',
  'hash_admin',
  'ADMIN',
  'Profesor',
  'Cocina'
)
ON CONFLICT DO NOTHING;

-- USER (Alumno)
INSERT INTO users (id, email, password_hash, role, nombre, apellido1)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'alumno@lovelace.local',
  'hash_user',
  'USER',
  'Alumno',
  'Primero'
)
ON CONFLICT DO NOTHING;

-- =========================
-- ESTUDIOS Y CLASES
-- =========================

INSERT INTO studies (id, name)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cocina'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Pastelería')
ON CONFLICT DO NOTHING;

INSERT INTO classes (id, level, group_code, study_id)
VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '1º CFGM', 'A', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '2º CFGM', 'B', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
ON CONFLICT DO NOTHING;

-- Alumno asignado a una clase
INSERT INTO student_profile (user_id, class_id)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'cccccccc-cccc-cccc-cccc-cccccccccccc'
)
ON CONFLICT DO NOTHING;

-- Profesor asignado a clases
INSERT INTO teacher_class (teacher_id, class_id)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd')
ON CONFLICT DO NOTHING;

-- =========================
-- PROVEEDORES
-- =========================

INSERT INTO suppliers (id, name)
VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Proveedor Alimentación SL'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Proveedor Material Hostelería')
ON CONFLICT DO NOTHING;

-- =========================
-- CATEGORÍAS
-- =========================

INSERT INTO categories (id, name, product_type)
VALUES
  ('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Verduras', 'INGREDIENT'),
  ('22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Carnes', 'INGREDIENT'),
  ('33333333-cccc-cccc-cccc-cccccccccccc', 'Utensilios', 'MATERIAL')
ON CONFLICT DO NOTHING;

-- =========================
-- PRODUCTOS
-- =========================

-- Ingrediente con caducidad
INSERT INTO products (
  id, code, name, product_type, unit_type, unit_price,
  supplier_id, category_id, yield_percent, expires_at, created_by
)
VALUES (
  '99999999-1111-1111-1111-111111111111',
  'IN_0001',
  'Patatas',
  'INGREDIENT',
  'KG',
  0.80,
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  85,
  '2026-06-01',
  '22222222-2222-2222-2222-222222222222'
)
ON CONFLICT DO NOTHING;

-- Ingrediente sin caducidad (ejemplo)
INSERT INTO products (
  id, code, name, product_type, unit_type, unit_price,
  supplier_id, category_id, yield_percent, expires_at, created_by
)
VALUES (
  '99999999-2222-2222-2222-222222222222',
  'IN_0002',
  'Sal fina',
  'INGREDIENT',
  'KG',
  0.30,
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  100,
  NULL,
  '22222222-2222-2222-2222-222222222222'
)
ON CONFLICT DO NOTHING;

-- Material (sin caducidad)
INSERT INTO products (
  id, code, name, product_type, unit_type, unit_price,
  supplier_id, category_id, expires_at, created_by
)
VALUES (
  '99999999-3333-3333-3333-333333333333',
  'MA_0001',
  'Cuchillo profesional',
  'MATERIAL',
  'UNIDAD',
  25.00,
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  '33333333-cccc-cccc-cccc-cccccccccccc',
  NULL,
  '22222222-2222-2222-2222-222222222222'
)
ON CONFLICT DO NOTHING;

-- =========================
-- INVENTARIO INICIAL
-- =========================

INSERT INTO inventory (product_id, current_qty)
VALUES
  ('99999999-1111-1111-1111-111111111111', 50),
  ('99999999-2222-2222-2222-222222222222', 10),
  ('99999999-3333-3333-3333-333333333333', 5)
ON CONFLICT DO NOTHING;

COMMIT;
