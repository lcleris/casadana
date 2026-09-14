// Package villaslug is the authoritative allowlist of villa slugs the API
// will accept. It mirrors apps/web/src/constants/villas.const.ts and must be
// updated manually when a villa is added or removed from the frontend.
package villaslug

var known = map[string]struct{}{
	"casadana":  {},
	"casacasay": {},
}

func IsKnown(slug string) bool {
	_, ok := known[slug]
	return ok
}

// displayNames are the villa names as guests know them, for anywhere a slug
// would otherwise leak into something a guest reads (emails, above all).
var displayNames = map[string]string{
	"casadana":  "Casa DaNa",
	"casacasay": "Casa CasAy",
}

// DisplayName returns the guest-facing name of a villa, falling back to the
// slug itself so an unmapped villa degrades to something readable rather than
// to an empty string.
func DisplayName(slug string) string {
	if name, ok := displayNames[slug]; ok {
		return name
	}
	return slug
}

func All() []string {
	out := make([]string, 0, len(known))
	for s := range known {
		out = append(out, s)
	}
	return out
}

// sibling pairs the two properties: when one can't take a request, the other
// is the first thing worth offering. Written out rather than derived from
// known, so adding a third villa surfaces here as a decision to make instead
// of silently naming an arbitrary one.
var sibling = map[string]string{
	"casadana":  "casacasay",
	"casacasay": "casadana",
}

// OtherDisplayName returns the guest-facing name of the other property, or an
// empty string when the slug has no single obvious counterpart. Callers are
// expected to drop the mention entirely rather than print a placeholder.
func OtherDisplayName(slug string) string {
	other, ok := sibling[slug]
	if !ok {
		return ""
	}
	return DisplayName(other)
}
