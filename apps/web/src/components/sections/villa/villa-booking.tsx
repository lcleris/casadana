import { ApiError, useCreateBooking } from "@casa-dana/api"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import type { VillaData } from "@/constants/villas.const"
import { usePublishedRating } from "@/lib/use-published-rating"
import { cn } from "@/lib/utils"
import { m } from "@/paraglide/messages"
import { getLocale } from "@/paraglide/runtime"

import { VillaBookingCalendar } from "./villa-booking-calendar"
import { ContactFields, GuestsField } from "./villa-booking-fields"
import { useVillaBookingPricing } from "./villa-booking-pricing"
import { VillaBookingSummary } from "./villa-booking-summary"
import {
  dayKey,
  firstOfMonth,
  fmt,
  getBlockReason,
  isStayFree,
  isUnavailable,
  parseValidationMessage,
  startOfToday,
  topLevelErrorMessage,
} from "./villa-booking-utils"
import type { BookingFormValues } from "./villa-booking-utils"

interface VillaBookingProps {
  villaSlug: string
  booking: VillaData["booking"]
}

type ActiveField = "in" | "out" | null

const PANEL_CLASS =
  "bg-background border-outline-variant editorial-shadow border p-6 md:sticky md:top-28 md:p-8"
const TRIGGER_LABEL_CLASS =
  "text-on-surface-variant block font-mono text-[10px] tracking-[0.22em] uppercase"
const TRIGGER_VALUE_CLASS = "font-display text-primary mt-1 block text-[17px] italic"

interface DateTriggerProps {
  label: string
  value: string
  active: boolean
  className: string
  onOpen: () => void
}

function DateTrigger({ label, value, active, className, onOpen }: DateTriggerProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "hover:bg-surface-container-low block bg-white px-4 py-3.5 text-left transition-colors",
        className,
        active && "bg-surface-container-low",
      )}
    >
      <span className={TRIGGER_LABEL_CLASS}>{label}</span>
      <span className={TRIGGER_VALUE_CLASS}>{value}</span>
    </button>
  )
}

interface RatingStripProps {
  filledStars: number
  score: number
  count: number
}

function RatingStrip({ filledStars, score, count }: RatingStripProps) {
  return (
    <div className="border-outline-variant mb-6 flex flex-col gap-1 border-b pb-6 font-mono text-[11px] tracking-[0.1em]">
      <span className="text-secondary text-[13px] tracking-[2px]">
        {"★".repeat(filledStars)}
        {"☆".repeat(5 - filledStars)}
      </span>
      <span className="text-on-surface-variant">
        {score.toFixed(2)} · {m.villa_booking_review_count({ count })}
      </span>
    </div>
  )
}

/**
 * Ref callback that calls `onOutside` on any mousedown outside the element:
 * here the date triggers and the calendar they open.
 */
