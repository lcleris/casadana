import { m } from "@/paraglide/messages"

interface VillaBookingSummaryProps {
  priceBreakdown: Array<{ priceCents: number; count: number }>
  nights: number
  nightsSubtotal: number
  cleaningFee: number
  conciergeFee: number
  total: number
}

function nightsWord(count: number): string {
  return count === 1 ? m.villa_booking_night_singular() : m.villa_booking_night_plural()
}

export function VillaBookingSummary({
  priceBreakdown,
  nights,
  nightsSubtotal,
  cleaningFee,
  conciergeFee,
  total,
}: VillaBookingSummaryProps) {
  return (
    <div className="border-outline-variant mt-6 grid gap-3 border-t pt-5 text-[13.5px]">
      {priceBreakdown.length > 1 ? (
        priceBreakdown.map(({ priceCents, count }) => (
          <div key={priceCents} className="text-on-surface-variant flex justify-between">
            <span>
              {m.villa_booking_nights_at_price({
                count,
                nightsWord: nightsWord(count),
                price: Math.round(priceCents / 100),
              })}
            </span>
            <span>€{((priceCents * count) / 100).toLocaleString()}</span>
          </div>
        ))
      ) : (
        <div className="text-on-surface-variant flex justify-between">
          <span>
            {nights} {nightsWord(nights)}
          </span>
          <span>€{nightsSubtotal.toLocaleString()}</span>
        </div>
      )}
      {cleaningFee > 0 && (
        <div className="text-on-surface-variant flex justify-between">
          <span>{m.villa_booking_cleaning_fee()}</span>
          <span>€{cleaningFee.toLocaleString()}</span>
        </div>
      )}
      {conciergeFee > 0 && (
        <div className="text-on-surface-variant flex justify-between">
          <span>{m.villa_booking_concierge_fee()}</span>
          <span>€{conciergeFee.toLocaleString()}</span>
        </div>
      )}
      <div className="font-display text-primary border-outline-variant mt-1 flex justify-between border-t pt-3.5 text-[22px] italic">
        <span>{m.villa_booking_total()}</span>
        <span>€{total.toLocaleString()}</span>
      </div>
    </div>
  )
}
