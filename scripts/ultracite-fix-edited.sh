#!/usr/bin/env bash
# Claude Code PostToolUse hook: format and auto-fix the file an agent just wrote.
# Runs from the repo root so oxlint picks up oxlint-suppressions.json. Findings
# the fix cannot clear go to stderr with exit 2, which Claude reads and fixes.
set -uo pipefail

file=$(jq -r '.tool_input.file_path // empty')
[[ -z "$file" || ! -f "$file" ]] && exit 0
case "$file" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs | *.json | *.jsonc | *.css) ;;
  *) exit 0 ;;
esac

root=$(git -C "$(dirname "$file")" rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$root" || exit 0
file=$(realpath "$file")

out=$(bunx ultracite fix "${file#"$root"/}" 2>&1)
# Ignored paths (generated code, the Go API) come back as "no files": nothing to report.
if [[ $? -ne 0 ]] && ! grep -qE "No files found|Expected at least one target file" <<<"$out"; then
  echo "$out" >&2
  exit 2
fi
exit 0
