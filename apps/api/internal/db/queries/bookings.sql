-- name: InsertBooking :one
INSERT INTO bookings (
    id, villa_slug, guest_name, guest_email, guest_phone,
    check_in, check_out, adults, children, message, status
) VALUES (
    $1, $2, $3, $4, $5,
    $6, $7, $8, $9, $10, $11
)
RETURNING *;

-- name: GetBookingByID :one
SELECT * FROM bookings WHERE id = $1;

-- name: FindOverlappingBookings :many
SELECT * FROM bookings
WHERE villa_slug = $1
  AND status IN ('pending', 'approved', 'paid')
  AND check_in  < $3
  AND check_out > $2;

-- name: ListBookingsByStatus :many
SELECT * FROM bookings
WHERE status = $1
ORDER BY created_at DESC;

-- name: UpdateBookingStatus :exec
UPDATE bookings
SET status = $2, updated_at = $3
WHERE id = $1;

-- name: ListBookedRanges :many
SELECT check_in, check_out FROM bookings
WHERE villa_slug = $1
  AND status IN ('approved', 'paid')
  AND check_in  < $3
  AND check_out > $2
ORDER BY check_in;
