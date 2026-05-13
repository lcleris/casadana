package postgres

import (
	"errors"
	"fmt"
	"io/fs"

	"github.com/golang-migrate/migrate/v4"
	migratepg "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
)

// MigrateUp runs all pending migrations from the given embedded filesystem.
// subPath is the directory within the FS that contains the *.sql files
// (e.g. "migrations" if the FS is rooted at internal/db/).
func MigrateUp(pool *pgxpool.Pool, migrationsFS fs.FS, subPath string) error {
	// Do NOT defer sqlDB.Close() — the *sql.DB shares the pgx pool's connections,
	// and closing it would poison the pool that main() still owns.
	sqlDB := stdlib.OpenDBFromPool(pool)

	driver, err := migratepg.WithInstance(sqlDB, &migratepg.Config{})
	if err != nil {
		return fmt.Errorf("migrate: driver: %w", err)
	}

	src, err := iofs.New(migrationsFS, subPath)
	if err != nil {
		return fmt.Errorf("migrate: iofs source: %w", err)
	}

	m, err := migrate.NewWithInstance("iofs", src, "postgres", driver)
	if err != nil {
		return fmt.Errorf("migrate: new: %w", err)
	}
	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return fmt.Errorf("migrate: up: %w", err)
	}
	return nil
}
