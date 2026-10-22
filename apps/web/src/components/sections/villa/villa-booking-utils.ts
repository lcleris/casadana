import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
} from "date-fns"

import { m } from "@/paraglide/messages"

export interface BookingFormValues {
  name: string
  checkIn: Date
  // Null until the guest picks it: no stay length is suggested for them.
  checkOut: Date | null
  guests: number
  email: string
  tel: string
  description: string
}

export type NightState = "free" | "booked" | "pending"

export interface NightSets {
  blocked: Set<string>
  pending: Set<string>
}

export interface CalendarCell {
  key: string
  d: number
  date: Date | null
}

export const getDaysOfWeek = () => [
  m.villa_booking_day_mo(),
  m.villa_booking_day_tu(),
  m.villa_booking_day_we(),
  m.villa_booking_day_th(),
  m.villa_booking_day_fr(),
  m.villa_booking_day_sa(),
  m.villa_booking_day_su(),
]

// Mirrors the API's own cap on a pricing window (maxCalendarDays in the
// pricing service). Kept in sync by hand — the API answers a wider window
// with a 422.
const MAX_WINDOW_DAYS = 400

const NIGHT_FILL: Record<NightState, string> = {
  free: "transparent",
  booked: "var(--color-surface-dim)",
  pending: "color-mix(in oklch, var(--color-secondary-container) 55%, transparent)",
}

// A calendar day holds the end of the previous night (morning, top-left) and
// the start of its own night (afternoon, bottom-right). Splitting the cell on
// the diagonal shows a changeover day as half taken: one guest checks out in
// the morning, the next can check in that afternoon.
export function dayBackground(morning: NightState, afternoon: NightState): string | undefined {
  if (morning === "free" && afternoon === "free") {
    return undefined
  }
  return `linear-gradient(to bottom right, ${NIGHT_FILL[morning]} 50%, ${NIGHT_FILL[afternoon]} 50%)`
}

