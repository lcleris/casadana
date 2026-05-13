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
