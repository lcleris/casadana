package email

import (
	"strings"
	"testing"
)

func sampleReview() ReviewData {
	return ReviewData{
		ID:         "r-1234",
		VillaName:  "Casa DaNa",
		AuthorName: "Jane Doe",
		Rating:     4,
		Body:       "Maison superbe, accueil parfait.",
		Source:     SourceWebsite,
	}
}

// The owners act on this email without opening anything else, so it has to
// carry the review itself: who wrote it, the score, and the words.
func TestOwnerNewReviewContent_CarriesTheReview(t *testing.T) {
	d := sampleReview()
	c := d.ownerNewReviewContent()

	if c.Subject == "" {
		t.Error("empty subject")
	}
	if !strings.Contains(c.Subject, d.VillaName) {
		t.Errorf("subject %q does not name the villa", c.Subject)
	}
	if !strings.Contains(c.Subject, "4/5") {
		t.Errorf("subject %q does not carry the rating", c.Subject)
	}
	if c.Heading == "" || len(c.Paragraphs) == 0 {
		t.Error("missing heading or body copy")
	}
	// Nothing the owners read may be an unfilled placeholder.
	for _, s := range append([]string{c.Subject, c.Heading}, c.Paragraphs...) {
		if strings.Contains(s, "%!") || strings.Contains(s, "%s") || strings.Contains(s, "%d") {
			t.Errorf("unfilled placeholder in %q", s)
		}
	}

	values := detailValues(c)
	for _, want := range []string{d.AuthorName, d.Body, d.ID} {
		if !values[want] {
			t.Errorf("details do not carry %q", want)
		}
	}
}

// The notification is an internal alert: it is written in the owners' language
// and points at the back-office rather than offering a reply that would reach
// nobody.
func TestOwnerNewReviewContent_IsOwnerFacing(t *testing.T) {
	c := sampleReview().ownerNewReviewContent()

	if c.Locale != DefaultLocale {
		t.Errorf("Locale = %q, want %q", c.Locale, DefaultLocale)
	}
	if c.Greeting != "" {
		t.Errorf("Greeting = %q, want none: this email addresses the owners, not a guest", c.Greeting)
	}
	if c.ReplyHint == fr("footer.reply") {
		t.Error("footer still invites a reply, but a review carries no author address")
	}
	if c.ReplyHint == "" {
		t.Error("empty footer hint")
	}
}

// A bare star with no words behind it still has to render as something a reader
// understands, not as an empty row.
func TestOwnerNewReviewContent_EmptyBody(t *testing.T) {
	d := sampleReview()
	d.Body = "   "

	if got := detailValues(d.ownerNewReviewContent()); !got[fr("review.owner.nobody")] {
		t.Error("an empty review body did not fall back to the placeholder copy")
	}
}

// Provenance is shown by its label or not at all: "website" is an internal
// value and has no business appearing in the owners' inbox.
func TestOwnerNewReviewContent_Source(t *testing.T) {
	tests := map[string]string{
		SourceWebsite: fr("review.source.website"),
		SourceBooking: fr("review.source.direct"),
		"":            "",
		"nonsense":    "",
	}
	for source, want := range tests {
		d := sampleReview()
		d.Source = source
		values := detailValues(d.ownerNewReviewContent())

		if want == "" {
			if values[source] {
				t.Errorf("source %q leaked into the email verbatim", source)
			}
			continue
		}
		if !values[want] {
			t.Errorf("source %q did not render as %q", source, want)
		}
	}
}

func TestStars(t *testing.T) {
	tests := map[int]string{
		5:  "★★★★★  5/5",
		4:  "★★★★☆  4/5",
		1:  "★☆☆☆☆  1/5",
		0:  "☆☆☆☆☆  0/5",
		9:  "★★★★★  5/5",
		-1: "☆☆☆☆☆  0/5",
	}
	for rating, want := range tests {
		if got := stars(rating); got != want {
			t.Errorf("stars(%d) = %q, want %q", rating, got, want)
		}
	}
}

// A review and a booking can never collapse into one delivery, and neither can
// two notifications about the same review.
func TestReviewMessage_AddressingAndIdempotency(t *testing.T) {
	d := sampleReview()
	const owner = "hosts@casa-dana.com"

	msg, err := buildMessage(owner, "", mailKey("review", d.ID, "owner-review"), d.ownerNewReviewContent())
	if err != nil {
		t.Fatalf("buildMessage: %v", err)
	}
	if msg.To != owner {
		t.Errorf("To = %q, want %q", msg.To, owner)
	}
	if msg.ReplyTo != "" {
		t.Errorf("ReplyTo = %q, want none", msg.ReplyTo)
	}
	if msg.IdempotencyKey != "review/r-1234/owner-review" {
		t.Errorf("idempotency key = %q", msg.IdempotencyKey)
	}
	if msg.IdempotencyKey == mailKey("booking", d.ID, "owner-review") {
		t.Error("a review and a booking sharing an id share an idempotency key")
	}
	if msg.HTML == "" || msg.Text == "" {
		t.Fatalf("missing part: html=%d bytes text=%d bytes", len(msg.HTML), len(msg.Text))
	}
}

// A visitor called `<script>` is a visitor, not markup — and this email is the
// one place unmoderated text reaches a reader.
func TestReviewMessage_EscapesVisitorText(t *testing.T) {
	d := sampleReview()
	d.AuthorName = `Jane <script>alert("x")</script>`
	d.Body = `<img src=x onerror=alert(1)>`

	msg, err := buildMessage("hosts@casa-dana.com", "", mailKey("review", d.ID, "owner-review"), d.ownerNewReviewContent())
	if err != nil {
		t.Fatalf("buildMessage: %v", err)
	}
	// The escaped text still reads "onerror=", which is harmless; what must not
	// appear is a tag the browser would act on.
	if strings.Contains(msg.HTML, "<script>") || strings.Contains(msg.HTML, "<img") {
		t.Error("visitor-supplied text was injected into the HTML unescaped")
	}
	if !strings.Contains(msg.HTML, "&lt;script&gt;") {
		t.Error("visitor-supplied text was not escaped into the HTML part")
	}
}

func detailValues(c content) map[string]bool {
	out := make(map[string]bool, len(c.Details))
	for _, d := range c.Details {
		out[d.Value] = true
	}
	return out
}

// fr reads the owners' own copy out of the catalog. Named rather than called
// inline because the catalog's own lookup is `t`, which every test here has
// already bound to *testing.T.
func fr(key string) string { return t(DefaultLocale, key) }
