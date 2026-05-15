package pricing

import (
	"context"
	"time"
)

type Service struct {
	repo  Repository
	allow VillaAllowlist
}

func NewService(repo Repository, allow VillaAllowlist) *Service {
	return &Service{repo: repo, allow: allow}
}

func (s *Service) ListOverrides(ctx context.Context, villaSlug string, from, to time.Time) ([]PriceOverride, error) {
	if !s.allow.IsKnown(villaSlug) {
		return nil, ErrUnknownVilla
	}
	if !to.After(from) {
		return nil, ErrInvalidRange
	}
	return s.repo.ListOverrides(ctx, villaSlug, from, to)
}
