package review

import (
	"context"

	"github.com/TheHikuro/casadana/internal/platform/email"
	"github.com/TheHikuro/casadana/internal/villaslug"
)

// ResendMailer adapts the review domain onto the transactional email package.
// The copy, the layout and the localisation all live in that package; this type
// only projects a Review onto what the notification needs — which is why no
// HTML appears anywhere in this file.
type ResendMailer struct {
	inner *email.Mailer
}

func NewResendMailer(m *email.Mailer) Mailer { return &ResendMailer{inner: m} }

func (r *ResendMailer) SendOwnerNewReview(ctx context.Context, rv *Review) error {
	return r.inner.SendOwnerNewReview(ctx, email.ReviewData{
		ID: rv.ID,
		// By display name, never by slug: "casadana" is an internal identifier
		// and has no business appearing in something a person reads.
		VillaName:  villaslug.DisplayName(rv.VillaSlug),
		AuthorName: rv.AuthorName,
		Rating:     rv.Rating,
		Body:       rv.Body,
		Source:     rv.Source,
	})
}
