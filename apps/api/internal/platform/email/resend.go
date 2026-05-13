package email

import (
	"context"
	"fmt"

	"github.com/resend/resend-go/v2"
)

type Mailer struct {
	client      *resend.Client
	from        string
	adminNotify string
}

func NewMailer(apiKey, from, adminNotify string) *Mailer {
	return &Mailer{
		client:      resend.NewClient(apiKey),
		from:        from,
		adminNotify: adminNotify,
	}
}

type Message struct {
	To      string
	Subject string
	HTML    string
}

func (m *Mailer) Send(ctx context.Context, msg Message) error {
	if m == nil || m.client == nil {
		return fmt.Errorf("email: mailer not configured")
	}
	_, err := m.client.Emails.SendWithContext(ctx, &resend.SendEmailRequest{
		From:    m.from,
		To:      []string{msg.To},
		Subject: msg.Subject,
		Html:    msg.HTML,
	})
	if err != nil {
		return fmt.Errorf("email: send: %w", err)
	}
	return nil
}

func (m *Mailer) AdminNotifyAddress() string { return m.adminNotify }
