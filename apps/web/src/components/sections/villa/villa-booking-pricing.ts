import {
  useGetVillaAvailability,
  useGetVillaPricing,
  useGetVillaPricingSettings,
} from "@casa-dana/api"
import { keepPreviousData } from "@tanstack/react-query"
import { useMemo } from "react"

import {
  buildNightPrices,
  buildNightSets,
  buildPriceSummary,
  computeQueryWindow,
  resolveSettingsCents,
} from "./villa-booking-utils"

interface UseVillaBookingPricingArgs {
  villaSlug: string
  fallbackNightlyEuros: number
  viewMonth: Date
  checkIn: Date
  stayEnd: Date
  calendarOpen: boolean
}

export function useVillaBookingPricing({
  villaSlug,
  fallbackNightlyEuros,
  viewMonth,
  checkIn,
  stayEnd,
  calendarOpen,
}: UseVillaBookingPricingArgs) {
  // Window covers both the visible calendar months AND the selected stay range
  // (so the displayed total stays accurate even when checkout is outside the
  // currently-viewed month).
  const queryWindow = useMemo(
    () => computeQueryWindow(viewMonth, checkIn, stayEnd),
    [viewMonth, checkIn, stayEnd],
  )

  const { data: availability } = useGetVillaAvailability(
    villaSlug,
    { from: queryWindow.from, to: queryWindow.to },
    {
      query: {
        enabled: calendarOpen,
        placeholderData: keepPreviousData,
      },
    },
  )

  // Pricing is always enabled (not gated on calendar visibility) so the sidebar
  // total reflects the real back-office rates on first paint, before the user
  // opens the calendar.
  const { data: pricing } = useGetVillaPricing(
    villaSlug,
    { from: queryWindow.from, to: queryWindow.to },
    {
      query: {
        placeholderData: keepPreviousData,
      },
    },
  )

  // Base rate and both fees live in the back-office, per villa.
  const { data: settings } = useGetVillaPricingSettings(villaSlug)
  const { baseNightlyCents, cleaningFeeCents, conciergeFeeCents } = resolveSettingsCents(
    settings,
    fallbackNightlyEuros,
  )

  const nightSets = useMemo(() => buildNightSets(availability), [availability])

  // `nights` is the API's own answer for every day in the window: a per-date
  // override wins, then the highest matching season rule, then the villa's base
  // rate. Resolving it server-side is what keeps the panel in step with the
  // back-office — reading the raw `overrides` list alone missed every seasonal
  // rule the admin had configured.
  const nightPricesByDate = useMemo(() => buildNightPrices(pricing?.nights), [pricing])

  const summary = useMemo(
    () =>
      buildPriceSummary({
        checkIn,
        stayEnd,
        nightPrices: nightPricesByDate,
        baseNightlyCents,
        cleaningFeeCents,
        conciergeFeeCents,
      }),
    [checkIn, stayEnd, nightPricesByDate, baseNightlyCents, cleaningFeeCents, conciergeFeeCents],
  )

  return { nightSets, nightPricesByDate, baseNightlyCents, ...summary }
}
