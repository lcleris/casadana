import { ArrowRight, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { VillaData } from "@/constants/villas.const"
import { cn } from "@/lib/utils"

interface VillaBookingProps {
  booking: VillaData["booking"]
}

interface BookingFormValues {
  checkIn: Date
  checkOut: Date
  guests: number
  email: string
  tel: string
  description: string
}

const DAYS_OF_WEEK = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

function fmt(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function fmtMonth(date: Date) {
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

function dateOnly(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1)
}

export default function VillaBooking({ booking }: VillaBookingProps) {
  const { control, register, handleSubmit, watch, setValue } = useForm<BookingFormValues>({
    defaultValues: {
      checkIn: dateOnly(booking.defaultCheckIn),
      checkOut: dateOnly(booking.defaultCheckOut),
      guests: booking.defaultGuests,
      email: "",
      tel: "",
      description: "",
    },
  })

  const checkIn = watch("checkIn")
  const checkOut = watch("checkOut")
  const guests = watch("guests")

  const [activeField, setActiveField] = useState<"in" | "out" | null>(null)
  const [viewMonth, setViewMonth] = useState<Date>(
    () => new Date(dateOnly(booking.defaultCheckIn).getFullYear(), dateOnly(booking.defaultCheckIn).getMonth(), 1),
  )
  const popRef = useRef<HTMLDivElement | null>(null)
  const ciRef = useRef<HTMLButtonElement | null>(null)
  const coRef = useRef<HTMLButtonElement | null>(null)

  const nights = nightsBetween(checkIn, checkOut)
  const subtotal = nights * booking.nightly
  const total = subtotal + booking.cleaning + booking.concierge

  useEffect(() => {
    if (!activeField) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        popRef.current?.contains(target) ||
        ciRef.current?.contains(target) ||
        coRef.current?.contains(target)
      ) {
        return
      }
      setActiveField(null)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [activeField])

  const cells = useMemo(() => {
    const y = viewMonth.getFullYear()
    const m = viewMonth.getMonth()
    const first = new Date(y, m, 1)
    const startDow = (first.getDay() + 6) % 7
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const prevDays = new Date(y, m, 0).getDate()

    const out: Array<{ d: number; muted: boolean; date?: Date }> = []
    for (let i = startDow; i > 0; i--) {
      out.push({ d: prevDays - i + 1, muted: true })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      out.push({ d, muted: false, date: new Date(y, m, d) })
    }
    return out
  }, [viewMonth])

  const pickDate = (date: Date) => {
    if (activeField === "in" || date < checkIn) {
      setValue("checkIn", date, { shouldDirty: true })
      if (checkOut <= date) {
        setValue("checkOut", new Date(date.getTime() + 7 * 86_400_000), { shouldDirty: true })
      }
      setActiveField("out")
    } else {
      setValue("checkOut", date, { shouldDirty: true })
      setActiveField(null)
    }
  }

  const openCal = (field: "in" | "out") => {
    setActiveField(field)
    const target = field === "in" ? checkIn : checkOut
    setViewMonth(new Date(target.getFullYear(), target.getMonth(), 1))
  }

  const onSubmit = (values: BookingFormValues) => {
    console.log("booking request", values)
  }

  const inputClassName =
    "text-primary placeholder:text-on-surface-variant/50 mt-1 h-auto w-full rounded-none border-0 bg-transparent px-0 py-0 text-[15px] shadow-none focus-visible:border-0 focus-visible:ring-0 md:text-[15px]"

  return (
    <aside
      id="book"
      className="bg-background border-outline-variant editorial-shadow border p-6 md:sticky md:top-28 md:p-8"
    >
      <div className="border-outline-variant mb-6 flex items-baseline justify-between gap-4 border-b pb-6">
        <div className="font-display text-primary text-[34px] leading-none font-light italic md:text-[38px]">
          €{booking.nightly}
          <small className="text-on-surface-variant ml-1 font-sans text-[13px] not-italic">
            / night
          </small>
        </div>
        <div className="flex flex-col items-end gap-1 font-mono text-[11px] tracking-[0.1em]">
          <span className="text-secondary text-[13px] tracking-[2px]">★★★★★</span>
          <span className="text-on-surface-variant">
            {booking.rating.toFixed(2)} · {booking.reviewCount} reviews
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="border-outline-variant relative grid grid-cols-2 border">
          <button
            ref={ciRef}
            type="button"
            onClick={() => openCal("in")}
            className={cn(
              "border-outline-variant hover:bg-surface-container-low block border-r bg-white px-4 py-3.5 text-left transition-colors",
              activeField === "in" && "bg-surface-container-low",
            )}
          >
            <span className="text-on-surface-variant block font-mono text-[10px] tracking-[0.22em] uppercase">
              Check-in
            </span>
            <span className="font-display text-primary mt-1 block text-[17px] italic">
              {fmt(checkIn)}
            </span>
          </button>
          <button
            ref={coRef}
            type="button"
            onClick={() => openCal("out")}
            className={cn(
              "hover:bg-surface-container-low block bg-white px-4 py-3.5 text-left transition-colors",
              activeField === "out" && "bg-surface-container-low",
            )}
          >
            <span className="text-on-surface-variant block font-mono text-[10px] tracking-[0.22em] uppercase">
              Check-out
            </span>
            <span className="font-display text-primary mt-1 block text-[17px] italic">
              {fmt(checkOut)}
            </span>
          </button>

          {activeField !== null && (
            <div
              ref={popRef}
              className="border-outline-variant editorial-shadow absolute top-[calc(100%+8px)] right-0 left-0 z-30 border bg-white p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
                  }
                  aria-label="Previous month"
                  className="border-outline-variant text-primary inline-flex h-7 w-7 items-center justify-center rounded-full border"
                >
                  <ChevronLeft size={14} />
                </button>
                <h4 className="font-display text-primary text-[17px] italic">{fmtMonth(viewMonth)}</h4>
                <button
                  type="button"
                  onClick={() =>
                    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
                  }
                  aria-label="Next month"
                  className="border-outline-variant text-primary inline-flex h-7 w-7 items-center justify-center rounded-full border"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {DAYS_OF_WEEK.map((d) => (
                  <div
                    key={d}
                    className="text-on-surface-variant py-2 text-center font-mono text-[9.5px] tracking-[0.15em] uppercase"
                  >
                    {d}
                  </div>
                ))}
                {cells.map((cell, i) => {
                  if (cell.muted || !cell.date) {
                    return (
                      <span
                        key={i}
                        className="text-outline-variant flex aspect-square cursor-default items-center justify-center text-[13px]"
                      >
                        {cell.d}
                      </span>
                    )
                  }
                  const isCI = sameDay(cell.date, checkIn)
                  const isCO = sameDay(cell.date, checkOut)
                  const inRange = cell.date > checkIn && cell.date < checkOut
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => pickDate(cell.date as Date)}
                      className={cn(
                        "text-on-surface flex aspect-square items-center justify-center text-[13px] transition-colors",
                        inRange && "bg-secondary-container text-on-secondary-container",
                        (isCI || isCO) && "bg-primary text-on-primary rounded-full",
                        !inRange && !isCI && !isCO && "hover:bg-surface-container-low",
                      )}
                    >
                      {cell.d}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <Controller
          control={control}
          name="guests"
          render={({ field }) => (
            <div className="border-outline-variant flex items-center justify-between border border-t-0 bg-white px-4 py-3.5">
              <span className="text-on-surface-variant font-mono text-[10px] tracking-[0.22em] uppercase">
                Guests
              </span>
              <span className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => field.onChange(Math.max(1, field.value - 1))}
                  aria-label="Remove guest"
                  className="border-outline-variant text-primary hover:bg-surface-container-low inline-flex h-7 w-7 items-center justify-center rounded-full border"
                >
                  <Minus size={12} />
                </button>
                <span className="font-display text-primary text-[17px] italic">
                  {guests} {guests === 1 ? "Guest" : "Guests"}
                </span>
                <button
                  type="button"
                  onClick={() => field.onChange(Math.min(booking.maxGuests, field.value + 1))}
                  aria-label="Add guest"
                  className="border-outline-variant text-primary hover:bg-surface-container-low inline-flex h-7 w-7 items-center justify-center rounded-full border"
                >
                  <Plus size={12} />
                </button>
              </span>
            </div>
          )}
        />

        <div className="border-outline-variant mt-4 grid border border-b-0 bg-white">
          <label className="border-outline-variant block border-b px-4 py-3">
            <span className="text-on-surface-variant block font-mono text-[10px] tracking-[0.22em] uppercase">
              Email
            </span>
            <Input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClassName}
              {...register("email", { required: true })}
            />
          </label>
          <label className="border-outline-variant block border-b px-4 py-3">
            <span className="text-on-surface-variant block font-mono text-[10px] tracking-[0.22em] uppercase">
              Phone
            </span>
            <Input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+33 6 12 34 56 78"
              className={inputClassName}
              {...register("tel", { required: true })}
            />
          </label>
          <label className="border-outline-variant block border-b px-4 py-3">
            <span className="text-on-surface-variant block font-mono text-[10px] tracking-[0.22em] uppercase">
              A few words about your stay
            </span>
            <Textarea
              placeholder="Occasion, arrival time, special requests…"
              rows={3}
              className="text-primary placeholder:text-on-surface-variant/50 mt-1 min-h-0 w-full resize-none rounded-none border-0 bg-transparent px-0 py-0 text-[15px] leading-relaxed shadow-none focus-visible:border-0 focus-visible:ring-0 md:text-[15px]"
              {...register("description")}
            />
          </label>
        </div>

        <Button
          type="submit"
          className="bg-primary text-on-primary hover:bg-primary-container mt-4 inline-flex h-auto w-full items-center justify-center gap-3 rounded-none px-6 py-[18px] font-mono text-[11px] tracking-[0.28em] uppercase"
        >
          Request to Book
          <ArrowRight size={12} />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="text-primary border-outline-variant hover:bg-surface-container-low mt-2.5 h-auto w-full rounded-none border px-6 py-4 font-mono text-[11px] tracking-[0.28em] uppercase"
        >
          Contact the Host
        </Button>
      </form>

      <div className="border-outline-variant mt-6 grid gap-3 border-t pt-5 text-[13.5px]">
        <div className="text-on-surface-variant flex justify-between">
          <span>
            {nights} night{nights === 1 ? "" : "s"} × €{booking.nightly}
          </span>
          <span>€{subtotal.toLocaleString()}</span>
        </div>
        <div className="text-on-surface-variant flex justify-between">
          <span>Cleaning fee</span>
          <span>€{booking.cleaning}</span>
        </div>
        <div className="text-on-surface-variant flex justify-between">
          <span>Concierge &amp; welcome</span>
          <span>€{booking.concierge}</span>
        </div>
        <div className="font-display text-primary border-outline-variant mt-1 flex justify-between border-t pt-3.5 text-[22px] italic">
          <span>Total</span>
          <span>€{total.toLocaleString()}</span>
        </div>
      </div>
      <p className="text-on-surface-variant mt-4 text-center text-xs italic">
        No charge will be made yet · 48-hour confirmation
      </p>
    </aside>
  )
}
