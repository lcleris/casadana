-- Dev-only example overrides. NOT a migration. Run manually with:
--   docker exec -i casadana-postgres psql -U casadana -d casadana < apps/api/internal/db/seed_dev.sql

INSERT INTO price_overrides (villa_slug, date, price_cents) VALUES
  ('casadana', '2026-07-04', 25000),
  ('casadana', '2026-07-05', 25000),
  ('casadana', '2026-07-11', 25000),
  ('casacasay', '2026-08-15', 18000),
  ('casacasay', '2026-08-16', 18000)
ON CONFLICT (villa_slug, date) DO UPDATE
SET price_cents = EXCLUDED.price_cents,
    updated_at = NOW();
