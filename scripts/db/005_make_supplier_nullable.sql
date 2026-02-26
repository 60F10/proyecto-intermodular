-- Make products.supplier_id nullable so products can be disassociated before hard delete
BEGIN;

ALTER TABLE products ALTER COLUMN supplier_id DROP NOT NULL;

COMMIT;
