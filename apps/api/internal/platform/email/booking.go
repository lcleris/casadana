package email

import (
	"context"
	"fmt"
	"strings"
	"time"
)

// BookingData is the projection of a booking that the emails need. This package
// deliberately does not import the booking domain: it renders and sends
// messages, it knows nothing about the booking lifecycle.
type BookingData struct {
	ID         string
	VillaName  string
	GuestName  string
	GuestEmail string
	GuestPhone string
	CheckIn    time.Time
	CheckOut   time.Time
	Adults     int
	Children   int
	Message    string
	// OtherVillaName is the display name of the sibling property, offered to a
	// guest whose dates don't work here. Empty when there is no obvious other
	// one, in which case the mention is dropped rather than left vague.
	OtherVillaName string
	// Locale the guest browsed the site in. Empty falls back to DefaultLocale.
	Locale Locale
}

// nights counts the billed nights. Check-in and check-out are calendar dates at
// UTC midnight, so a plain hour division is exact here.
func (d BookingData) nights() int {
	n := int(d.CheckOut.Sub(d.CheckIn).Hours() / 24)
	if n < 0 {
		return 0
	}
	return n
}

func (d BookingData) locale() Locale {
	if d.Locale == "" {
		return DefaultLocale
	}
	return NormalizeLocale(string(d.Locale))
}

func (d BookingData) guestsLine(loc Locale) string {
	parts := []string{plural(loc, "guests.adult", d.Adults)}
	if d.Children > 0 {
		parts = append(parts, plural(loc, "guests.child", d.Children))
	}
	return strings.Join(parts, ", ")
}

// stayDetails is the block every guest email repeats, so a guest can check the
// dates without digging up the original request.
//
// withWindows appends the arrival and departure hours to the dates. Guest mail
// carries them — it is the one place a guest will look for them — while the
// owners' notification stays terse, since the hours are the same every time and
// tell the owners nothing.
func (d BookingData) stayDetails(loc Locale, withWindows bool) []detail {
	checkIn, checkOut := formatDate(d.CheckIn, loc), formatDate(d.CheckOut, loc)
	if withWindows {
		checkIn = fmt.Sprintf("%s · %s", checkIn, t(loc, "window.checkin"))
		checkOut = fmt.Sprintf("%s · %s", checkOut, t(loc, "window.checkout"))
	}
	return []detail{
		{Label: t(loc, "label.villa"), Value: d.VillaName},
		{Label: t(loc, "label.checkin"), Value: checkIn},
		{Label: t(loc, "label.checkout"), Value: checkOut},
		{Label: t(loc, "label.nights"), Value: fmt.Sprintf("%d", d.nights())},
		{Label: t(loc, "label.guests"), Value: d.guestsLine(loc)},
	}
}

// The content builders below are pure: they turn a booking into the copy of one
// email and touch nothing else, which is what makes every email in this package
// assertable without a network round-trip.

func (d BookingData) receivedContent() content {
	loc := d.locale()
	c := newContent(loc)
	c.Subject = tf(loc, "received.subject", d.VillaName)
	c.Heading = t(loc, "received.heading")
	c.Greeting = tf(loc, "greeting", d.GuestName)
	// The first two paragraphs announce the recap, so they sit above the table;
	// everything that follows from it sits below.
	c.Paragraphs = []string{tf(loc, "received.p1", d.VillaName), t(loc, "received.p2")}
	c.Details = d.stayDetails(loc, true)
	c.Closing = []string{t(loc, "received.p3"), t(loc, "received.p4")}
	c.Note = t(loc, "received.note")
	return c
}

func (d BookingData) approvedContent() content {
	loc := d.locale()
	c := newContent(loc)
	c.Subject = tf(loc, "approved.subject", d.VillaName)
	c.Heading = t(loc, "approved.heading")
	c.Greeting = tf(loc, "greeting", d.GuestName)
	c.Paragraphs = []string{
		tf(loc, "approved.p1", d.VillaName, formatDate(d.CheckIn, loc), formatDate(d.CheckOut, loc)),
	}
	c.Details = d.stayDetails(loc, true)
	c.ChecklistsIntro = t(loc, "approved.p2")
	// Spain requires a record of every traveller, so an approval is also the
	// email that collects them — asked for as a list the guest can tick off.
	c.Checklists = []checklist{
		{Title: t(loc, "approved.list.booker.title"), Items: tlist(loc, "approved.list.booker.items")},
		{Title: t(loc, "approved.list.guests.title"), Items: tlist(loc, "approved.list.guests.items")},
	}
	c.Closing = []string{
		t(loc, "approved.p3"),
		t(loc, "approved.p4"),
		t(loc, "approved.p5"),
		t(loc, "approved.p6"),
	}
	c.Note = t(loc, "approved.note")
	return c
}

