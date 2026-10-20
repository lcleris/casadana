import { describe, expect, test } from "bun:test"

import { m } from "@/paraglide/messages"

import {
  buildNightPrices,
  buildNightSets,
  buildPriceSummary,
  computeQueryWindow,
  dayBackground,
  dayCellState,
  getBlockReason,
  groupNightsByPrice,
  parseValidationMessage,
  resolveSettingsCents,
  sumNightsCents,
} from "./villa-booking-utils"
import type { NightSets } from "./villa-booking-utils"

const d = (iso: string) => new Date(`${iso}T00:00:00`)

const NO_NIGHTS: NightSets = { blocked: new Set(), pending: new Set() }

const VALID = {
  checkIn: d("2030-06-10"),
  checkOut: d("2030-06-13") as Date | null,
  name: "Ada",
  email: "ada@example.com",
  tel: "+33 6 12 34 56 78",
}

describe("getBlockReason", () => {
  test("is null for a valid, free request", () => {
    expect(getBlockReason(NO_NIGHTS, VALID)).toBeNull()
  })

  test("asks for a departure date first", () => {
    expect(getBlockReason(NO_NIGHTS, { ...VALID, checkOut: null, name: "" })).toBe(
      m.villa_booking_reason_pick_departure(),
    )
  })

  test("flags held nights inside the stay, before contact fields", () => {
    const sets: NightSets = { blocked: new Set(["2030-06-11"]), pending: new Set() }
    expect(getBlockReason(sets, { ...VALID, name: "" })).toBe(
      m.villa_booking_reason_dates_unavailable(),
    )
    const pending: NightSets = { blocked: new Set(), pending: new Set(["2030-06-12"]) }
    expect(getBlockReason(pending, VALID)).toBe(m.villa_booking_reason_dates_unavailable())
  })

  test("the departure night itself may be held", () => {
    const sets: NightSets = { blocked: new Set(["2030-06-13"]), pending: new Set() }
    expect(getBlockReason(sets, VALID)).toBeNull()
  })

  test("asks for any blank contact field", () => {
    const fill = m.villa_booking_reason_fill_contact()
    expect(getBlockReason(NO_NIGHTS, { ...VALID, name: "  " })).toBe(fill)
    expect(getBlockReason(NO_NIGHTS, { ...VALID, email: "" })).toBe(fill)
    expect(getBlockReason(NO_NIGHTS, { ...VALID, tel: "" })).toBe(fill)
  })

  test("rejects a malformed email before a malformed phone", () => {
    expect(getBlockReason(NO_NIGHTS, { ...VALID, email: "nope", tel: "abc" })).toBe(
      m.villa_booking_reason_invalid_email(),
    )
  })

  test("rejects a malformed phone", () => {
    expect(getBlockReason(NO_NIGHTS, { ...VALID, tel: "12" })).toBe(
      m.villa_booking_reason_invalid_phone(),
    )
  })
})

describe("computeQueryWindow", () => {
  test("covers the viewed month and the next, end exclusive", () => {
    expect(computeQueryWindow(d("2030-06-15"), d("2030-06-20"), d("2030-06-22"))).toEqual({
      from: "2030-06-01",
      to: "2030-08-01",
    })
  })

  test("stretches back to an earlier check-in", () => {
    expect(computeQueryWindow(d("2030-06-15"), d("2030-05-20"), d("2030-05-22"))).toEqual({
      from: "2030-05-20",
      to: "2030-08-01",
    })
  })

  test("stretches forward to a later departure", () => {
    expect(computeQueryWindow(d("2030-06-15"), d("2030-09-01"), d("2030-09-05"))).toEqual({
      from: "2030-06-01",
      to: "2030-09-05",
    })
  })

  test("caps at 400 days, keeping the stay when the calendar is before it", () => {
    const w = computeQueryWindow(d("2030-01-15"), d("2031-06-10"), d("2031-06-12"))
    expect(w.to).toBe("2031-06-12")
    expect(w.from).toBe("2030-05-08")
  })

  test("caps at 400 days, trimming the end when the calendar is after the stay", () => {
    const w = computeQueryWindow(d("2031-06-15"), d("2030-01-10"), d("2030-01-12"))
    expect(w.from).toBe("2030-01-10")
    expect(w.to).toBe("2031-02-14")
  })
})

describe("parseValidationMessage", () => {
  test("maps API field names to form fields", () => {
    expect(parseValidationMessage("GuestEmail:email;Adults:max")).toEqual([
      { field: "email", type: "email", message: "email" },
      { field: "guests", type: "max", message: "max" },
    ])
  })

  test("defaults a missing or empty tag to invalid", () => {
    expect(parseValidationMessage("GuestName;GuestPhone:")).toEqual([
      { field: "name", type: "invalid", message: undefined },
      { field: "tel", type: "invalid", message: "" },
    ])
  })

  test("drops unknown fields", () => {
    expect(parseValidationMessage("Bogus:x")).toEqual([])
  })
})

describe("price tiers", () => {
  const prices = new Map([
    ["2030-06-10", 12_000],
    ["2030-06-11", 9500],
  ])

  test("groups nights by price, cheapest first, falling back to the base rate", () => {
    expect(groupNightsByPrice(d("2030-06-10"), d("2030-06-14"), prices, 9500)).toEqual([
      { count: 3, priceCents: 9500 },
      { count: 1, priceCents: 12_000 },
    ])
  })

  test("sums every night of the stay", () => {
    expect(sumNightsCents(d("2030-06-10"), d("2030-06-14"), prices, 9500)).toBe(12_000 + 9500 * 3)
  })

  test("an empty stay has no tiers and no sum", () => {
    expect(groupNightsByPrice(d("2030-06-10"), d("2030-06-10"), prices, 9500)).toEqual([])
    expect(sumNightsCents(d("2030-06-10"), d("2030-06-10"), prices, 9500)).toBe(0)
  })
})

