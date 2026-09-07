package email

import (
	"context"
	"fmt"
	"strings"
)

// ReviewData is the projection of a review that the owners' notification needs.
// As with BookingData, this package does not import the review domain: it knows
// how to write an email about a review, not what a review is.
type ReviewData struct {
	ID         string
	VillaName  string
	AuthorName string
	Rating     int
	Body       string
	// Source is where the review came from. Anything unrecognised leaves the
	// line off rather than printing an internal identifier at the owners.
	Source string
}

// The provenance values the review domain stores, mirrored here so the owners
// read "Formulaire du site" rather than "website".
const (
	SourceWebsite = "website"
	SourceBooking = "direct"
)

// SendOwnerNewReview tells the owners a review is waiting for moderation. It
// goes to them and to nobody else: a review carries no author address, so there
// is no acknowledgement to send and no Reply-To to set.
func (m *Mailer) SendOwnerNewReview(ctx context.Context, d ReviewData) error {
	msg, err := buildMessage(m.adminNotify, "", mailKey("review", d.ID, "owner-review"), d.ownerNewReviewContent())
	if err != nil {
		return err
	}
	return m.Send(ctx, msg)
}

// ownerNewReviewContent is written in the owners' own language whatever the
// visitor browsed in, exactly like the booking notification: this is an
// internal alert, not guest-facing copy. It repeats the review in full so the
// owners can judge it from their inbox and open the back-office only to act.
func (d ReviewData) ownerNewReviewContent() content {
	loc := DefaultLocale
	c := newContent(loc)
	c.Subject = tf(loc, "review.owner.subject", d.VillaName, d.Rating)
	c.Heading = t(loc, "review.owner.heading")
	c.Paragraphs = []string{tf(loc, "review.owner.p1", d.VillaName), t(loc, "review.owner.p2")}

	body := strings.TrimSpace(d.Body)
	if body == "" {
		body = t(loc, "review.owner.nobody")
	}
	c.Details = []detail{
		{Label: t(loc, "label.villa"), Value: d.VillaName},
		{Label: t(loc, "label.author"), Value: d.AuthorName},
		{Label: t(loc, "label.rating"), Value: stars(d.Rating)},
		{Label: t(loc, "label.review"), Value: body},
	}
	if src := d.sourceLabel(loc); src != "" {
		c.Details = append(c.Details, detail{Label: t(loc, "label.source"), Value: src})
	}
	c.Details = append(c.Details, detail{Label: t(loc, "label.ref"), Value: d.ID})

	// A review has no author address, so the usual "reply to this email" footer
	// would point nowhere. Send the owners where the action actually is.
	c.ReplyHint = t(loc, "review.owner.footer")
	return c
}

func (d ReviewData) sourceLabel(loc Locale) string {
	switch d.Source {
	case SourceWebsite:
		return t(loc, "review.source.website")
	case SourceBooking:
		return t(loc, "review.source.direct")
	default:
		return ""
	}
}

// stars renders the rating so it reads at a glance in an inbox. It is not
// localised because it does not need to be: the same five stars work in every
// language the site ships.
func stars(rating int) string {
	if rating < 0 {
		rating = 0
	}
	if rating > 5 {
		rating = 5
	}
	return fmt.Sprintf("%s%s  %d/5", strings.Repeat("★", rating), strings.Repeat("☆", 5-rating), rating)
}
