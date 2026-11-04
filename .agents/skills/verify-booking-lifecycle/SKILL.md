---
name: verify-booking-lifecycle
description: Model-check the booking lifecycle (no double booking, only documented status changes) with TLA+, and run the exhaustive Go test of Booking.Transition. Use when a change touches booking creation, status transitions, the bookings SQL queries or migrations, or the bookings.patch lifecycle in the contract.
---

# Verify the booking lifecycle

Two promises the booking code makes to the owners and their guests:

1. **No double booking.** Two approved or paid bookings of a villa never share a night. If they did, two guests would be confirmed for the same stay.
2. **Only documented status changes.** A booking moves `pending → approved | rejected | cancelled`, `approved → paid | cancelled`, `paid → cancelled`, and nothing else. Otherwise a guest told "cancelled" could end up approved, or get two contradictory emails.

Two checks guard them:

- `apps/api/internal/booking/tla/BookingLifecycle.tla` is a TLA+ model of `Service.Create` and `Service.TransitionStatus`. TLC explores every order in which requests can interleave, one SQL statement at a time.
- `apps/api/internal/booking/transition_test.go` runs the real `Booking.Transition` on all 25 (from, to) status pairs and compares the result with the documented lifecycle. That covers every input the function can get.

## Does my change touch this?

Run the drift command. Any output means the change touches covered code:

```sh
git diff --stat 99e7343 HEAD -- \
  apps/api/internal/booking/service.go apps/api/internal/booking/domain.go \
  apps/api/internal/booking/postgres.go apps/api/internal/booking/http.go \
  apps/api/internal/db/queries/bookings.sql apps/api/internal/db/migrations \
  packages/contract/src/bookings.ts
```

`99e7343` is the sync commit, the last commit at which the model was confirmed to describe the code. Your working tree counts too, so also look at `git diff` for those paths.

## Run it

From the repo root. TLC needs Java 11 or later, and the script downloads `tla2tools.jar` v1.7.4 once to `~/.cache/tla` and checks its sha256.

```sh
cpuq apps/api/internal/booking/tla/run.sh       # all three configs; or name one: run.sh Sequential
cd apps/api && cpuq go test ./internal/booking -run TestTransition_FollowsDocumentedLifecycle
```

TLC writes its full output, counterexample included, to `$TMPDIR/tlc-booking-<config>.log`. `run.sh` prints the part from the violation on.

## Expected results at the sync commit

| Config | Requests in flight | Checks | Expected |
|---|---|---|---|
| `Sequential.cfg` | 1, up to 6 requests | both properties | passes, 13679 distinct states |
| `ConcurrentOverlap.cfg` | 2, up to 4 requests | no double booking | **fails, known finding F1** |
| `ConcurrentLifecycle.cfg` | 2, up to 3 requests | lifecycle | **fails, known finding F2** |

`run.sh` exits 1 while F1 and F2 stand. Read the counterexample and compare it with the findings below. A new failure, or a `Sequential` failure, is a regression.

**F1, double booking under concurrency.** Two guests post overlapping stays at the same moment. Both `FindOverlapping` calls run before either `Save`, so both rows are inserted `pending`. Two admins then approve them at the same moment. Both `FindOverlappingConfirmed` calls run before either `UpdateStatus`, so both bookings end up `approved` for the same nights. The counterexample ends with two `approved` rows whose ranges overlap.

**F2, lost status update.** Two status changes on one booking at the same moment (two admins, or one double submit). Both `Get` calls read `pending`, both pass `Transition`, and the second `UpdateStatus` overwrites the first, because `UpdateBookingStatus` is `WHERE id = $1` with no check on the current status. The counterexample ends with a status change such as `cancelled → rejected`. The guest gets both emails.

