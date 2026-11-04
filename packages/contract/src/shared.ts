import type { Route } from "@orpc/contract"
import * as z from "zod"

export const ApiErrorCodeSchema = z
  .enum([
    "ADMIN_NOT_FOUND",
    "ALREADY_REVIEWED",
    "BOOKING_NOT_FOUND",
    "CANNOT_DELETE_SELF",
    "DATES_CONFLICT",
    "EMAIL_TAKEN",
    "INTERNAL",
    "INVALID_CREDENTIALS",
    "INVALID_PAYLOAD",
    "INVALID_RANGE",
    "INVALID_STATUS",
    "RANGE_TOO_LARGE",
    "RATE_LIMITED",
    "REVIEW_NOT_FOUND",
    "SEASON_RULE_NOT_FOUND",
    "UNAUTHORIZED",
    "UNKNOWN_VILLA",
    "VALIDATION",
  ])
  .describe(
    "Every code the Go API sends: the httpserver.Register calls, plus VALIDATION and INTERNAL from httpserver.WriteError.",
  )
export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>

/** Every non-2xx response from the Go API carries this body. */
export const ErrorResponseSchema = z.object({
  error: z.object({ code: ApiErrorCodeSchema, message: z.string() }),
})

type Operation = Exclude<NonNullable<Route["spec"]>, (...args: never) => unknown>

const errorBody = {
  content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
}

export function apiErrors(errors: Record<number, string>, { admin = false } = {}): Route["spec"] {
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

export const NO_SESSION = "Missing or invalid admin session"
export const UNKNOWN_VILLA = "Villa slug not in allowlist"
export const villa = { slug: z.string() }
export const byId = { id: z.uuid() }
export const dateWindow = {
  from: z.iso.date().describe("Window start (inclusive)."),
  to: z.iso.date().describe("Window end (exclusive)."),
}
export const pagination = {
  limit: z.int().min(1).max(100).default(20).optional(),
  page: z.int().min(1).default(1).optional(),
}
