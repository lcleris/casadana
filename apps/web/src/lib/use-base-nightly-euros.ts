import { useQuery } from "@tanstack/react-query"

import { orpc } from "@/lib/orpc"

/**
 * The villa's nightly rate in whole euros, read from the back-office so every
 * price on a page agrees. `fallbackEuros` is only used for a villa that has
 * never been configured (settings read back all-zero then).
 */
export function useBaseNightlyEuros(villaSlug: string, fallbackEuros: number): number {
  const { data: settings } = useQuery(
    orpc.pricing.getSettings.queryOptions({ input: { slug: villaSlug } }),
  )
  const baseCents = settings?.base_price_cents ?? 0
  return baseCents === 0 ? fallbackEuros : Math.round(baseCents / 100)
}
