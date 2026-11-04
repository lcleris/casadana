import { oc } from "@orpc/contract"
import type { Route } from "@orpc/contract"
import * as z from "zod"

const MAX_CENTS = 100_000_000

export const HealthResponseSchema = z.object({ status: z.literal("ok") })

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

export const PriceOverrideSchema = z.object({
  date: z.iso.date(),
  price_cents: z.int().min(0).describe("Price in EUR cents (e.g. 9500 = 95.00€)."),
})

export const NightlyPriceSchema = z.object({
  date: z.iso.date(),
  label: z
    .string()
    .describe(
      "Where the price came from: a season rule's own name, `Custom` for a per-date override, or `Standard` for the villa's base rate.",
    ),
  price_cents: z.int().min(0).describe("Effective price in EUR cents for that night."),
})

export const PricingResponseSchema = z.object({
  nights: z
    .array(NightlyPriceSchema)
    .describe("One entry per day in the requested window, in date order."),
  overrides: z.array(PriceOverrideSchema),
})

export const UpsertPricingRequestSchema = z.object({
  dates: z.array(z.iso.date()).min(1),
  price_cents: z.int().min(0),
})

export const UpsertPricingResponseSchema = z.object({ count: z.int() })

export const PricingSettingsSchema = z
  .object({
    base_price_cents: z.int().min(0),
    cleaning_fee_cents: z.int().min(0),
    concierge_fee_cents: z.int().min(0),
    min_nights: z.int().min(1).max(365),
  })
  .describe(
    "Base rate and fees, applied whenever no season rule or per-date override matches. A villa never configured reads back as all-zero rather than 404.",
  )
export type PricingSettings = z.infer<typeof PricingSettingsSchema>

export const PutPricingSettingsRequestSchema = z.object({
  base_price_cents: z.int().min(0).max(MAX_CENTS),
  cleaning_fee_cents: z.int().min(0).max(MAX_CENTS),
  concierge_fee_cents: z.int().min(0).max(MAX_CENTS),
  min_nights: z.int().min(1).max(365),
})

export const SeasonRuleSchema = z
  .object({
    end_date: z.iso.date(),
    id: z.uuid(),
    label: z.string().min(1).max(120),
    price_cents: z.int().min(0),
    start_date: z.iso.date(),
    villa_slug: z.string(),
  })
  .describe(
    "A named, inclusive date range with its own nightly price. When several rules cover the same night the highest-priced one wins.",
  )
export type SeasonRule = z.infer<typeof SeasonRuleSchema>

export const ListSeasonRulesResponseSchema = z.object({ rules: z.array(SeasonRuleSchema) })

export const CreateSeasonRuleRequestSchema = z.object({
  end_date: z.iso.date(),
  label: z.string().min(1).max(120),
  price_cents: z.int().min(0).max(MAX_CENTS),
  start_date: z.iso.date(),
})

export const PatchSeasonRuleRequestSchema = CreateSeasonRuleRequestSchema.partial().describe(
  "Every field is optional; an omitted field is left unchanged.",
)
export type PatchSeasonRuleRequest = z.infer<typeof PatchSeasonRuleRequestSchema>

export const ReviewStatusSchema = z.enum(["pending", "approved", "rejected"])
export type ReviewStatus = z.infer<typeof ReviewStatusSchema>

const score = z.number().min(1).max(5).nullable()

export const ReviewCategoryRatingsSchema = z
  .object({
    cleanliness: score.optional(),
    comfort: score.optional(),
    host: score.optional(),
    location: score.optional(),
    value: score.optional(),
  })
  .describe(
    "Per-category scores for one review. A null means the reviewer did not score that category, which keeps it out of the villa's average rather than pulling it down with a zero.",
  )
export type ReviewCategoryRatings = z.infer<typeof ReviewCategoryRatingsSchema>

