-- name: ListPriceOverrides :many
SELECT villa_slug, date, price_cents
FROM price_overrides
WHERE villa_slug = sqlc.arg('villa_slug')
  AND date >= sqlc.arg('from')
  AND date < sqlc.arg('to')
ORDER BY date;
