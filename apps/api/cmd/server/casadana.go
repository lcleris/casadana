package main

import (
	"context"
	"log/slog"
	"os"
	"time"

	"github.com/TheHikuro/casadana/internal/booking"
	"github.com/TheHikuro/casadana/internal/db"
	"github.com/TheHikuro/casadana/internal/openapi"
	"github.com/TheHikuro/casadana/internal/platform/config"
	"github.com/TheHikuro/casadana/internal/platform/email"
	"github.com/TheHikuro/casadana/internal/platform/httpserver"
	"github.com/TheHikuro/casadana/internal/platform/logger"
	"github.com/TheHikuro/casadana/internal/platform/postgres"
	"github.com/TheHikuro/casadana/internal/pricing"
	"github.com/TheHikuro/casadana/internal/villaslug"
)

type realClock struct{}

func (realClock) Now() time.Time { return time.Now().UTC() }

type slugAllowlist struct{}

func (slugAllowlist) IsKnown(slug string) bool { return villaslug.IsKnown(slug) }

func main() {
	cfg, err := config.Load()
	if err != nil {
		slog.Error("config load failed", "err", err.Error())
		os.Exit(1)
	}

	log := logger.New(cfg.LogLevel)
	slog.SetDefault(log)

	ctx := context.Background()
	pool, err := postgres.Open(ctx, cfg.DB.DSN())
	if err != nil {
		log.Error("postgres open failed", "err", err.Error())
		os.Exit(1)
	}
	defer pool.Close()

	if cfg.MigrateOnBoot {
		if err := postgres.MigrateUp(pool, db.Migrations, "migrations"); err != nil {
			log.Error("migrate failed", "err", err.Error())
			os.Exit(1)
		}
		log.Info("migrations applied")
	}

	mailer := email.NewMailer(cfg.ResendKey, cfg.MailFrom, cfg.AdminNotifyEmail)
	bookingSvc := booking.NewService(
		booking.NewPgRepo(pool),
		booking.NewResendMailer(mailer),
		slugAllowlist{},
		realClock{},
	)
	pricingSvc := pricing.NewService(pricing.NewPgRepo(pool), slugAllowlist{})

	r := httpserver.NewRouter(log, cfg.WebOrigin)
	openapi.Mount(r)
	booking.Mount(r, bookingSvc)
	pricing.Mount(r, pricingSvc)

	if err := httpserver.Run(r, cfg.Port, log); err != nil {
		log.Error("server crashed", "err", err.Error())
		os.Exit(1)
	}
}
