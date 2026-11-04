import { OpenAPIGenerator } from "@orpc/openapi"
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4"
import * as z from "zod"

import * as exports from "./index"

const generator = new OpenAPIGenerator({ schemaConverters: [new ZodToJsonSchemaConverter()] })

const commonSchemas: Record<string, { schema: z.ZodType }> = {}
for (const [name, value] of Object.entries(exports)) {
  if (name.endsWith("Schema") && value instanceof z.ZodType) {
    commonSchemas[name.slice(0, -"Schema".length)] = { schema: value }
  }
}

const spec = await generator.generate(exports.contract, {
  commonSchemas,
  components: {
    securitySchemes: {
      adminSession: { in: "cookie", name: "casa_admin_session", type: "apiKey" },
    },
  },
  info: {
    description:
      "Casa Dana villa rental API. Villa content (names, photos, descriptions) is static in the frontend and not exposed here. Generated from packages/contract: edit the contract, then `bun run --cwd packages/contract generate`.",
    title: "Casa Dana API",
    version: "0.1.0",
  },
  tags: [
    { description: "Liveness", name: "health" },
    { description: "Booking submission and availability", name: "bookings" },
    { description: "Base rate, fees, season rules and per-date price overrides", name: "pricing" },
    { description: "Guest testimonials linked to bookings", name: "reviews" },
    { description: "Admin authentication and user management", name: "admin" },
    { description: "Admin activity log", name: "history" },
  ],
})

// oRPC documents a void output as a JSON body; a 204 has none.
for (const item of Object.values(spec.paths ?? {})) {
  for (const operation of Object.values(item ?? {})) {
    if (
      typeof operation === "object" &&
      "responses" in operation &&
      operation.responses?.["204"] !== undefined
    ) {
      operation.responses["204"] = { description: "No content" }
    }
  }
}

await Bun.write(process.argv[2] ?? "openapi.json", `${JSON.stringify(spec, null, 2)}\n`)