export const ReviewSchema = z.object({
  author_name: z.string(),
  body: z.string(),
  booking_id: z
    .uuid()
    .nullable()
    .describe("Null for admin-authored reviews, which have no booking behind them."),
  categories: ReviewCategoryRatingsSchema.optional(),
  created_at: z.iso.datetime({ offset: true }),
  featured: z.boolean().describe("Pinned to the top of the public reviews section."),
  id: z.uuid(),
  meta: z.string().describe("Free-text context line shown under the author name."),
  rating: z.int().min(1).max(5),
  source: z.string().describe("Where the review came from."),
  status: ReviewStatusSchema,
  villa_slug: z.string(),
})
export type Review = z.infer<typeof ReviewSchema>

export const ListReviewsResponseSchema = z.object({ reviews: z.array(ReviewSchema) })

export const CreateAdminReviewRequestSchema = z.object({
  author_name: z.string().min(1).max(120),
  body: z.string().max(2000).default("").optional(),
  categories: ReviewCategoryRatingsSchema.optional(),
  featured: z.boolean().default(false).optional(),
  meta: z.string().max(2000).default("").optional(),
  rating: z.int().min(1).max(5),
  source: z.string().max(64).default("").optional(),
  status: ReviewStatusSchema.optional(),
  villa_slug: z.string().min(1).max(64),
})

export const PatchReviewRequestSchema = z
  .object({
    body: z.string().max(2000),
    categories: ReviewCategoryRatingsSchema,
    featured: z.boolean(),
    meta: z.string().max(2000),
    rating: z.int().min(1).max(5),
    source: z.string().max(64),
    status: ReviewStatusSchema,
  })
  .partial()
  .describe("Every field is optional; an omitted field is left unchanged.")

export const ReviewBreakdownSchema = z
  .object({
    cleanliness: score,
    comfort: score,
    host: score,
    location: score,
    value: score,
  })
  .describe(
    "Per-category averages over the villa's approved reviews. A null means no approved review has scored that category yet.",
  )
export type ReviewBreakdown = z.infer<typeof ReviewBreakdownSchema>

export const ReviewMetaSchema = z
  .object({
    breakdown: ReviewBreakdownSchema,
    display_avg: z.number().min(0).max(5),
    display_count: z.int().min(0),
  })
  .describe(
    "The villa's published rating, computed from its approved reviews; nothing here is hand-entered. `display_avg` is 0 when there is no approved review: read `display_count` to tell that apart from a genuine average.",
  )
export type ReviewMeta = z.infer<typeof ReviewMetaSchema>

export const SubmitReviewRequestSchema = z.object({
  author_name: z.string().min(1).max(120),
  body: z.string().max(2000).default("").optional(),
  booking_id: z.uuid(),
  rating: z.int().min(1).max(5),
})

export const SubmitVillaReviewRequestSchema = z
  .object({
    author_name: z.string().min(1).max(120),
    body: z.string().min(1).max(2000),
    categories: ReviewCategoryRatingsSchema.optional(),
    rating: z.int().min(1).max(5),
  })
  .describe(
    "What the villa-page form may set, and nothing else: `status`, `featured` and `source` are absent, the review is always stored as `pending`.",
  )

export const HistoryEventTypeSchema = z.enum([
  "reservation",
  "pricing",
  "review",
  "owner",
  "system",
])
export type HistoryEventType = z.infer<typeof HistoryEventTypeSchema>

export const HistoryEventSchema = z.object({
  actor_email: z
    .string()
    .describe("Email of the admin who made the change; empty when unattributed."),
  created_at: z.iso.datetime({ offset: true }),
  id: z.uuid(),
  message: z.string(),
  type: HistoryEventTypeSchema,
  villa_slug: z.string(),
})
export type HistoryEvent = z.infer<typeof HistoryEventSchema>

export const ListHistoryResponseSchema = z.object({
  events: z.array(HistoryEventSchema),
  limit: z.int(),
  page: z.int(),
  total: z.int(),
})

export const AdminLoginRequestSchema = z.object({ email: z.email(), password: z.string() })

export const AdminUserSchema = z.object({
  created_at: z.iso.datetime({ offset: true }).optional(),
  email: z.email().optional(),
  id: z.uuid().optional(),
})
export type AdminUser = z.infer<typeof AdminUserSchema>

export const ListAdminUsersResponseSchema = z.object({ users: z.array(AdminUserSchema).optional() })

export const CreateAdminUserRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

