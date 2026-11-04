import { oc } from "@orpc/contract"
import * as z from "zod"

import { apiErrors, byId, dateWindow, pagination, UNKNOWN_VILLA, villa } from "./shared"

export const BookingStatusSchema = z.enum(["pending", "approved", "rejected", "cancelled", "paid"])
export type BookingStatus = z.infer<typeof BookingStatusSchema>
export const BookingSourceSchema = z.enum(["direct", "airbnb", "booking_com"])
export type BookingSource = z.infer<typeof BookingSourceSchema>

export const CreateBookingRequestSchema = z.object({
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
    .describe(
      "Language of every email about this booking, including later ones (approval, refusal, cancellation). Falls back to fr.",
    ),
  message: z.string().max(2000).default("").optional(),
  source: BookingSourceSchema.optional(),
  villa_slug: z.string().min(1).max(64),
})

export const BookingResponseSchema = z.object({
  adults: z.int().optional(),
  check_in: z.iso.date(),
  check_out: z.iso.date(),
  children: z.int().optional(),
  created_at: z.iso.datetime({ offset: true }),
  guest_email: z.email(),
  guest_name: z.string(),
  id: z.uuid(),
  source: BookingSourceSchema.optional(),
  status: BookingStatusSchema,
  villa_slug: z.string(),
})
export type BookingResponse = z.infer<typeof BookingResponseSchema>

export const ListBookingsResponseSchema = z.object({
  bookings: z.array(BookingResponseSchema),
  limit: z.int(),
  page: z.int(),
  total: z.int(),
})

export const PatchBookingRequestSchema = z.object({
  status: z
    .enum(["approved", "rejected", "cancelled", "paid"])
    .describe("Target status for the transition."),
})
export type PatchBookingRequest = z.infer<typeof PatchBookingRequestSchema>

export const BookedRangeSchema = z.object({ check_in: z.iso.date(), check_out: z.iso.date() })

export const AvailabilityResponseSchema = z.object({
  booked_ranges: z.array(BookedRangeSchema),
  pending_ranges: z.array(BookedRangeSchema),
})

export const bookings = {
  create: oc
    .route({
      description:
        "Creates a `pending` booking and emails a confirmation to the guest and a notification to the admin.",
      method: "POST",
      operationId: "createBooking",
      path: "/api/bookings",
      spec: apiErrors({
        404: UNKNOWN_VILLA,
        409: "Dates conflict with an existing booking",
        422: "Validation error",
      }),
      successStatus: 201,
      summary: "Submit a booking request",
      tags: ["bookings"],
    })
    .input(CreateBookingRequestSchema)
    .output(BookingResponseSchema),
  delete: oc
    .route({
      method: "DELETE",
      operationId: "deleteBooking",
      path: "/api/bookings/{id}",
      spec: apiErrors({ 404: "Booking not found" }, { admin: true }),
      successStatus: 204,
      summary: "Hard delete a booking (cascades to its review)",
      tags: ["bookings"],
    })
    .input(z.object(byId)),
  list: oc
    .route({
      method: "GET",
      operationId: "listBookings",
      path: "/api/bookings",
      spec: apiErrors({ 422: "Invalid query params" }, { admin: true }),
      summary: "List bookings (paginated, optional status filter)",
      tags: ["bookings"],
    })
    .input(
      z.object({
        ...pagination,
        // Inline copy: a $ref'd query param is emitted as style=deepObject,
        // which oapi-codegen cannot bind from `?status=pending`.
        status: z.enum(BookingStatusSchema.options).optional(),
        villa_slug: z.string().optional(),
      }),
    )
    .output(ListBookingsResponseSchema),
  patch: oc
    .route({
      description:
        "Moves a booking through its lifecycle: `pending → approved | rejected | cancelled`, `approved → paid | cancelled`, `paid → cancelled`. An invalid transition is a 409 `INVALID_STATUS`.",
      method: "PATCH",
      operationId: "patchBooking",
      path: "/api/bookings/{id}",
      spec: apiErrors(
        {
          404: "Booking not found",
          409: "Invalid status transition",
          422: "Validation error",
        },
        { admin: true },
      ),
      summary: "Transition a booking's status",
      tags: ["bookings"],
    })
    .input(PatchBookingRequestSchema.extend(byId))
    .output(BookingResponseSchema),
}

export const availability = oc
  .route({
    description:
      "Ranges within the [from, to) window: `booked_ranges` are approved or paid (hard blocked), `pending_ranges` await confirmation (a new request overlapping them would conflict).",
    method: "GET",
    operationId: "getVillaAvailability",
    path: "/api/villas/{slug}/availability",
    spec: apiErrors({ 404: UNKNOWN_VILLA, 422: "Invalid query params" }),
    summary: "Get booked date ranges for a villa",
    tags: ["bookings"],
  })
  .input(z.object({ ...villa, ...dateWindow }))
  .output(AvailabilityResponseSchema)
