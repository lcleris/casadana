package pricing

import (
	"context"
	"time"
)

type Repository interface {
	ListOverrides(ctx context.Context, villaSlug string, from, to time.Time) ([]PriceOverride, error)
}

type VillaAllowlist interface {
	IsKnown(slug string) bool
}
