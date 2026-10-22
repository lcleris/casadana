package contractapi

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/go-chi/chi/v5"
)

type fake struct {
	Unimplemented
	gotList   ListBookingsRequestObject
	gotCreate CreateBookingRequestObject
}

func (f *fake) GetHealth(context.Context, GetHealthRequestObject) (GetHealthResponseObject, error) {
	return GetHealth200JSONResponse{Status: "ok"}, nil
}
func (f *fake) AdminLogin(context.Context, AdminLoginRequestObject) (AdminLoginResponseObject, error) {
	return AdminLogin200JSONResponse{}, nil
}
func (f *fake) AdminMe(context.Context, AdminMeRequestObject) (AdminMeResponseObject, error) {
	return AdminMe200JSONResponse{}, nil
}
func (f *fake) ListBookings(_ context.Context, r ListBookingsRequestObject) (ListBookingsResponseObject, error) {
	f.gotList = r
	return ListBookings200JSONResponse{Bookings: []BookingResponse{}, Page: 2, Limit: 20}, nil
}
func (f *fake) CreateBooking(_ context.Context, r CreateBookingRequestObject) (CreateBookingResponseObject, error) {
	f.gotCreate = r
	return CreateBooking201JSONResponse{Status: "pending", VillaSlug: r.Body.VillaSlug, GuestEmail: r.Body.GuestEmail}, nil
}

func TestGeneratedRouterBindsTheContract(t *testing.T) {
	f := &fake{}
	r := chi.NewRouter()
	HandlerFromMux(NewStrictHandler(f, nil), r)

	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/api/bookings?status=pending&page=2", nil))
	if rec.Code != http.StatusOK || f.gotList.Params.Status == nil || *f.gotList.Params.Status != "pending" || *f.gotList.Params.Page != 2 {
		t.Fatalf("list: code=%d params=%+v body=%s", rec.Code, f.gotList.Params, rec.Body)
	}

	body := `{"villa_slug":"casadana","guest_name":"Jane","guest_email":"jane@example.com","guest_phone":"+33123","check_in":"2026-07-04","check_out":"2026-07-11","adults":2}`
	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, httptest.NewRequest(http.MethodPost, "/api/bookings", strings.NewReader(body)))
	if rec.Code != http.StatusCreated || f.gotCreate.Body.CheckIn.String() != "2026-07-04" {
		t.Fatalf("create: code=%d body=%s", rec.Code, rec.Body)
	}

	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/api/bookings?status=bogus", nil))
	t.Logf("invalid enum -> %d %s", rec.Code, strings.TrimSpace(rec.Body.String()))
}
