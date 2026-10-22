import { ApiError } from "@casa-dana/api"
import { ORPCError } from "@orpc/client"
import { QueryClient } from "@tanstack/react-query"

/** A 4xx will fail the same way on retry: auth, validation, not found. */
function isClientError(err: unknown): boolean {
  const isApiError = err instanceof ApiError || err instanceof ORPCError
  return isApiError && err.status >= 400 && err.status < 500
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, err) => !isClientError(err) && failureCount < 2,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: false },
  },
})
