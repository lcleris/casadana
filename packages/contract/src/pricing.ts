import { oc } from "@orpc/contract"
import * as z from "zod"

import { apiErrors, byId, dateWindow, NO_SESSION, UNKNOWN_VILLA, villa } from "./shared"

const MAX_CENTS = 100_000_000

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

export const pricing = {
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
}