/** Every non-2xx response from the Go API carries this body. */
export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z
      .string()
      .describe(
        "Machine-readable error code, such as DATES_CONFLICT, UNKNOWN_VILLA, VALIDATION, INVALID_STATUS, EMAIL_TAKEN or INTERNAL.",
      ),
    message: z.string(),
  }),
})

type Operation = Exclude<NonNullable<Route["spec"]>, (...args: never) => unknown>

const errorBody = {
  content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
}

function apiErrors(errors: Record<number, string>, { admin = false } = {}): Route["spec"] {
  return (operation: Operation) => ({
    ...operation,
    ...(admin && { security: [{ adminSession: [] }] }),
    responses: {
      ...operation.responses,
      ...Object.fromEntries(
        Object.entries({ ...errors, 500: "Internal server error" }).map(([status, description]) => [
          status,
          { description, ...errorBody },
        ]),
      ),
    },
  })
}

const NO_SESSION = "Missing or invalid admin session"
const UNKNOWN_VILLA = "Villa slug not in allowlist"
const villa = { slug: z.string() }
const byId = { id: z.uuid() }
const dateWindow = {
  from: z.iso.date().describe("Window start (inclusive)."),
  to: z.iso.date().describe("Window end (exclusive)."),
}
const pagination = {
  limit: z.int().min(1).max(100).default(20).optional(),
  page: z.int().min(1).default(1).optional(),
}

