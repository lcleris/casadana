import { contract } from "@casa-dana/contract"
import { ApiErrorCodeSchema, ErrorResponseSchema } from "@casa-dana/contract/shared"
import type { ApiErrorCode } from "@casa-dana/contract/shared"
import { createORPCClient, ORPCError } from "@orpc/client"
import type { ContractRouterClient } from "@orpc/contract"
import type { JsonifiedClient } from "@orpc/openapi-client"
import { OpenAPILink } from "@orpc/openapi-client/fetch"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"

import { m } from "@/paraglide/messages"

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL ?? ""

const link = new OpenAPILink(contract, {
  // The Go API's error body is `{ error: { code, message } }`, not oRPC's own.
  customErrorResponseBodyDecoder: (body, response) => {
    const parsed = ErrorResponseSchema.safeParse(body)
    if (!parsed.success) {
      return null
    }
    return new ORPCError(parsed.data.error.code, {
      message: parsed.data.error.message,
      status: response.status,
    })
  },
  fetch: async (request, init) =>
    await globalThis.fetch(request, { ...init, credentials: "include" }),
  // Contract paths already start with /api. Empty in production, where nginx
  // serves the SPA and proxies /api on the same origin (docs/adr/0003).
  url: apiBaseUrl === "" ? globalThis.location.origin : apiBaseUrl,
})

const client: JsonifiedClient<ContractRouterClient<typeof contract>> = createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)

export function apiErrorCode(error: unknown): ApiErrorCode | undefined {
  if (!(error instanceof ORPCError)) {
    return undefined
  }
  const parsed = ApiErrorCodeSchema.safeParse(error.code)
  return parsed.success ? parsed.data : undefined
}

const API_ERROR_MESSAGES: Record<ApiErrorCode, () => string> = {
  ADMIN_NOT_FOUND: m.api_error_admin_not_found,
  ALREADY_REVIEWED: m.api_error_already_reviewed,
  BOOKING_NOT_FOUND: m.api_error_booking_not_found,
  CANNOT_DELETE_SELF: m.api_error_cannot_delete_self,
  DATES_CONFLICT: m.api_error_dates_conflict,
  EMAIL_TAKEN: m.api_error_email_taken,
  INTERNAL: m.api_error_generic,
  INVALID_CREDENTIALS: m.api_error_invalid_credentials,
  INVALID_PAYLOAD: m.api_error_invalid,
  INVALID_RANGE: m.api_error_invalid_range,
  INVALID_STATUS: m.api_error_invalid_status,
  RANGE_TOO_LARGE: m.api_error_range_too_large,
  RATE_LIMITED: m.api_error_rate_limited,
  REVIEW_NOT_FOUND: m.api_error_review_not_found,
  SEASON_RULE_NOT_FOUND: m.api_error_season_rule_not_found,
  UNAUTHORIZED: m.api_error_unauthorized,
  UNKNOWN_VILLA: m.api_error_unknown_villa,
  VALIDATION: m.api_error_invalid,
}

/** `overrides` lets a form word a code in terms of its own fields. */
export function apiErrorMessage(
  error: unknown,
  overrides: Partial<Record<ApiErrorCode, () => string>> = {},
): string {
  const code = apiErrorCode(error)
  if (code === undefined) {
    return m.api_error_generic()
  }
  return (overrides[code] ?? API_ERROR_MESSAGES[code])()
}
