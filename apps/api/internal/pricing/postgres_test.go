//go:build integration

package pricing

import (
	"context"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"

	dbpkg "github.com/TheHikuro/casadana/internal/db"
	pg "github.com/TheHikuro/casadana/internal/platform/postgres"
)

func setupPg(t *testing.T) *pgxpool.Pool {
	t.Helper()
	ctx := context.Background()

	container, err := postgres.Run(ctx,
		"postgres:16-alpine",
		postgres.WithDatabase("casadana_test"),
		postgres.WithUsername("test"),
		postgres.WithPassword("test"),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2).WithStartupTimeout(60*time.Second),
		),
	)
	if err != nil {
		t.Fatalf("start postgres: %v", err)
	}
	t.Cleanup(func() { _ = container.Terminate(ctx) })

	dsn, err := container.ConnectionString(ctx, "sslmode=disable")
	if err != nil {
		t.Fatalf("dsn: %v", err)
	}

	pool, err := pg.Open(ctx, dsn)
	if err != nil {
		t.Fatalf("open: %v", err)
	}
	t.Cleanup(pool.Close)

	if err := pg.MigrateUp(pool, dbpkg.Migrations, "migrations"); err != nil {
		t.Fatalf("migrate: %v", err)
	}
	return pool
}

func TestPgRepo_ListOverrides(t *testing.T) {
	pool := setupPg(t)
	ctx := context.Background()

	_, err := pool.Exec(ctx,
		`INSERT INTO price_overrides (villa_slug, date, price_cents) VALUES
		 ('casadana', '2026-07-04', 25000),
		 ('casadana', '2026-07-05', 25000),
		 ('casacasay', '2026-07-04', 18000)`)
	if err != nil {
		t.Fatalf("seed: %v", err)
	}

	repo := NewPgRepo(pool)
	out, err := repo.ListOverrides(ctx, "casadana", d("2026-07-01"), d("2026-08-01"))
	if err != nil {
		t.Fatalf("list: %v", err)
	}
	if len(out) != 2 {
		t.Errorf("len = %d, want 2", len(out))
	}
	if out[0].PriceCents != 25000 {
		t.Errorf("price_cents = %d, want 25000", out[0].PriceCents)
	}
}
