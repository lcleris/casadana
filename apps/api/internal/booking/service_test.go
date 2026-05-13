package booking

import (
	"context"
	"testing"
	"time"
)

func newSvc(repo Repository, mailer Mailer, allow VillaAllowlist, now time.Time) *Service {
	return NewService(repo, mailer, allow, fixedClock{t: now})
}

func TestCreate_Happy(t *testing.T) {
	repo := &fakeRepo{}
	mailer := &fakeMailer{}
	allow := fakeAllowlist{allowed: map[string]bool{"casadana": true}}
	svc := newSvc(repo, mailer, allow, d("2026-05-12"))

	b, err := svc.Create(context.Background(), CreateCommand{
		VillaSlug:  "casadana",
		GuestName:  "Jane",
		GuestEmail: "jane@example.com",
		GuestPhone: "+33",
		CheckIn:    d("2026-07-01"),
		CheckOut:   d("2026-07-08"),
		Adults:     2,
		Children:   0,
	})
	if err != nil {
		t.Fatalf("Create: %v", err)
	}
	if got, want := len(repo.saved), 1; got != want {
		t.Errorf("saved count = %d, want %d", got, want)
	}
	if got, want := len(mailer.confirmations), 1; got != want {
		t.Errorf("confirmations = %d, want %d", got, want)
	}
	if got, want := len(mailer.adminNotices), 1; got != want {
		t.Errorf("admin notices = %d, want %d", got, want)
	}
	if b.Status != StatusPending {
		t.Errorf("status = %s, want pending", b.Status)
	}
}

func TestCreate_UnknownVilla(t *testing.T) {
	repo := &fakeRepo{}
	svc := newSvc(repo, &fakeMailer{}, fakeAllowlist{allowed: map[string]bool{}}, d("2026-05-12"))

	_, err := svc.Create(context.Background(), CreateCommand{
		VillaSlug: "ghost-villa",
		GuestName: "X", GuestEmail: "x@example.com",
		CheckIn: d("2026-07-01"), CheckOut: d("2026-07-08"),
		Adults: 1,
	})
	if err == nil || !isErr(err, ErrUnknownVilla) {
		t.Fatalf("err = %v, want ErrUnknownVilla", err)
	}
	if len(repo.saved) != 0 {
		t.Error("repo should not have been written")
	}
}

func TestCreate_DatesConflict(t *testing.T) {
	repo := &fakeRepo{overlapping: []Booking{{ID: "x"}}}
	svc := newSvc(repo, &fakeMailer{}, fakeAllowlist{allowed: map[string]bool{"casadana": true}}, d("2026-05-12"))

	_, err := svc.Create(context.Background(), CreateCommand{
		VillaSlug: "casadana",
		GuestName: "Jane", GuestEmail: "jane@example.com",
		CheckIn: d("2026-07-01"), CheckOut: d("2026-07-08"),
		Adults: 1,
	})
	if err == nil || !isErr(err, ErrDatesConflict) {
		t.Fatalf("err = %v, want ErrDatesConflict", err)
	}
	if len(repo.saved) != 0 {
		t.Error("repo should not have been written")
	}
}

func TestCreate_MailerFailure_DoesNotFailBooking(t *testing.T) {
	repo := &fakeRepo{}
	mailer := &fakeMailer{confirmErr: errBoom}
	svc := newSvc(repo, mailer, fakeAllowlist{allowed: map[string]bool{"casadana": true}}, d("2026-05-12"))

	_, err := svc.Create(context.Background(), CreateCommand{
		VillaSlug: "casadana",
		GuestName: "Jane", GuestEmail: "jane@example.com",
		CheckIn: d("2026-07-01"), CheckOut: d("2026-07-08"),
		Adults: 1,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(repo.saved) != 1 {
		t.Error("booking should have been persisted despite mailer failure")
	}
}

// helpers
var errBoom = simpleErr("boom")

type simpleErr string

func (s simpleErr) Error() string { return string(s) }

func isErr(err, target error) bool {
	for e := err; e != nil; {
		if e == target {
			return true
		}
		type unwrap interface{ Unwrap() error }
		u, ok := e.(unwrap)
		if !ok {
			return false
		}
		e = u.Unwrap()
	}
	return false
}
