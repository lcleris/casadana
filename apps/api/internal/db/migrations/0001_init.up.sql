CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE booking_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled',
    'paid'
);

CREATE TABLE bookings (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    villa_slug   TEXT        NOT NULL,
    guest_name   TEXT        NOT NULL,
    guest_email  TEXT        NOT NULL,
    guest_phone  TEXT        NOT NULL,
    check_in     DATE        NOT NULL,
    check_out    DATE        NOT NULL,
    adults       SMALLINT    NOT NULL CHECK (adults  >= 1),
    children     SMALLINT    NOT NULL DEFAULT 0 CHECK (children >= 0),
    message      TEXT        NOT NULL DEFAULT '',
    status       booking_status NOT NULL DEFAULT 'pending',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT booking_dates_valid CHECK (check_out > check_in)
);

CREATE INDEX bookings_overlap_idx
    ON bookings (villa_slug, check_in, check_out)
    WHERE status IN ('pending', 'approved', 'paid');
