-- The PRIMARY KEY (villa_slug, date) creates a B-tree index on the same
-- columns the ListPriceOverrides query filters by, so no extra index needed.
CREATE TABLE price_overrides (
    villa_slug  TEXT       NOT NULL,
    date        DATE       NOT NULL,
    price_cents INTEGER    NOT NULL CHECK (price_cents >= 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (villa_slug, date)
);