describe("dayBackground", () => {
  test("is undefined for a fully free day", () => {
    expect(dayBackground("free", "free")).toBeUndefined()
  })

  test("splits a changeover day diagonally", () => {
    expect(dayBackground("booked", "free")).toContain("linear-gradient(to bottom right")
  })
})

describe("settings, availability and price helpers", () => {
  test("an unset base rate falls back to the editorial price, unset fees are free", () => {
    expect(resolveSettingsCents(undefined, 150)).toEqual({
      baseNightlyCents: 15_000,
      cleaningFeeCents: 0,
      conciergeFeeCents: 0,
    })
    expect(resolveSettingsCents({ base_price_cents: 0 }, 150).baseNightlyCents).toBe(15_000)
  })

  test("a configured rate and fees win over the fallback", () => {
    expect(
      resolveSettingsCents(
        { base_price_cents: 20_000, cleaning_fee_cents: 5000, concierge_fee_cents: 1000 },
        150,
      ),
    ).toEqual({ baseNightlyCents: 20_000, cleaningFeeCents: 5000, conciergeFeeCents: 1000 })
  })

  test("nights holds every night of a booked or pending range, departure excluded", () => {
    const sets = buildNightSets({
      booked_ranges: [{ check_in: "2030-06-10", check_out: "2030-06-12" }],
      pending_ranges: [{ check_in: "2030-06-20", check_out: "2030-06-21" }],
    })
    expect([...sets.blocked]).toEqual(["2030-06-10", "2030-06-11"])
    expect([...sets.pending]).toEqual(["2030-06-20"])
    expect(buildNightSets({})).toEqual({ blocked: new Set(), pending: new Set() })
  })

  test("zero-priced nights are left out so they fall back to the base rate", () => {
    const prices = buildNightPrices([
      { date: "2030-06-10", price_cents: 0 },
      { date: "2030-06-11", price_cents: 12_000 },
    ])
    expect([...prices]).toEqual([["2030-06-11", 12_000]])
    expect(buildNightPrices([]).size).toBe(0)
  })

  test("the summary adds both fees once on top of the nights", () => {
    const summary = buildPriceSummary({
      checkIn: d("2030-06-10"),
      stayEnd: d("2030-06-12"),
      nightPrices: new Map([["2030-06-10", 10_000]]),
      baseNightlyCents: 9000,
      cleaningFeeCents: 5000,
      conciergeFeeCents: 1000,
    })
    expect(summary).toEqual({
      nights: 2,
      nightsSubtotal: 190,
      cleaningFee: 50,
      conciergeFee: 10,
      total: 250,
      priceBreakdown: [
        { count: 1, priceCents: 9000 },
        { count: 1, priceCents: 10_000 },
      ],
    })
  })
})

describe("dayCellState", () => {
  const base = {
    today: d("2030-06-01"),
    checkIn: d("2030-06-10"),
    shownOut: d("2030-06-14") as Date | null,
    previewOut: null as Date | null,
    nightSets: { blocked: new Set(["2030-06-20", "2030-06-21"]), pending: new Set(["2030-06-25"]) },
    canDepartOn: (date: Date) => date.getDate() === 20,
  }

  test("a missing or past date is blank", () => {
    expect(dayCellState({ ...base, date: null })).toEqual({ kind: "blank" })
    expect(dayCellState({ ...base, date: d("2030-05-30") })).toEqual({ kind: "blank" })
  })

  test("a held night that cannot end the stay is held, booked or pending", () => {
    expect(dayCellState({ ...base, date: d("2030-06-21") })).toMatchObject({
      kind: "held",
      booked: true,
    })
    expect(dayCellState({ ...base, date: d("2030-06-25") })).toMatchObject({
      kind: "held",
      booked: false,
    })
  })

  test("a held night can still be the departure day, with no price", () => {
    expect(dayCellState({ ...base, date: d("2030-06-20") })).toMatchObject({
      kind: "open",
      title: "departure-only",
      showPrice: false,
      isEdge: false,
    })
  })

  test("the free day after a held night is an arrival after departure", () => {
    expect(dayCellState({ ...base, date: d("2030-06-22") })).toMatchObject({
      kind: "open",
      title: "arrival-after-departure",
      showPrice: true,
      fill: "hover",
    })
  })

  test("the stay edges are marked and the days between are in range", () => {
    expect(dayCellState({ ...base, date: d("2030-06-10") })).toMatchObject({
      isEdge: true,
      showPrice: false,
      fill: "none",
    })
    expect(dayCellState({ ...base, date: d("2030-06-12") })).toMatchObject({
      isEdge: false,
      fill: "range",
    })
    expect(dayCellState({ ...base, date: d("2030-06-14") })).toMatchObject({
      isEdge: true,
      checkoutPreview: false,
    })
  })

  test("while previewing, the range is lighter and the checkout edge is flagged", () => {
    const previewing = { ...base, previewOut: d("2030-06-14") }
    expect(dayCellState({ ...previewing, date: d("2030-06-12") })).toMatchObject({
      fill: "range-preview",
    })
    expect(dayCellState({ ...previewing, date: d("2030-06-14") })).toMatchObject({
      checkoutPreview: true,
    })
  })
})
