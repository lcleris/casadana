import { OpenAPIGenerator } from "@orpc/openapi"
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4"

import {
  AdminLoginRequest,
  AdminUser,
  BookingResponse,
  BookingSource,
  BookingStatus,
  contract,
  CreateBookingRequest,
  ErrorResponse,
  HealthResponse,
  ListBookingsResponse,
} from "./index"

const generator = new OpenAPIGenerator({ schemaConverters: [new ZodToJsonSchemaConverter()] })

const spec = await generator.generate(contract, {
  commonSchemas: Object.fromEntries(
    Object.entries({
      AdminLoginRequest,
      AdminUser,
      BookingResponse,
      BookingSource,
      BookingStatus,
      CreateBookingRequest,
      ErrorResponse,
      HealthResponse,
      ListBookingsResponse,
    }).map(([name, schema]) => [name, { schema }]),
  ),
  info: { title: "Casa Dana API", version: "0.1.0" },
})

await Bun.write(process.argv[2] ?? "openapi.json", `${JSON.stringify(spec, null, 2)}\n`)