export const contract = {
  admin: {
    createUser: oc
      .route({
        method: "POST",
        operationId: "createAdminUser",
        path: "/api/admin/users",
        spec: apiErrors({ 409: "Email already registered" }, { admin: true }),
        successStatus: 201,
        summary: "Create a new admin user",
        tags: ["admin"],
      })
      .input(CreateAdminUserRequestSchema)
      .output(AdminUserSchema),
    deleteUser: oc
      .route({
        method: "DELETE",
        operationId: "deleteAdminUser",
        path: "/api/admin/users/{id}",
        spec: apiErrors(
          { 404: "Admin user not found", 409: "Cannot delete your own admin account" },
          { admin: true },
        ),
        successStatus: 204,
        summary: "Delete an admin user",
        tags: ["admin"],
      })
      .input(z.object(byId)),
    listUsers: oc
      .route({
        method: "GET",
        operationId: "listAdminUsers",
        path: "/api/admin/users",
        spec: apiErrors({ 401: NO_SESSION }, { admin: true }),
        summary: "List all admin users",
        tags: ["admin"],
      })
      .output(ListAdminUsersResponseSchema),
    login: oc
      .route({
        method: "POST",
        operationId: "adminLogin",
        path: "/api/admin/login",
        spec: apiErrors({ 401: "Invalid email or password" }),
        summary: "Admin login",
        tags: ["admin"],
      })
      .input(AdminLoginRequestSchema)
      .output(AdminUserSchema),
    logout: oc.route({
      method: "POST",
      operationId: "adminLogout",
      path: "/api/admin/logout",
      successStatus: 204,
      summary: "Admin logout",
      tags: ["admin"],
    }),
    me: oc
      .route({
        method: "GET",
        operationId: "adminMe",
        path: "/api/admin/me",
        spec: apiErrors({ 401: "Not authenticated" }, { admin: true }),
        summary: "Get the current admin user",
        tags: ["admin"],
      })
      .output(AdminUserSchema),
  },
  bookings: {
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
  },
  health: {
    get: oc
      .route({
        method: "GET",
        operationId: "getHealth",
        path: "/api/health",
        summary: "Liveness probe",
        tags: ["health"],
      })
      .output(HealthResponseSchema),
  },
  history: {
    list: oc
      .route({
        description:
          "Append-only record of every change made through the admin dashboard, most recent first.",
        method: "GET",
        operationId: "listAdminHistory",
        path: "/api/admin/history",
        spec: apiErrors({ 401: NO_SESSION, 422: "Missing or unknown villa_slug" }, { admin: true }),
        summary: "Paginated activity log for a villa",
        tags: ["history"],
      })
      .input(z.object({ ...pagination, villa_slug: z.string() }))
      .output(ListHistoryResponseSchema),
  },
  pricing: {
    createSeasonRule: oc
      .route({
        method: "POST",
        operationId: "createVillaSeasonRule",
        path: "/api/villas/{slug}/pricing/season-rules",
        spec: apiErrors(
          {
            401: NO_SESSION,
            404: UNKNOWN_VILLA,
            422: "Invalid payload or end_date before start_date",
          },
          { admin: true },
        ),
        successStatus: 201,
        summary: "Add a season rule",
        tags: ["pricing"],
      })
      .input(CreateSeasonRuleRequestSchema.extend(villa))
      .output(SeasonRuleSchema),
    deleteSeasonRule: oc
      .route({
        method: "DELETE",
        operationId: "deleteSeasonRule",
        path: "/api/pricing/season-rules/{id}",
        spec: apiErrors({ 401: NO_SESSION, 404: "Season rule not found" }, { admin: true }),
        successStatus: 204,
        summary: "Remove a season rule",
        tags: ["pricing"],
      })
      .input(z.object(byId)),
    get: oc
      .route({
        description:
          "One entry in `nights` per day of the [from, to) window: a per-date override wins over any season rule, the most expensive rule wins when several overlap, and the rest falls back to the base rate. `overrides` lists the raw per-date overrides. The window is capped at 400 days.",
        method: "GET",
        operationId: "getVillaPricing",
        path: "/api/villas/{slug}/pricing",
        spec: apiErrors({ 404: UNKNOWN_VILLA, 422: "Invalid query params or invalid range" }),
        summary: "Get the resolved nightly prices for a villa within a date window",
        tags: ["pricing"],
      })
      .input(z.object({ ...villa, ...dateWindow }))
      .output(PricingResponseSchema),
    getSettings: oc
      .route({
        method: "GET",
        operationId: "getVillaPricingSettings",
        path: "/api/villas/{slug}/pricing/settings",
        spec: apiErrors({ 404: UNKNOWN_VILLA }),
        summary: "Base rate and fees for a villa",
        tags: ["pricing"],
      })
      .input(z.object(villa))
      .output(PricingSettingsSchema),
    listSeasonRules: oc
      .route({
        method: "GET",
        operationId: "listVillaSeasonRules",
        path: "/api/villas/{slug}/pricing/season-rules",
        spec: apiErrors({ 404: UNKNOWN_VILLA }),
        summary: "List season rules for a villa, earliest start first",
        tags: ["pricing"],
      })
      .input(z.object(villa))
      .output(ListSeasonRulesResponseSchema),
    patchSeasonRule: oc
      .route({
        method: "PATCH",
        operationId: "patchSeasonRule",
        path: "/api/pricing/season-rules/{id}",
        spec: apiErrors(
          {
            401: NO_SESSION,
            404: "Season rule not found",
            422: "Invalid payload or end_date before start_date",
          },
          { admin: true },
        ),
        summary: "Update a season rule",
        tags: ["pricing"],
      })
      .input(PatchSeasonRuleRequestSchema.extend(byId))
      .output(SeasonRuleSchema),
    putSettings: oc
      .route({
        method: "PUT",
        operationId: "putVillaPricingSettings",
        path: "/api/villas/{slug}/pricing/settings",
        spec: apiErrors(
          { 401: NO_SESSION, 404: UNKNOWN_VILLA, 422: "Invalid payload" },
          { admin: true },
        ),
        summary: "Replace base rate and fees",
        tags: ["pricing"],
      })
      .input(PutPricingSettingsRequestSchema.extend(villa))
      .output(PricingSettingsSchema),
    upsert: oc
      .route({
        description:
          "Sets `price_cents` on every date in the body, replacing existing overrides. All dates in one request share the same price.",
        method: "POST",
        operationId: "upsertVillaPricing",
        path: "/api/villas/{slug}/pricing",
        spec: apiErrors({ 404: UNKNOWN_VILLA, 422: "Invalid payload" }, { admin: true }),
        successStatus: 201,
        summary: "Bulk upsert price overrides for a villa",
        tags: ["pricing"],
      })
      .input(UpsertPricingRequestSchema.extend(villa))
      .output(UpsertPricingResponseSchema),
  },
  reviews: {
    createAdmin: oc
      .route({
        description:
          "For testimonials collected outside the booking flow. Guest reviews still go through `POST /api/reviews`.",
        method: "POST",
        operationId: "createAdminReview",
        path: "/api/admin/reviews",
        spec: apiErrors({ 401: NO_SESSION, 422: "Invalid payload" }, { admin: true }),
        successStatus: 201,
        summary: "Create a review without a booking",
        tags: ["reviews"],
      })
      .input(CreateAdminReviewRequestSchema)
      .output(ReviewSchema),
    delete: oc
      .route({
        method: "DELETE",
        operationId: "deleteReview",
        path: "/api/reviews/{id}",
        spec: apiErrors({ 401: NO_SESSION, 404: "ReviewSchema not found" }, { admin: true }),
        successStatus: 204,
        summary: "Hard delete a review",
        tags: ["reviews"],
      })
      .input(z.object(byId)),
    listAdmin: oc
      .route({
        description: "Unlike the public list, this returns every status.",
        method: "GET",
        operationId: "listAdminReviews",
        path: "/api/admin/reviews",
        spec: apiErrors({ 401: NO_SESSION, 422: "Missing or unknown villa_slug" }, { admin: true }),
        summary: "List reviews for moderation",
        tags: ["reviews"],
      })
      .input(
        z.object({
          // Inline copy, same deepObject reason as bookings.list.
          status: z
            .enum(ReviewStatusSchema.options)
            .optional()
            .describe("Omit to return all statuses."),
          villa_slug: z.string(),
        }),
      )
      .output(ListReviewsResponseSchema),
    listVilla: oc
      .route({
        description: "Only `approved` reviews. The admin list shows pending and rejected ones.",
        method: "GET",
        operationId: "listVillaReviews",
        path: "/api/villas/{slug}/reviews",
        spec: apiErrors({}),
        summary: "List published reviews for a villa",
        tags: ["reviews"],
      })
      .input(z.object(villa))
      .output(ListReviewsResponseSchema),
    meta: oc
      .route({
        description:
          "Computed from the villa's approved reviews. The figures move when a review is added, moderated or removed, never by being set.",
        method: "GET",
        operationId: "getVillaReviewMeta",
        path: "/api/villas/{slug}/reviews/meta",
        spec: apiErrors({ 404: UNKNOWN_VILLA }),
        summary: "Published rating figures for a villa",
        tags: ["reviews"],
      })
      .input(z.object(villa))
      .output(ReviewMetaSchema),
    patch: oc
      .route({
        description: "Partial update of status, featured flag, or editorial fields.",
        method: "PATCH",
        operationId: "patchReview",
        path: "/api/reviews/{id}",
        spec: apiErrors(
          { 401: NO_SESSION, 404: "ReviewSchema not found", 422: "Invalid payload" },
          { admin: true },
        ),
        summary: "Moderate a review",
        tags: ["reviews"],
      })
      .input(PatchReviewRequestSchema.extend(byId))
      .output(ReviewSchema),
    submit: oc
      .route({
        method: "POST",
        operationId: "submitReview",
        path: "/api/reviews",
        spec: apiErrors({
          404: "Booking not found",
          409: "A review already exists for this booking",
          422: "Validation error",
        }),
        successStatus: 201,
        summary: "Submit a review for a booking",
        tags: ["reviews"],
      })
      .input(SubmitReviewRequestSchema)
      .output(ReviewSchema),
    submitVilla: oc
      .route({
        description:
          "For a visitor with no booking of ours. Always created `pending`: it shows in neither the public list nor the meta figures until an admin approves it. The only rate-limited route, as the one unauthenticated write.",
        method: "POST",
        operationId: "submitVillaReview",
        path: "/api/villas/{slug}/reviews",
        spec: apiErrors({
          404: UNKNOWN_VILLA,
          422: "Validation error",
          429: "Too many submissions from this caller",
        }),
        successStatus: 201,
        summary: "Leave a review on a villa from its public page",
        tags: ["reviews"],
      })
      .input(SubmitVillaReviewRequestSchema.extend(villa))
      .output(ReviewSchema),
  },
  villas: {
    availability: oc
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
      .output(AvailabilityResponseSchema),
  },
}
