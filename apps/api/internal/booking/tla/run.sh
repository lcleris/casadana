#!/usr/bin/env bash
# Model-check BookingLifecycle.tla. Usage: run.sh [config name without .cfg]... (default: all three)
# With no argument, runs both. Needs Java 11+.
set -euo pipefail
cd "$(dirname "$0")"

version=1.7.4
sha=936a262061c914694dfd669a543be24573c45d5aa0ff20a8b96b23d01e050e88
jar="${XDG_CACHE_HOME:-$HOME/.cache}/tla/tla2tools-$version.jar"
if [[ ! -f "$jar" ]]; then
  mkdir -p "$(dirname "$jar")"
  curl -sSfL -o "$jar" "https://github.com/tlaplus/tlaplus/releases/download/v$version/tla2tools.jar"
fi
echo "$sha  $jar" | shasum -a 256 -c --quiet

status=0
for config in "${@:-Sequential ConcurrentOverlap ConcurrentLifecycle}"; do
  for c in $config; do
    echo "== $c"
    if java -XX:+UseParallelGC -cp "$jar" tlc2.TLC -deadlock -workers auto -cleanup \
      -metadir "${TMPDIR:-/tmp}/tlc-booking-$c" -config "$c.cfg" BookingLifecycle.tla >"${TMPDIR:-/tmp}/tlc-booking-$c.log" 2>&1; then
      grep -E "states generated|No error has been found" "${TMPDIR:-/tmp}/tlc-booking-$c.log"
    else
      status=1
      sed -n '/is violated/,/states generated/p' "${TMPDIR:-/tmp}/tlc-booking-$c.log"
    fi
  done
done
exit $status
