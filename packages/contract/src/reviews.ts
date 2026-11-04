import { oc } from "@orpc/contract"
import * as z from "zod"

import { apiErrors, byId, NO_SESSION, UNKNOWN_VILLA, villa } from "./shared"

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

export const reviews = {
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
      spec: apiErrors({ 401: NO_SESSION, 404: "Review not found" }, { admin: true }),
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
        { 401: NO_SESSION, 404: "Review not found", 422: "Invalid payload" },
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
}
