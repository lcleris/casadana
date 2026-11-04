-------------------------- MODULE BookingLifecycle --------------------------
(*
Model of booking.Service.Create and booking.Service.TransitionStatus
(apps/api/internal/booking/service.go) running against Postgres.

One action per SQL statement. booking/postgres.go runs every query straight on
the pool, with no transaction and no row lock, so Postgres commits each
statement on its own and another request can run between any two of them.

Each worker is one HTTP request in flight: POST /api/bookings or
PATCH /api/bookings/{id}. Workers = 1 means requests never overlap in time.
*)
EXTENDS Naturals, Sequences

CONSTANTS Workers, MaxRequests

(* Three stays: R1 and R2 overlap, R2 and R3 overlap, R1 ends the day R3
   starts, which the half-open check treats as free. *)
Ranges == { [in |-> 1, out |-> 3], [in |-> 2, out |-> 4], [in |-> 3, out |-> 5] }

(* db/queries/bookings.sql: check_in < $3 AND check_out > $2 *)
Overlap(a, b) == a.in < b.out /\ b.in < a.out

Live      == {"pending", "approved", "paid"}   \* FindOverlappingBookings
Confirmed == {"approved", "paid"}              \* FindOverlappingConfirmedBookings

(* booking/http.go patchBookingRequest: validate oneof=approved rejected cancelled paid *)
Targets == {"approved", "rejected", "cancelled", "paid"}

(* booking/domain.go Booking.Transition, the `allowed` map. Mirror it here. *)
CodeAllowed ==
  { <<"pending", "approved">>, <<"pending", "rejected">>, <<"pending", "cancelled">>,
    <<"approved", "paid">>, <<"approved", "cancelled">>,
    <<"paid", "cancelled">> }

(* The lifecycle the API promises (packages/contract/src/bookings.ts,
   bookings.patch description). Written separately from CodeAllowed on
   purpose: it is the property, CodeAllowed is the implementation. *)
Documented ==
  { <<"pending", "approved">>, <<"pending", "rejected">>, <<"pending", "cancelled">>,
    <<"approved", "paid">>, <<"approved", "cancelled">>,
    <<"paid", "cancelled">> }

VARIABLES
  db,      \* the bookings table: db[id] = [range, status]
  pc,      \* pc[w]: the statement worker w runs next
  req,     \* req[w]: the request worker w is serving
  issued   \* requests started so far, bounded by MaxRequests

vars == <<db, pc, req, issued>>
W == 1..Workers
Ids == 1..Len(db)

Init ==
  /\ db = <<>>
  /\ pc = [w \in W |-> "idle"]
  /\ req = [w \in W |-> [kind |-> "none"]]
  /\ issued = 0

Finish(w) == pc' = [pc EXCEPT ![w] = "idle"]
Goto(w, l) == pc' = [pc EXCEPT ![w] = l]

StartCreate(w) ==
  /\ pc[w] = "idle" /\ issued < MaxRequests
  /\ \E r \in Ranges :
       req' = [req EXCEPT ![w] = [kind |-> "create", range |-> r]]
  /\ issued' = issued + 1
  /\ Goto(w, "create_find") /\ UNCHANGED db

StartTransition(w) ==
  /\ pc[w] = "idle" /\ issued < MaxRequests
  /\ \E id \in Ids, next \in Targets :
       req' = [req EXCEPT ![w] = [kind |-> "transition", id |-> id, next |-> next]]
  /\ issued' = issued + 1
  /\ Goto(w, "transition_get") /\ UNCHANGED db

(* Service.Create: s.repo.FindOverlapping, 409 DATES_CONFLICT on any hit. *)
CreateFind(w) ==
  /\ pc[w] = "create_find"
  /\ IF \E i \in Ids : db[i].status \in Live /\ Overlap(db[i].range, req[w].range)
       THEN Finish(w)
       ELSE Goto(w, "create_save")
  /\ UNCHANGED <<db, req, issued>>

(* Service.Create: s.repo.Save inserts the booking as pending. *)
CreateSave(w) ==
  /\ pc[w] = "create_save"
  /\ db' = Append(db, [range |-> req[w].range, status |-> "pending"])
  /\ Finish(w) /\ UNCHANGED <<req, issued>>

(* Service.TransitionStatus: s.repo.Get, then current.Transition on the status
   it read. 409 INVALID_STATUS when the pair is not allowed. *)
TransitionGet(w) ==
  /\ pc[w] = "transition_get"
  /\ LET cur == db[req[w].id].status IN
       IF <<cur, req[w].next>> \notin CodeAllowed THEN Finish(w)
       ELSE IF req[w].next = "approved" THEN Goto(w, "transition_check")
       ELSE Goto(w, "transition_update")
  /\ UNCHANGED <<db, req, issued>>

(* Service.TransitionStatus, approve only: s.repo.FindOverlappingConfirmed,
   409 DATES_CONFLICT on any other approved or paid booking that overlaps. *)
TransitionCheck(w) ==
  /\ pc[w] = "transition_check"
  /\ LET id == req[w].id IN
       IF \E i \in Ids \ {id} : db[i].status \in Confirmed /\ Overlap(db[i].range, db[id].range)
         THEN Finish(w)
         ELSE Goto(w, "transition_update")
  /\ UNCHANGED <<db, req, issued>>

(* Service.TransitionStatus: s.repo.UpdateStatus. UpdateBookingStatus is
   `SET status = $2 WHERE id = $1`, whatever the row's status is now. *)
TransitionUpdate(w) ==
  /\ pc[w] = "transition_update"
  /\ db' = [db EXCEPT ![req[w].id].status = req[w].next]
  /\ Finish(w) /\ UNCHANGED <<req, issued>>

Next ==
  \E w \in W :
    \/ StartCreate(w) \/ StartTransition(w)
    \/ CreateFind(w) \/ CreateSave(w)
    \/ TransitionGet(w) \/ TransitionCheck(w) \/ TransitionUpdate(w)

Spec == Init /\ [][Next]_vars

(* No double booking: two approved or paid stays of the villa never share a night. *)
NoConfirmedOverlap ==
  \A i, j \in Ids :
    (i # j /\ db[i].status \in Confirmed /\ db[j].status \in Confirmed)
      => ~Overlap(db[i].range, db[j].range)

(* Every status change a booking goes through is one the API documents. *)
LifecycleRespected ==
  [][\A i \in Ids : db'[i].status # db[i].status => <<db[i].status, db'[i].status>> \in Documented]_db
=============================================================================
