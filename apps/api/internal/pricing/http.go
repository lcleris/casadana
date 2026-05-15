package pricing

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"

	"github.com/TheHikuro/casadana/internal/platform/httpserver"
)

func init() {
	httpserver.Register(ErrUnknownVilla, http.StatusNotFound, "UNKNOWN_VILLA")
	httpserver.Register(ErrInvalidRange, http.StatusUnprocessableEntity, "INVALID_RANGE")
}

func Mount(r chi.Router, svc *Service) {
	r.Get("/api/villas/{slug}/pricing", listHandler(svc))
}

type priceOverrideDTO struct {
	Date       string `json:"date"`
	PriceCents int    `json:"price_cents"`
}

type pricingResponse struct {
	Overrides []priceOverrideDTO `json:"overrides"`
}

func listHandler(svc *Service) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		slug := chi.URLParam(r, "slug")
		from, errFrom := time.Parse("2006-01-02", r.URL.Query().Get("from"))
		to, errTo := time.Parse("2006-01-02", r.URL.Query().Get("to"))
		if errFrom != nil || errTo != nil {
			httpserver.WriteError(w, r, &httpserver.ValidationError{
				Message: "from and to must be YYYY-MM-DD",
			})
			return
		}

		overrides, err := svc.ListOverrides(r.Context(), slug, from, to)
		if err != nil {
			httpserver.WriteError(w, r, err)
			return
		}

		resp := pricingResponse{Overrides: make([]priceOverrideDTO, 0, len(overrides))}
		for _, o := range overrides {
			resp.Overrides = append(resp.Overrides, priceOverrideDTO{
				Date:       o.Date.Format("2006-01-02"),
				PriceCents: o.PriceCents,
			})
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(resp)
	}
}