function dismissOnOutsideMouseDown(onOutside: () => void) {
  return (element: HTMLElement | null) => {
    const handler = ({ target }: MouseEvent) => {
      if (!(target instanceof Node && element?.contains(target) === true)) {
        onOutside()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => {
      document.removeEventListener("mousedown", handler)
    }
  }
}

export default function VillaBooking({ villaSlug, booking }: VillaBookingProps) {
  // Computed once at mount — dates won't shift if the user keeps the page open
  // across midnight, which is fine for a booking flow.
  const today = useMemo(() => startOfToday(), [])

  const { control, register, handleSubmit, setValue, setError } = useForm<BookingFormValues>({
    defaultValues: {
      name: "",
      checkIn: today,
      checkOut: null,
      guests: booking.defaultGuests,
      email: "",
      tel: "",
      description: "",
    },
  })

  const checkIn = useWatch({ control, name: "checkIn" })
  const checkOut = useWatch({ control, name: "checkOut" })
  // Where the stay ends for pricing and the calendar window: the arrival day
  // itself (zero nights) until a departure is picked.
  const stayEnd = checkOut ?? checkIn
  const guests = useWatch({ control, name: "guests" })

  const [activeField, setActiveField] = useState<ActiveField>(null)
  // Day under the pointer while the departure is being picked, so the stay
  // can be previewed before the click that sets it.
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [viewMonth, setViewMonth] = useState<Date>(() => firstOfMonth(today))

  const [submitted, setSubmitted] = useState(false)
  const [topLevelError, setTopLevelError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { mutate: createBooking, isPending } = useCreateBooking({
    mutation: {
      onSuccess: () => {
        setSubmitted(true)
        setTopLevelError(null)
        void queryClient.invalidateQueries({
          queryKey: ["/api/villas", villaSlug, "availability"],
        })
      },
      onError: (err) => {
        const code = err instanceof ApiError ? err.code : undefined
        if (err instanceof ApiError && code === "VALIDATION") {
          for (const { field, type, message } of parseValidationMessage(err.message)) {
            setError(field, { type, message })
          }
          setTopLevelError(null)
          return
        }
        setTopLevelError(topLevelErrorMessage(code ?? ""))
      },
    },
  })

  const {
    nightSets,
    nightPricesByDate,
    baseNightlyCents,
    nights,
    nightsSubtotal,
    cleaningFee,
    conciergeFee,
    total,
    priceBreakdown,
  } = useVillaBookingPricing({
    villaSlug,
    fallbackNightlyEuros: booking.nightly,
    viewMonth,
    checkIn,
    stayEnd,
    calendarOpen: activeField !== null,
  })

  // Computed from approved reviews — the same figures the reviews section
  // further down the page shows. Null until a review is approved, in which case
  // the panel shows the rate alone rather than a rating no guest ever gave.
  const publishedRating = usePublishedRating(villaSlug)

  const priceCentsFor = (date: Date): number =>
    nightPricesByDate.get(dayKey(date)) ?? baseNightlyCents

  const fieldsRef = useMemo(
    () =>
      dismissOnOutsideMouseDown(() => {
        setActiveField(null)
      }),
    [],
  )

  // Whether `date` can end the stay being picked. Its own night may be held —
  // that is the next guest arriving the same afternoon.
  const canDepartOn = (date: Date) =>
    activeField === "out" && date > checkIn && isStayFree(nightSets, checkIn, date)

  const pickDate = (date: Date) => {
    if (canDepartOn(date)) {
      setValue("checkOut", date, { shouldDirty: true })
      setActiveField(null)
      setHoverDate(null)
      return
    }
    // Anything else starts a new stay, which needs its first night free. The
    // departure is cleared: the guest picks it next, with a live preview.
    if (isUnavailable(nightSets, date) || date < today) {
      return
    }
    setValue("checkIn", date, { shouldDirty: true })
    setValue("checkOut", null, { shouldDirty: true })
    setActiveField("out")
  }

  const openCal = (field: "in" | "out") => {
    setActiveField(field)
    setViewMonth(firstOfMonth(field === "in" ? checkIn : stayEnd))
  }

  // While the departure is being picked, the hovered day stands in for it.
  const previewOut =
    activeField === "out" && hoverDate !== null && canDepartOn(hoverDate) ? hoverDate : null
  const shownOut = previewOut ?? checkOut

  const name = useWatch({ control, name: "name" })
  const email = useWatch({ control, name: "email" })
  const tel = useWatch({ control, name: "tel" })
  const blockReason = getBlockReason(nightSets, { checkIn, checkOut, name, email, tel })

  const onSubmit = (values: BookingFormValues) => {
    if (values.checkOut === null || blockReason !== null) {
      return
    }
    createBooking({
      data: {
        villa_slug: villaSlug,
        guest_name: values.name,
        guest_email: values.email,
        guest_phone: values.tel,
        check_in: dayKey(values.checkIn),
        check_out: dayKey(values.checkOut),
        adults: values.guests,
        children: 0,
        message: values.description,
        // The language this guest is reading the site in. It's persisted with
        // the booking so every email about it — including the approval sent
        // weeks later — is written in that language rather than in French.
        locale: getLocale(),
      },
    })
  }

  if (submitted) {
    return (
      <aside id="book" className={PANEL_CLASS}>
        <div className="text-center">
          <h3 className="font-display text-primary text-[28px] italic">
            {m.villa_booking_success_title()}
          </h3>
          <p className="text-on-surface-variant mt-3 text-[15px]">
            {m.villa_booking_success_body()}
          </p>
        </div>
      </aside>
    )
  }

  return (
    <aside id="book" className={PANEL_CLASS}>
      {/* No headline nightly rate here: a single "from" figure misread the
          stay whenever a season rule or an override applied, and the real
          per-night prices are on the calendar and in the summary below. The
          rating carries the header on its own, and the whole strip drops when
          no review is approved rather than leaving an empty rule. */}
      {publishedRating !== null && (
        <RatingStrip
          filledStars={publishedRating.filledStars}
          score={publishedRating.score}
          count={publishedRating.count}
        />
      )}

      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e)
        }}
        noValidate
      >
        <div ref={fieldsRef} className="border-outline-variant relative grid grid-cols-2 border">
          <DateTrigger
            label={m.villa_booking_check_in()}
            value={fmt(checkIn)}
            active={activeField === "in"}
            className="border-outline-variant border-r"
            onOpen={() => {
              openCal("in")
            }}
          />
          <DateTrigger
            label={m.villa_booking_check_out()}
            value={checkOut === null ? m.villa_booking_add_date() : fmt(checkOut)}
            active={activeField === "out"}
            className=""
            onOpen={() => {
              openCal("out")
            }}
          />

          {activeField !== null && (
            <VillaBookingCalendar
              viewMonth={viewMonth}
              onViewMonthChange={setViewMonth}
              onHoverChange={setHoverDate}
              checkIn={checkIn}
              shownOut={shownOut}
              previewOut={previewOut}
              today={today}
              nightSets={nightSets}
              canDepartOn={canDepartOn}
              priceCentsFor={priceCentsFor}
              onPick={pickDate}
            />
          )}
        </div>

        <GuestsField control={control} guests={guests} maxGuests={booking.maxGuests} />

        <ContactFields register={register} />

        {topLevelError !== null && (
          <p className="border-error/30 bg-error-container/20 text-error mt-3 border px-3 py-2 text-[13px]">
            {topLevelError}
          </p>
        )}

        <Button
          type="submit"
          disabled={isPending || blockReason !== null}
          className="bg-primary text-on-primary hover:bg-primary-container mt-4 inline-flex h-auto w-full items-center justify-center gap-3 rounded-none px-6 py-[18px] font-mono text-[11px] tracking-[0.28em] uppercase disabled:opacity-60"
        >
          {isPending ? m.villa_booking_request_sending() : m.villa_booking_request_book()}
          {!isPending && <ArrowRight size={12} />}
        </Button>
        {blockReason !== null && (
          <output className="text-on-surface-variant mt-2 block text-center text-[12.5px]">
            {blockReason}
          </output>
        )}
        <Button
          type="button"
          variant="outline"
          className="text-primary border-outline-variant hover:bg-surface-container-low mt-2.5 h-auto w-full rounded-none border px-6 py-4 font-mono text-[11px] tracking-[0.28em] uppercase"
        >
          {m.villa_booking_contact_host()}
        </Button>
      </form>

      {/* No total before a departure is picked: zero nights plus the fees
          would read as a price for the stay. */}
      {checkOut !== null && (
        <VillaBookingSummary
          priceBreakdown={priceBreakdown}
          nights={nights}
          nightsSubtotal={nightsSubtotal}
          cleaningFee={cleaningFee}
          conciergeFee={conciergeFee}
          total={total}
        />
      )}
      <p className="text-on-surface-variant mt-4 text-center text-xs italic">
        {m.villa_booking_no_charge_note()}
      </p>
    </aside>
  )
}
