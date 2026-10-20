import { contract, ErrorResponse } from "@casa-dana/contract"
import { createORPCClient, ORPCError } from "@orpc/client"
import type { ContractRouterClient } from "@orpc/contract"
import type { JsonifiedClient } from "@orpc/openapi-client"
import { OpenAPILink } from "@orpc/openapi-client/fetch"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL ?? ""

const link = new OpenAPILink(contract, {
  // The Go API's error body is `{ error: { code, message } }`, not oRPC's own.
  customErrorResponseBodyDecoder: (body, response) => {
    const parsed = ErrorResponse.safeParse(body)
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
