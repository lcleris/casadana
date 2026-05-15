package pricing

import (
	"context"
	"time"
)

type fakeRepo struct {
	overrides []PriceOverride
	listErr   error
}

func (f *fakeRepo) ListOverrides(_ context.Context, _ string, _, _ time.Time) ([]PriceOverride, error) {
	if f.listErr != nil {
		return nil, f.listErr
	}
	return f.overrides, nil
}

type fakeAllowlist struct {
	allowed map[string]bool
}

func (f fakeAllowlist) IsKnown(slug string) bool { return f.allowed[slug] }

func d(s string) time.Time {
	t, err := time.Parse("2006-01-02", s)
	if err != nil {
		panic(err)
	}
	return t
}
