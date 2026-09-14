package villaslug

import "testing"

func TestIsKnown(t *testing.T) {
	cases := []struct {
		slug string
		want bool
	}{
		{"casadana", true},
		{"casacasay", true},
		{"unknown-villa", false},
		{"casa-dana", false},
		{"", false},
	}
	for _, c := range cases {
		if got := IsKnown(c.slug); got != c.want {
			t.Errorf("IsKnown(%q) = %v, want %v", c.slug, got, c.want)
		}
	}
}

// A refusal email offers the other property by name. Returning the same villa,
// or a slug, would be worse than saying nothing at all.
func TestOtherDisplayName(t *testing.T) {
	cases := map[string]string{
		"casadana":      "Casa CasAy",
		"casacasay":     "Casa DaNa",
		"unknown-villa": "",
		"":              "",
	}
	for slug, want := range cases {
		if got := OtherDisplayName(slug); got != want {
			t.Errorf("OtherDisplayName(%q) = %q, want %q", slug, got, want)
		}
	}
}

// sibling and known must stay in step: a villa added to the allowlist without a
// counterpart silently drops the offer out of every refusal email.
func TestSibling_CoversEveryKnownVilla(t *testing.T) {
	for _, slug := range All() {
		if OtherDisplayName(slug) == "" {
			t.Errorf("villa %q has no sibling to offer in a refusal", slug)
		}
	}
}
