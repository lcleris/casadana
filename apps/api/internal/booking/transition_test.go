package booking

import (
	"errors"
	"testing"
	"time"
)

// documentedLifecycle is the lifecycle the API promises in
// packages/contract/src/bookings.ts (bookings.patch) and that
// tla/BookingLifecycle.tla checks as `Documented`. Keep the three in step.
var documentedLifecycle = map[[2]Status]bool{
	{StatusPending, StatusApproved}:   true,
	{StatusPending, StatusRejected}:   true,
	{StatusPending, StatusCancelled}:  true,
	{StatusApproved, StatusPaid}:      true,
	{StatusApproved, StatusCancelled}: true,
	{StatusPaid, StatusCancelled}:     true,
}

// Every (from, to) pair of the five statuses, so a pair added to or dropped
// from Booking.Transition's table fails here.
func TestTransition_FollowsDocumentedLifecycle(t *testing.T) {
	all := []Status{StatusPending, StatusApproved, StatusRejected, StatusCancelled, StatusPaid}
	now := time.Date(2026, 5, 12, 0, 0, 0, 0, time.UTC)
	for _, from := range all {
		for _, to := range all {
			got, err := Booking{Status: from}.Transition(to, now)
			want := documentedLifecycle[[2]Status{from, to}]
			switch {
			case want && err != nil:
				t.Errorf("%s -> %s: documented, but Transition returned %v", from, to, err)
			case want && (got.Status != to || !got.UpdatedAt.Equal(now)):
				t.Errorf("%s -> %s: got status %s, updated_at %v", from, to, got.Status, got.UpdatedAt)
			case !want && !errors.Is(err, ErrInvalidStatus):
				t.Errorf("%s -> %s: not documented, but Transition returned err=%v", from, to, err)
			}
		}
	}
}
