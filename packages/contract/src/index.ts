import { oc } from "@orpc/contract"
import * as z from "zod"

export const HealthResponse = z.object({ status: z.literal("ok") })

export const BookingStatus = z.enum(["pending", "approved", "rejected", "cancelled", "paid"])
export const BookingSource = z.enum(["direct", "airbnb", "booking_com"])

export const CreateBookingRequest = z.object({
  adults: z.int().min(1).max(20),
  check_in: z.iso.date(),
  check_out: z.iso.date().describe("Must be strictly after check_in."),
  children: z.int().min(0).max(20).default(0).optional(),
  guest_email: z.email().max(255),
  guest_name: z.string().min(1).max(120),
  guest_phone: z.string().min(2).max(40),
  locale: z
    .enum(["fr", "en", "es"])
    .optional()
    .describe("Language of every email about this booking. Falls back to fr."),
  message: z.string().max(2000).default("").optional(),
  source: BookingSource.optional(),
  villa_slug: z.string().min(1).max(64),
})

export const BookingResponse = z.object({
  adults: z.int().optional(),
  check_in: z.iso.date(),
  check_out: z.iso.date(),
  children: z.int().optional(),
  created_at: z.iso.datetime({ offset: true }),
  guest_email: z.email(),
  guest_name: z.string(),
  id: z.uuid(),
  source: BookingSource.optional(),
  status: BookingStatus,
  villa_slug: z.string(),
})

export const ListBookingsResponse = z.object({
  bookings: z.array(BookingResponse),
  limit: z.int(),
  page: z.int(),
  total: z.int(),
})

export const AdminLoginRequest = z.object({ email: z.email(), password: z.string() })

export const AdminUser = z.object({
  created_at: z.iso.datetime({ offset: true }).optional(),
  email: z.email().optional(),
  id: z.uuid().optional(),
})

/** Every non-2xx response from the Go API carries this body. */
export const ErrorResponse = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
})

export const contract = {
  admin: {
    login: oc
      .route({
        method: "POST",
        operationId: "adminLogin",
        path: "/api/admin/login",
        tags: ["admin"],
      })
      .input(AdminLoginRequest)
      .output(AdminUser),
    me: oc
      .route({ method: "GET", operationId: "adminMe", path: "/api/admin/me", tags: ["admin"] })
      .output(AdminUser),
  },
  bookings: {
    create: oc
      .route({
        method: "POST",
        operationId: "createBooking",
        path: "/api/bookings",
        successStatus: 201,
        tags: ["bookings"],
      })
      .input(CreateBookingRequest)
      .output(BookingResponse),
    list: oc
      .route({
        method: "GET",
        operationId: "listBookings",
        path: "/api/bookings",
        tags: ["bookings"],
      })
      .input(
        z.object({
          limit: z.int().min(1).max(100).default(20).optional(),
          page: z.int().min(1).default(1).optional(),
          // Inline copy: a $ref'd query param is emitted as style=deepObject,
          // which oapi-codegen cannot bind from `?status=pending`.
          status: z.enum(BookingStatus.options).optional(),
          villa_slug: z.string().optional(),
        }),
      )
      .output(ListBookingsResponse),
  },
  health: {
    get: oc
      .route({ method: "GET", operationId: "getHealth", path: "/api/health", tags: ["health"] })
      .output(HealthResponse),
  },
}
