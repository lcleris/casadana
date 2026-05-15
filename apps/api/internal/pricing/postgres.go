package pricing

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/TheHikuro/casadana/internal/db"
)

type pgRepo struct {
	pool *pgxpool.Pool
}

func NewPgRepo(pool *pgxpool.Pool) Repository { return &pgRepo{pool: pool} }

func (r *pgRepo) q() *db.Queries { return db.New(r.pool) }

func (r *pgRepo) ListOverrides(ctx context.Context, villaSlug string, from, to time.Time) ([]PriceOverride, error) {
	rows, err := r.q().ListPriceOverrides(ctx, db.ListPriceOverridesParams{
		VillaSlug: villaSlug,
		From:      pgtype.Date{Time: from, Valid: true},
		To:        pgtype.Date{Time: to, Valid: true},
	})
	if err != nil {
		return nil, err
	}
	out := make([]PriceOverride, 0, len(rows))
	for _, row := range rows {
		out = append(out, PriceOverride{
			VillaSlug:  row.VillaSlug,
			Date:       row.Date.Time,
			PriceCents: int(row.PriceCents),
		})
	}
	return out, nil
}
