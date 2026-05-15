package booking

import (
	"context"
	"fmt"
	"log/slog"
	"time"
)

type Service struct {
	repo   Repository
	mailer Mailer
	allow  VillaAllowlist
	clock  Clock
}

func NewService(repo Repository, mailer Mailer, allow VillaAllowlist, clock Clock) *Service {
	return &Service{repo: repo, mailer: mailer, allow: allow, clock: clock}
}

type CreateCommand struct {
	VillaSlug  string
	GuestName  string
	GuestEmail string
	GuestPhone string
	CheckIn    time.Time
	CheckOut   time.Time
	Adults     int
	Children   int
	Message    string
}

func (s *Service) Create(ctx context.Context, cmd CreateCommand) (*Booking, error) {
	if !s.allow.IsKnown(cmd.VillaSlug) {
		return nil, ErrUnknownVilla
	}

	overlapping, err := s.repo.FindOverlapping(ctx, cmd.VillaSlug, cmd.CheckIn, cmd.CheckOut)
	if err != nil {
		return nil, fmt.Errorf("booking: check overlap: %w", err)
	}
	if len(overlapping) > 0 {
		return nil, ErrDatesConflict
	}

	b, err := NewBooking(NewBookingInput{
		VillaSlug:  cmd.VillaSlug,
		GuestName:  cmd.GuestName,
		GuestEmail: cmd.GuestEmail,
		GuestPhone: cmd.GuestPhone,
		CheckIn:    cmd.CheckIn,
		CheckOut:   cmd.CheckOut,
		Adults:     cmd.Adults,
		Children:   cmd.Children,
		Message:    cmd.Message,
		Now:        s.clock.Now(),
	})
	if err != nil {
		return nil, err
	}

	if err := s.repo.Save(ctx, b); err != nil {
		return nil, fmt.Errorf("booking: save: %w", err)
	}

	// Best-effort emails: a transient mail failure must not lose the booking.
	if err := s.mailer.SendBookingConfirmation(ctx, b); err != nil {
		slog.WarnContext(ctx, "booking confirmation email failed", "booking_id", b.ID, "err", err.Error())
	}
	if err := s.mailer.SendAdminNotification(ctx, b); err != nil {
		slog.WarnContext(ctx, "admin notification email failed", "booking_id", b.ID, "err", err.Error())
	}

	return b, nil
}

func (s *Service) Availability(ctx context.Context, villaSlug string, from, to time.Time) ([]DateRange, error) {
	if !s.allow.IsKnown(villaSlug) {
		return nil, ErrUnknownVilla
	}
	if !to.After(from) {
		return nil, fmt.Errorf("booking: 'to' must be after 'from'")
	}
	return s.repo.BookedRanges(ctx, villaSlug, from, to)
}

// TransitionStatus moves a booking through its lifecycle (pending → approved /
// rejected / cancelled / paid). The state machine is enforced by the domain
// helper Booking.Transition; the service handles persistence.
func (s *Service) TransitionStatus(ctx context.Context, id string, next Status) (*Booking, error) {
	current, err := s.repo.Get(ctx, id)
	if err != nil {
		return nil, err
	}
	transitioned, err := current.Transition(next, s.clock.Now())
	if err != nil {
		return nil, err
	}
	if err := s.repo.UpdateStatus(ctx, id, transitioned.Status, transitioned.UpdatedAt); err != nil {
		return nil, fmt.Errorf("booking: update status: %w", err)
	}
	return &transitioned, nil
}
