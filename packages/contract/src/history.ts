import { oc } from "@orpc/contract"
import * as z from "zod"

import { apiErrors, NO_SESSION, pagination } from "./shared"

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

export const history = {
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
}
