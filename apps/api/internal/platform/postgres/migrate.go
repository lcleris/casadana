package postgres

import (
	"errors"
	"fmt"

	"github.com/golang-migrate/migrate/v4"
	migratepg "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
)

// MigrateUp runs all pending migrations from the given filesystem source.
// sourceURL example: "file://internal/db/migrations"
func MigrateUp(pool *pgxpool.Pool, sourceURL string) error {
	// Do NOT defer sqlDB.Close() — the *sql.DB shares the pgx pool's connections,
	// and closing it would poison the pool that main() still owns.
	sqlDB := stdlib.OpenDBFromPool(pool)

	driver, err := migratepg.WithInstance(sqlDB, &migratepg.Config{})
	if err != nil {
		return fmt.Errorf("migrate: driver: %w", err)
	}
	m, err := migrate.NewWithDatabaseInstance(sourceURL, "postgres", driver)
	if err != nil {
		return fmt.Errorf("migrate: new: %w", err)
	}
	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return fmt.Errorf("migrate: up: %w", err)
	}
	return nil
}