The fix for both is in the database. One option is an exclusion constraint on `(villa_slug, daterange(check_in, check_out))` for approved and paid rows. Another is running the check and the write in one transaction that locks the row (`SELECT … FOR UPDATE`). Add `AND status = <status read>` to `UpdateBookingStatus` as well. Once a fix lands, change the model the same way (see below), and the concurrent configs should pass. Then remove the finding from this table.

## What the model covers

Each action in the model is one statement in the code. Keep it that way: an action must never do the work of two statements that Postgres commits separately.

| Model | Code |
|---|---|
| `CreateFind` | `Service.Create` → `pgRepo.FindOverlapping` → `FindOverlappingBookings` (statuses pending, approved, paid) |
| `CreateSave` | `Service.Create` → `pgRepo.Save` → `InsertBooking`, status `pending` |
| `TransitionGet` | `Service.TransitionStatus` → `pgRepo.Get`, then `Booking.Transition` on the status read |
| `TransitionCheck` | `Service.TransitionStatus`, only when `next == StatusApproved` → `FindOverlappingConfirmed` (approved, paid, `id != $4`) |
| `TransitionUpdate` | `Service.TransitionStatus` → `pgRepo.UpdateStatus` → `UpdateBookingStatus` |
| `CodeAllowed` | the `allowed` map in `Booking.Transition` (`domain.go`) |
| `Documented` | the `bookings.patch` description in `packages/contract/src/bookings.ts` |
| `Targets` | `patchBookingRequest` `validate:"oneof=approved rejected cancelled paid"` (`http.go`) |
| `Overlap` | `check_in < $3 AND check_out > $2` (half-open: a stay may start the day another ends) |

**Bounds and assumptions.** One villa, since every query filters on `villa_slug` and villas never interact. Three ranges: two pairs that overlap and one pair that only touches. At most 2 requests in flight and 3 to 6 requests in total. Every statement runs on its own: `postgres.go` uses the pool with no transaction. The default READ COMMITTED isolation adds nothing that one-statement steps don't already allow.

**Not covered.** `Service.Delete`, emails (`notifyTransition` and the `Create` mails), `List` and `Availability` reads, input validation in `NewBooking`, pricing, and anything with three or more requests in flight.

## Real bug or modeling error?

- Trace each step of the counterexample to the code row in the table above. If every step is something the code really does, it is a real bug. Report it with the steps in the code's words, as in F1 and F2. Do not weaken a property or the model to make it pass, and do not change product code unless the user asks.
- If a step does something the code cannot do, the model is wrong. Fix the model, and say what was wrong. An example is an action that ignores a `WHERE` clause or merges two statements.
- If `run.sh` fails before checking (parse error, Java missing), that is a tooling problem, not a result.

## When the change is intended

1. Update the action or table for each code row you changed, and only those. If you add a statement, add an action. If you wrap statements in a transaction with row locks, merge the steps it makes atomic into one action. A change to the `allowed` map goes in `CodeAllowed`. Leave `Documented` alone unless the promised lifecycle changes too (step 2). The model only requests transitions to `Targets`, the statuses `PATCH /api/bookings/{id}` accepts. So a new pair into a status outside `Targets`, such as `cancelled → pending`, cannot be reached through the API, and `Sequential` still passes. The Go test is what catches it, because it checks the `allowed` map on its own.
2. If the documented lifecycle changes, update `Documented` in the `.tla`, `documentedLifecycle` in `transition_test.go`, and the `bookings.patch` description together.
3. Show the check can still fail. Break the code on purpose, for example by adding `StatusCancelled: {StatusApproved: true}` to `Booking.Transition`. Mirror the break in `CodeAllowed`, and confirm that both `Sequential` and the Go test fail. Then revert both. Removing only one of the two overlap checks does not make `Sequential` fail: when requests never overlap in time, the creation check already rejects any stay that overlaps a pending one, so the two checks back each other up. That gap only matters with concurrent requests, where F1 already fails.
4. Rerun everything, update the expected table above, then move the sync commit in the drift command to the commit that contains your change. Move it only after you have confirmed that the model describes the code at that commit.
