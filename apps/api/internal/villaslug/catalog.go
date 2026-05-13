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

func All() []string {
	out := make([]string, 0, len(known))
	for s := range known {
		out = append(out, s)
	}
	return out
}