export function fmt(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function fmtMonth(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

function nightsBetween(a: Date, b: Date) {
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000))
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function startOfToday(): Date {
  return startOfDay(new Date())
}

export function firstOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function dayKey(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

// Characters a phone number may contain. Anything else is dropped as it is
// typed, so letters never reach the field.
export const NOT_PHONE_CHAR = /[^0-9+\s().-]/gu
// 6–15 digits once the separators are ignored, with an optional leading +.
export const PHONE_PATTERN = /^\+?[\s().-]*(?:\d[\s().-]*){6,15}$/u
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u

function datesToSet(ranges: Array<{ check_in: string; check_out: string }>): Set<string> {
  const set = new Set<string>()
  for (const r of ranges) {
    const start = parseISO(r.check_in)
    const end = parseISO(r.check_out)
    for (let d = start; d < end; d = addDays(d, 1)) {
      set.add(dayKey(d))
    }
  }
  return set
}

function nightState(sets: NightSets, date: Date): NightState {
  const key = dayKey(date)
  if (sets.blocked.has(key)) {
    return "booked"
  }
  return sets.pending.has(key) ? "pending" : "free"
}

export function isUnavailable(sets: NightSets, date: Date): boolean {
  return nightState(sets, date) !== "free"
}

// A stay only occupies its nights: arrival day up to the day before
// departure. The departure day is left out on purpose — check-out is in the
// morning and check-in in the afternoon, so one guest can leave on the day
// the next one arrives.
export function isStayFree(sets: NightSets, from: Date, to: Date): boolean {
  for (let day = from; day < to; day = addDays(day, 1)) {
    if (isUnavailable(sets, day)) {
      return false
    }
  }
  return true
}

const earlier = (a: Date, b: Date) => (a < b ? a : b)
const later = (a: Date, b: Date) => (a > b ? a : b)

// The API rejects a window wider than MAX_WINDOW_DAYS, which a guest can
// reach by browsing a year away from their own dates. The stay wins that
// budget (the sidebar total is the number that has to be right) and the
// calendar keeps whatever is left.
function capWindow(from: Date, to: Date, stayWins: boolean) {
  if (differenceInCalendarDays(to, from) <= MAX_WINDOW_DAYS) {
    return { from, to }
  }
  return stayWins
    ? { from: addDays(to, -MAX_WINDOW_DAYS), to }
    : { from, to: addDays(from, MAX_WINDOW_DAYS) }
}

// Window covers both the visible calendar months AND the selected stay range
// (so the displayed total stays accurate even when checkout is outside the
// currently-viewed month).
export function computeQueryWindow(viewMonth: Date, checkIn: Date, stayEnd: Date) {
  const calFrom = startOfMonth(viewMonth)
  // The API window is [from, to) — exclusive — so pricing the last visible
  // day takes one extra day.
  const calTo = addDays(endOfMonth(addMonths(viewMonth, 1)), 1)
  const window = capWindow(earlier(checkIn, calFrom), later(stayEnd, calTo), calFrom < checkIn)
  return { from: dayKey(window.from), to: dayKey(window.to) }
}

// Price of every night of the stay, in cents.
function stayNightCents(
  checkIn: Date,
  stayEnd: Date,
  nightPrices: Map<string, number>,
  baseNightlyCents: number,
): Array<number> {
  const prices: Array<number> = []
  for (let day = new Date(checkIn); day < stayEnd; day = addDays(day, 1)) {
    prices.push(nightPrices.get(dayKey(day)) ?? baseNightlyCents)
  }
  return prices
}

export function sumNightsCents(
  checkIn: Date,
  stayEnd: Date,
  nightPrices: Map<string, number>,
  baseNightlyCents: number,
): number {
  let sum = 0
  for (const cents of stayNightCents(checkIn, stayEnd, nightPrices, baseNightlyCents)) {
    sum += cents
  }
  return sum
}

// Groups selected nights by their per-night price so the summary can show
// "5 nights at €95" / "2 nights at €120" instead of a single blended total
// whenever seasonal rates or overrides make the stay span more than one tier.
export function groupNightsByPrice(
  checkIn: Date,
  stayEnd: Date,
  nightPrices: Map<string, number>,
  baseNightlyCents: number,
): Array<{ priceCents: number; count: number }> {
  const counts = new Map<number, number>()
  for (const priceCents of stayNightCents(checkIn, stayEnd, nightPrices, baseNightlyCents)) {
    counts.set(priceCents, (counts.get(priceCents) ?? 0) + 1)
  }
  return Array.from(counts, ([priceCents, count]) => ({ count, priceCents })).toSorted(
    (a, b) => a.priceCents - b.priceCents,
  )
}

type BlockValues = Pick<BookingFormValues, "checkIn" | "checkOut" | "name" | "email" | "tel">

interface BlockRule {
  broken: (sets: NightSets, values: BlockValues) => boolean
  reason: () => string
}

// Ordered: dates come first, they are the part a guest cannot fix by typing.
const BLOCK_RULES: Array<BlockRule> = [
  { broken: (_, v) => v.checkOut === null, reason: m.villa_booking_reason_pick_departure },
  {
    broken: (sets, v) => v.checkOut !== null && !isStayFree(sets, v.checkIn, v.checkOut),
    reason: m.villa_booking_reason_dates_unavailable,
  },
  {
    broken: (_, v) => [v.name, v.email, v.tel].some((field) => field.trim() === ""),
    reason: m.villa_booking_reason_fill_contact,
  },
  {
    broken: (_, v) => !EMAIL_PATTERN.test(v.email.trim()),
    reason: m.villa_booking_reason_invalid_email,
  },
  {
    broken: (_, v) => !PHONE_PATTERN.test(v.tel.trim()),
    reason: m.villa_booking_reason_invalid_phone,
  },
]

// First rule the request breaks, shown under the disabled button.
export function getBlockReason(sets: NightSets, values: BlockValues): string | null {
  const rule = BLOCK_RULES.find((r) => r.broken(sets, values))
  return rule === undefined ? null : rule.reason()
}

export function buildCalendarCells(viewMonth: Date): Array<CalendarCell> {
  const y = viewMonth.getFullYear()
  const mo = viewMonth.getMonth()
  const first = new Date(y, mo, 1)
  const startDow = (first.getDay() + 6) % 7
  const daysInMonth = new Date(y, mo + 1, 0).getDate()
  const prevDays = new Date(y, mo, 0).getDate()

  const out: Array<CalendarCell> = []
  for (let i = startDow; i > 0; i -= 1) {
    const d = prevDays - i + 1
    out.push({ key: `prev-${d}`, d, date: null })
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    out.push({ key: `day-${d}`, d, date: new Date(y, mo, d) })
  }
  return out
}

const FIELD_MAP: Record<string, keyof BookingFormValues> = {
  GuestName: "name",
  GuestEmail: "email",
  GuestPhone: "tel",
  CheckIn: "checkIn",
  CheckOut: "checkOut",
  Adults: "guests",
}

interface ValidationError {
  field: keyof BookingFormValues
  type: string
  message: string | undefined
}

function parseValidationPart(part: string): ValidationError | undefined {
  const [rawField, tag] = part.split(":").map((s) => s.trim())
  const field = FIELD_MAP[rawField ?? ""]
  if (field === undefined) {
    return undefined
  }
  return { field, type: tag === undefined || tag === "" ? "invalid" : tag, message: tag }
}

// The API packs per-field validation failures as "Field:tag;Field:tag".
export function parseValidationMessage(message: string): Array<ValidationError> {
  return message
    .split(";")
    .map(parseValidationPart)
    .filter((e) => e !== undefined)
}

const TOP_LEVEL_ERRORS: Record<string, () => string> = {
  DATES_CONFLICT: m.villa_booking_error_dates_conflict,
  UNKNOWN_VILLA: m.villa_booking_error_unknown_villa,
}

export function topLevelErrorMessage(code: string): string {
  const message = TOP_LEVEL_ERRORS[code] ?? m.villa_booking_error_generic
  return message()
}

interface PriceSummaryInput {
  checkIn: Date
  stayEnd: Date
  nightPrices: Map<string, number>
  baseNightlyCents: number
  cleaningFeeCents: number
  conciergeFeeCents: number
}

export function buildPriceSummary(input: PriceSummaryInput) {
  const { checkIn, stayEnd, nightPrices, baseNightlyCents, cleaningFeeCents, conciergeFeeCents } =
    input
  const nightsCents = sumNightsCents(checkIn, stayEnd, nightPrices, baseNightlyCents)
  return {
    nights: nightsBetween(checkIn, stayEnd),
    nightsSubtotal: nightsCents / 100,
    cleaningFee: cleaningFeeCents / 100,
    conciergeFee: conciergeFeeCents / 100,
    // Both back-office fees are charged once per stay, on top of the nights.
    total: (nightsCents + cleaningFeeCents + conciergeFeeCents) / 100,
    priceBreakdown: groupNightsByPrice(checkIn, stayEnd, nightPrices, baseNightlyCents),
  }
}

interface PricingSettings {
  base_price_cents?: number
  cleaning_fee_cents?: number
  concierge_fee_cents?: number
}

// `GET .../pricing/settings` is public and reads back all-zero for a villa
// that has never been configured, so an unset base rate falls back to the
// hardcoded content value rather than showing €0, and an unset fee is simply
// not charged.
export function resolveSettingsCents(
  settings: PricingSettings | undefined,
  fallbackNightlyEuros: number,
) {
  const configuredBase = settings?.base_price_cents ?? 0
  return {
    baseNightlyCents: configuredBase === 0 ? fallbackNightlyEuros * 100 : configuredBase,
    cleaningFeeCents: settings?.cleaning_fee_cents ?? 0,
    conciergeFeeCents: settings?.concierge_fee_cents ?? 0,
  }
}

interface AvailabilityRanges {
  booked_ranges?: Array<{ check_in: string; check_out: string }>
  pending_ranges?: Array<{ check_in: string; check_out: string }>
}

// Confirmed (approved/paid) nights are hard blocked. Pending nights are
// provisionally held by an unconfirmed request — not guaranteed, but a new
// booking on top of them would still conflict server-side, so they're shown
// (distinctly) and are not selectable either.
export function buildNightSets(availability: AvailabilityRanges | undefined): NightSets {
  return {
    blocked: datesToSet(availability?.booked_ranges ?? []),
    pending: datesToSet(availability?.pending_ranges ?? []),
  }
}

// A villa with no base rate configured resolves to 0; leaving such a night
// out falls it back to the editorial figure rather than advertising a free
// night.
export function buildNightPrices(
  nights: Array<{ date: string; price_cents: number }> | undefined,
): Map<string, number> {
  const priced = (nights ?? []).filter((night) => night.price_cents > 0)
  return new Map(priced.map((night) => [night.date, night.price_cents]))
}

export type DayCellState =
  | { kind: "blank" }
  | { kind: "held"; booked: boolean; background: string | undefined }
  | {
      kind: "open"
      date: Date
      background: string | undefined
      title: "departure-only" | "arrival-after-departure" | "none"
      showPrice: boolean
      isEdge: boolean
      checkoutPreview: boolean
      fill: "range" | "range-preview" | "hover" | "none"
    }

export type OpenDayState = Extract<DayCellState, { kind: "open" }>

interface DayCellInput {
  date: Date | null
  today: Date
  checkIn: Date
  shownOut: Date | null
  previewOut: Date | null
  nightSets: NightSets
  canDepartOn: (date: Date) => boolean
}

function openDayFill(inRange: boolean, previewing: boolean, isEdge: boolean) {
  if (inRange) {
    return previewing ? "range-preview" : "range"
  }
  return isEdge ? "none" : "hover"
}

function openDayTitle(departureOnly: boolean, arrivalAfterDeparture: boolean) {
  if (departureOnly) {
    return "departure-only"
  }
  return arrivalAfterDeparture ? "arrival-after-departure" : "none"
}

function isDay(date: Date, other: Date | null): boolean {
  return other !== null && sameDay(date, other)
}

interface OpenDayFacts {
  date: Date
  background: string | undefined
  isEdge: boolean
  isCO: boolean
  departureOnly: boolean
  // The previous guest leaves that morning, the next one can arrive.
  arrivalAfterDeparture: boolean
  inRange: boolean
  previewing: boolean
}

function openDayState(facts: OpenDayFacts): OpenDayState {
  const { isEdge, departureOnly, inRange, previewing } = facts
  return {
    kind: "open",
    date: facts.date,
    background: facts.background,
    title: openDayTitle(departureOnly, facts.arrivalAfterDeparture),
    // No night is bought on a departure day, so it carries no price.
    showPrice: !(isEdge || departureOnly),
    isEdge,
    checkoutPreview: facts.isCO && previewing,
    fill: openDayFill(inRange, previewing, isEdge),
  }
}

// What one calendar cell is: a greyed-out blank, a held night that cannot be
// picked, or an open day with the facts its button renders from.
export function dayCellState(input: DayCellInput): DayCellState {
  const { date, today, checkIn, shownOut, previewOut, nightSets, canDepartOn } = input
  if (date === null || date < today) {
    return { kind: "blank" }
  }
  const isCO = isDay(date, shownOut)
  const isEdge = sameDay(date, checkIn) || isCO
  const morning = nightState(nightSets, addDays(date, -1))
  const afternoon = nightState(nightSets, date)
  const background = dayBackground(morning, afternoon)
  const held = afternoon !== "free"
  // A held night can still be picked as the departure day.
  const departureOnly = held && canDepartOn(date)
  if (held && !isEdge && !departureOnly) {
    return { kind: "held", booked: afternoon === "booked", background }
  }
  return openDayState({
    date,
    background,
    isEdge,
    isCO,
    departureOnly,
    arrivalAfterDeparture: !held && morning !== "free",
    inRange: shownOut !== null && date > checkIn && date < shownOut,
    previewing: previewOut !== null,
  })
}