func (d BookingData) rejectedContent() content {
	loc := d.locale()
	c := newContent(loc)
	c.Subject = tf(loc, "rejected.subject", d.VillaName)
	c.Heading = t(loc, "rejected.heading")
	c.Greeting = tf(loc, "greeting", d.GuestName)
	// A refusal is the one email that names the other property: the dates are
	// what fell through, not the stay, and the sibling is often free.
	elsewhere := t(loc, "rejected.p3.nosibling")
	if d.OtherVillaName != "" {
		elsewhere = tf(loc, "rejected.p3", d.OtherVillaName)
	}
	c.Paragraphs = []string{
		tf(loc, "rejected.p1", d.VillaName),
		tf(loc, "rejected.p2", formatDate(d.CheckIn, loc), formatDate(d.CheckOut, loc)),
		elsewhere,
		t(loc, "rejected.p4"),
	}
	return c
}

func (d BookingData) cancelledContent() content {
	loc := d.locale()
	c := newContent(loc)
	c.Subject = tf(loc, "cancelled.subject", d.VillaName)
	c.Heading = t(loc, "cancelled.heading")
	c.Greeting = tf(loc, "greeting", d.GuestName)
	c.Paragraphs = []string{
		tf(loc, "cancelled.p1", d.VillaName, formatDate(d.CheckIn, loc), formatDate(d.CheckOut, loc)),
		t(loc, "cancelled.p2"),
	}
	c.Details = d.stayDetails(loc, true)
	return c
}

// ownerContent is always written in the owners' own language, whatever locale
// the guest browsed in, and repeats the guest's contact details so the owners
// can act on the request straight from their inbox.
func (d BookingData) ownerContent() content {
	loc := DefaultLocale
	c := newContent(loc)
	c.Subject = tf(loc, "owner.subject", d.VillaName, formatDate(d.CheckIn, loc), formatDate(d.CheckOut, loc))
	c.Heading = t(loc, "owner.heading")
	c.Paragraphs = []string{t(loc, "owner.p1"), t(loc, "owner.p2")}

	message := strings.TrimSpace(d.Message)
	if message == "" {
		message = t(loc, "owner.nomessage")
	}
	c.Details = append(d.stayDetails(loc, false),
		detail{Label: t(loc, "label.name"), Value: d.GuestName},
		detail{Label: t(loc, "label.email"), Value: d.GuestEmail},
		detail{Label: t(loc, "label.phone"), Value: d.GuestPhone},
		detail{Label: t(loc, "label.message"), Value: message},
		detail{Label: t(loc, "label.ref"), Value: d.ID},
	)
	return c
}

// SendGuestRequestReceived acknowledges a freshly submitted request.
func (m *Mailer) SendGuestRequestReceived(ctx context.Context, d BookingData) error {
	return m.sendGuest(ctx, d, "received", d.receivedContent())
}

// SendGuestApproved accepts the request and opens the contract stage: it asks
// the guest for the traveller details the contract needs. The dates are only
// held for good once the deposit arrives, which the email says in as many words.
func (m *Mailer) SendGuestApproved(ctx context.Context, d BookingData) error {
	return m.sendGuest(ctx, d, "approved", d.approvedContent())
}

// SendGuestRejected declines a request without leaving the guest waiting.
func (m *Mailer) SendGuestRejected(ctx context.Context, d BookingData) error {
	return m.sendGuest(ctx, d, "rejected", d.rejectedContent())
}

// SendGuestCancelled confirms a cancellation, whoever triggered it.
func (m *Mailer) SendGuestCancelled(ctx context.Context, d BookingData) error {
	return m.sendGuest(ctx, d, "cancelled", d.cancelledContent())
}

// SendOwnerNewRequest notifies the owners that a request is waiting.
func (m *Mailer) SendOwnerNewRequest(ctx context.Context, d BookingData) error {
	// Reply-To is the guest, so answering the notification answers the guest.
	msg, err := buildMessage(m.adminNotify, d.GuestEmail, mailKey("booking", d.ID, "owner-request"), d.ownerContent())
	if err != nil {
		return err
	}
	return m.Send(ctx, msg)
}

// sendGuest addresses the guest and points Reply-To at the owners, so a guest
// replying to any of these emails reaches a human.
func (m *Mailer) sendGuest(ctx context.Context, d BookingData, kind string, c content) error {
	msg, err := buildMessage(d.GuestEmail, m.adminNotify, mailKey("booking", d.ID, kind), c)
	if err != nil {
		return err
	}
	return m.Send(ctx, msg)
}

// buildMessage renders the layout into a sendable message. Callers pass an
// idempotency key built with mailKey, so retrying the same notification can
// never deliver it twice.
func buildMessage(to, replyTo, idempotencyKey string, c content) (Message, error) {
	if len(c.Paragraphs) > 0 {
		c.Preheader = c.Paragraphs[0]
	}
	html, text, err := c.render()
	if err != nil {
		return Message{}, err
	}
	return Message{
		To:             to,
		ReplyTo:        replyTo,
		Subject:        c.Subject,
		HTML:           html,
		Text:           text,
		IdempotencyKey: idempotencyKey,
	}, nil
}

// mailKey identifies one notification: the thing it is about, and which of that
// thing's emails it is. Two different scopes can share an id without colliding.
func mailKey(scope, id, kind string) string {
	return fmt.Sprintf("%s/%s/%s", scope, id, kind)
}
