# Casa Dana — every agent starts here

Booking site and back-office for the Casa Dana villas. One set of rules for
every coding agent: Claude Code loads this file through `CLAUDE.md`, any other
agent (Codex, Cursor, Copilot, Gemini, …) opens it directly.

## Read before writing

1. `CONTRIBUTING.md`: the code conventions for the web app and the Go API.
2. `docs/adr/`: decisions that are expensive to rediscover. Same-origin API
   routing (ADR 0003) and deploys owned by GitHub Actions (ADR 0004) are the
   ones most changes touch.
3. `docs/runbooks/`: step-by-step operations (deploys, environments, the v1
   data import).

## Layout

| Path | What lives there |
|---|---|
| `apps/web` | React 19 + Vite + TanStack Router/Query, paraglide i18n (fr, en, es) |
| `apps/api` | Go API: chi, pgx, sqlc, golang-migrate |
| `apps/api/internal/openapi/openapi.yaml` | The hand-written API spec, served at `/api/docs` |
| `packages/api` | orval client generated from that spec |

## Commands

- Backend: `make backend` (api + postgres in docker), front: `make front`.
- Web gates: `bun run check` (oxfmt, oxlint, tsc), `bun run test`,
  `bun run dead-code:ci`, `bun run fallow:audit`.
- API gates, from `apps/api`: `go vet -tags integration ./...` and
  `go test -tags integration ./...` (the integration suites start Postgres
  with testcontainers).
- Regenerate the orval client: `bun run --cwd packages/api generate`.

## Generated files: never edit by hand

`apps/web/src/routeTree.gen.ts`, `apps/web/src/paraglide/`,
`packages/api/src/generated/` and `apps/api/internal/db/*.sql.go` (sqlc).

## Lint and format: Ultracite (oxlint + oxfmt)

- After every file you write, run `bunx ultracite fix <file>` from the repo
  root. Claude Code does it from a hook (`scripts/ultracite-fix-edited.sh`).
- Existing oxlint findings are frozen in `oxlint-suppressions.json`. New
  code adds no rows: fix the finding. fallow has no baseline.

## Branches and environments

`develop` deploys to demo (demo.casa-dana.com), `main` to prod
(www.casa-dana.com). Open PRs against `develop`, test on demo, then promote.

## Skills

Skills live in `.agents/skills/<name>/SKILL.md`, pinned in `skills-lock.json`
(`bunx skills experimental_install` restores them). `.claude/skills` is a
symlink to that directory. Update with `bunx skills update -p`, never by
editing the vendored files.

The knowledge graph is local: `graphify update .` writes `graphify-out/`
(gitignored, scoped by `.graphifyignore`).

## Agent skills

### Issue tracker

Issues live in GitHub Issues on lcleris/casadana, through the `gh` CLI. See
`docs/agents/issue-tracker.md`.

### Triage labels

The five default roles: `needs-triage`, `needs-info`, `ready-for-agent`,
`ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` at the root and `docs/adr/`. See
`docs/agents/domain.md`.
