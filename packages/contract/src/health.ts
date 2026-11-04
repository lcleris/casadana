import { oc } from "@orpc/contract"
import * as z from "zod"

export const HealthResponseSchema = z.object({ status: z.literal("ok") })

export const health = {
  get: oc
    .route({
      method: "GET",
      operationId: "getHealth",
      path: "/api/health",
      summary: "Liveness probe",
      tags: ["health"],
    })
    .output(HealthResponseSchema),
}
