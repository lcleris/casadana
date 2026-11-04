import { admin } from "./admin"
import { availability, bookings } from "./bookings"
import { health } from "./health"
import { history } from "./history"
import { pricing } from "./pricing"
import { reviews } from "./reviews"

export const contract = {
  admin,
  bookings,
  health,
  history,
  pricing,
  reviews,
  villas: { availability },
}
