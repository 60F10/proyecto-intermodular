-- scripts/db/001_init.sql
-- Modelo actualizado - Proyecto Intermodular Lovelace

BEGIN;

-- =========================
-- EXTENSION
-- =========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- ENUMS
-- =========================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('SUPERADMIN', 'ADMIN', 'USER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE delivery_status AS ENUM ('PENDING', 'IN_PROGRESS', 'DELIVERED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE incident_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE incident_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE inventory_movement_type AS ENUM ('ENTRY', 'EXIT', 'ADJUSTMENT', 'LOSS');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================
-- USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         varchar(255) UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role          user_role NOT NULL,
  nombre        varchar(120) NOT NULL,
  apellido1     varchar(120) NOT NULL,
  apellido2     varchar(120),
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- PRODUCTS
-- =========================
CREATE TABLE IF NOT EXISTS products (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      varchar(255) NOT NULL,
  descripcion text,
  sku         varchar(100) UNIQUE NOT NULL,
  precio      numeric(12,2) NOT NULL CHECK (precio >= 0),
  stock       int NOT NULL DEFAULT 0,
  categoria   varchar(255),
  activo      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- ORDERS
-- =========================
CREATE TABLE IF NOT EXISTS orders (
  id                 uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_orden       varchar(50) UNIQUE NOT NULL,
  usuario_id         uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  estado             order_status NOT NULL DEFAULT 'PENDING',
  monto_total        numeric(12,2) NOT NULL CHECK (monto_total >= 0),
  observaciones      text,
  domicilio_entrega  varchar(255),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_estado ON orders(estado);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- =========================
-- ORDER ITEMS
-- =========================
CREATE TABLE IF NOT EXISTS order_items (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  producto_id     uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  cantidad        int NOT NULL CHECK (cantidad > 0),
  precio_unitario numeric(12,2) NOT NULL CHECK (precio_unitario >= 0),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_producto_id ON order_items(producto_id);

-- =========================
-- DELIVERY NOTES
-- =========================
CREATE TABLE IF NOT EXISTS delivery_notes (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_remito    varchar(50) UNIQUE NOT NULL,
  pedido_id        uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  estado           delivery_status NOT NULL DEFAULT 'PENDING',
  transportista    varchar(255) NOT NULL,
  numero_tracking  varchar(50),
  fecha_entrega    timestamptz,
  observaciones    text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_delivery_notes_estado ON delivery_notes(estado);

-- =========================
-- INCIDENTS
-- =========================
CREATE TABLE IF NOT EXISTS incidents (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo       varchar(255) NOT NULL,
  descripcion  text NOT NULL,
  prioridad    incident_priority NOT NULL DEFAULT 'MEDIUM',
  estado       incident_status NOT NULL DEFAULT 'OPEN',
  pedido_id    uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  usuario_id   uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resolucion   text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_incidents_estado ON incidents(estado);
CREATE INDEX IF NOT EXISTS idx_incidents_prioridad ON incidents(prioridad);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at);

-- =========================
-- INVENTORY MOVEMENTS
-- =========================
CREATE TABLE IF NOT EXISTS inventory_movements (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id   uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  tipo          inventory_movement_type NOT NULL,
  cantidad      int NOT NULL,
  motivo        text,
  usuario_id    uuid REFERENCES users(id) ON DELETE SET NULL,
  observaciones text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_producto_id ON inventory_movements(producto_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_tipo ON inventory_movements(tipo);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_created_at ON inventory_movements(created_at);

COMMIT;
