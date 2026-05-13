package booking

import (
	"context"
	"fmt"
	"html"

	"github.com/TheHikuro/casadana/internal/platform/email"
)

type ResendMailer struct {
	inner *email.Mailer
}

func NewResendMailer(m *email.Mailer) Mailer { return &ResendMailer{inner: m} }

func (r *ResendMailer) SendBookingConfirmation(ctx context.Context, b *Booking) error {
	return r.inner.Send(ctx, email.Message{
		To:      b.GuestEmail,
		Subject: "Your Casa Dana booking request",
		HTML: fmt.Sprintf(
			`<p>Hi %s,</p><p>We received your booking request for <b>%s</b> from %s to %s. We'll be in touch shortly.</p>`,
			html.EscapeString(b.GuestName), html.EscapeString(b.VillaSlug),
			b.CheckIn.Format("2006-01-02"), b.CheckOut.Format("2006-01-02"),
		),
	})
}

func (r *ResendMailer) SendAdminNotification(ctx context.Context, b *Booking) error {
	return r.inner.Send(ctx, email.Message{
		To:      r.inner.AdminNotifyAddress(),
		Subject: fmt.Sprintf("New booking request — %s", b.VillaSlug),
		HTML: fmt.Sprintf(
			`<p>New booking request for <b>%s</b></p>
<ul>
  <li>Guest: %s &lt;%s&gt; %s</li>
  <li>Dates: %s → %s</li>
  <li>Guests: %d adults, %d children</li>
  <li>Message: %s</li>
</ul>`,
			html.EscapeString(b.VillaSlug),
			html.EscapeString(b.GuestName), html.EscapeString(b.GuestEmail), html.EscapeString(b.GuestPhone),
			b.CheckIn.Format("2006-01-02"), b.CheckOut.Format("2006-01-02"),
			b.Adults, b.Children,
			html.EscapeString(b.Message),
		),
	})
}
