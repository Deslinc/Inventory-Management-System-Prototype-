-- ============================================================
-- Run this once in PostgreSQL to create the inventory table
-- In TablePlus or pgAdmin: open a query window and paste this
-- ============================================================

CREATE TABLE IF NOT EXISTS inventory (
  id          SERIAL PRIMARY KEY,
  sku         VARCHAR(20)   NOT NULL UNIQUE,
  name        VARCHAR(300)  NOT NULL,
  vendor      VARCHAR(200),
  cat         VARCHAR(100),
  subcat      VARCHAR(100),
  food        VARCHAR(20)   DEFAULT 'FOOD',
  price       DECIMAL(10,2),
  oh          INTEGER       DEFAULT 0,
  reorder_at  INTEGER       DEFAULT 10,
  status      VARCHAR(20)   DEFAULT 'Active',
  created_at  TIMESTAMP     DEFAULT NOW(),
  updated_at  TIMESTAMP     DEFAULT NOW()
);

-- Example: insert one row to test
INSERT INTO inventory (sku, name, vendor, cat, subcat, food, price, oh, status)
VALUES ('000001', 'Bel Aqua Mineral Water 1.5L', 'Blowchem Industries', 'SOFT DRINKS', 'Mineral Water', 'FOOD', 3.50, 42, 'Active')
ON CONFLICT (sku) DO NOTHING;
