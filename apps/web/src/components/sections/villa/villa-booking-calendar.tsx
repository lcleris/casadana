import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo } from "react"

import { cn } from "@/lib/utils"
import { m } from "@/paraglide/messages"

import {
  buildCalendarCells,
  dayBackground,
  dayCellState,
  fmtMonth,
  getDaysOfWeek,
} from "./villa-booking-utils"
import type { CalendarCell, NightSets, OpenDayState } from "./villa-booking-utils"

interface MonthNavProps {
  viewMonth: Date
  onViewMonthChange: (next: Date) => void
}

function MonthNav({ viewMonth, onViewMonthChange }: MonthNavProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <button
        type="button"
        onClick={() => {
          onViewMonthChange(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
        }}
        aria-label={m.villa_booking_prev_month()}
        className="border-outline-variant text-primary inline-flex h-7 w-7 items-center justify-center rounded-full border"
      >
        <ChevronLeft size={14} />
      </button>
      <h4 className="font-display text-primary text-[17px] italic">{fmtMonth(viewMonth)}</h4>
      <button
        type="button"
        onClick={() => {
          onViewMonthChange(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
        }}
        aria-label={m.villa_booking_next_month()}
        className="border-outline-variant text-primary inline-flex h-7 w-7 items-center justify-center rounded-full border"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

function Legend() {
  return (
    <ul className="text-on-surface-variant mt-4 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[9.5px] tracking-[0.12em] uppercase">
      <li className="inline-flex items-center gap-2">
        <span
          aria-hidden
          className="size-3"
          style={{ backgroundImage: dayBackground("booked", "booked") }}
        />
        {m.villa_booking_night_booked()}
      </li>
      <li className="inline-flex items-center gap-2">
        <span
          aria-hidden
          className="size-3"
          style={{ backgroundImage: dayBackground("pending", "pending") }}
        />
        {m.villa_booking_night_pending()}
      </li>
      <li className="inline-flex items-center gap-2">
        <span
          aria-hidden
          className="border-outline-variant size-3 border"
          style={{ backgroundImage: dayBackground("booked", "free") }}
        />
        {m.villa_booking_legend_changeover()}
      </li>
    </ul>
  )
}

interface DayCellProps {
  cell: CalendarCell
  checkIn: Date
  shownOut: Date | null
  previewOut: Date | null
  today: Date
  nightSets: NightSets
  canDepartOn: (date: Date) => boolean
  priceCentsFor: (date: Date) => number
  onPick: (date: Date) => void
  onHover: (date: Date) => void
}

const OPEN_TITLE = {
  "departure-only": () => m.villa_booking_departure_only(),
  "arrival-after-departure": () => m.villa_booking_arrival_after_departure(),
}

function openTitle(title: OpenDayState["title"]): string | undefined {
  return title === "none" ? undefined : OPEN_TITLE[title]()
}

const FILL_CLASS = {
  range: "bg-secondary-container text-on-secondary-container",
  "range-preview": "bg-secondary-container/50 text-on-secondary-container",
  hover: "hover:bg-surface-container-low",
  none: undefined,
}

function DayPrice({ priceCents }: { priceCents: number }) {
  return (
    <span className="text-on-surface-variant font-mono text-[9px] leading-none">
      €{Math.round(priceCents / 100)}
    </span>
  )
}

interface DayButtonProps {
  day: number
  state: OpenDayState
  priceCents: number
  onPick: (date: Date) => void
  onHover: (date: Date) => void
}

function DayButton({ day, state, priceCents, onPick, onHover }: DayButtonProps) {
  const { date } = state
  return (
    <button
      type="button"
      title={openTitle(state.title)}
      onClick={() => {
        onPick(date)
      }}
      onMouseEnter={() => {
        onHover(date)
      }}
      style={{ backgroundImage: state.background }}
      className={cn(
        "text-on-surface flex min-h-[42px] items-center justify-center text-[13px] transition-colors",
        FILL_CLASS[state.fill],
      )}
    >
      <span
        className={cn(
          "flex flex-col items-center justify-center gap-0.5",
          state.isEdge && "bg-primary text-on-primary size-[42px] rounded-full",
          state.checkoutPreview && "bg-primary/70",
        )}
      >
        <span>{day}</span>
        {state.showPrice && <DayPrice priceCents={priceCents} />}
      </span>
    </button>
  )
}

function HeldDay({
  day,
  booked,
  background,
}: {
  day: number
  booked: boolean
  background: string | undefined
}) {
  return (
    <span
      aria-disabled="true"
      title={booked ? m.villa_booking_night_booked() : m.villa_booking_night_pending()}
      style={{ backgroundImage: background }}
      className={cn(
        "flex min-h-[42px] cursor-not-allowed items-center justify-center text-[13px]",
        booked
          ? "text-on-surface-variant/50 line-through"
          : "text-secondary decoration-secondary/60 underline decoration-dashed decoration-2 underline-offset-4",
      )}
    >
      {day}
    </span>
  )
}

function DayCell({ cell, priceCentsFor, onPick, onHover, ...rest }: DayCellProps) {
  const state = dayCellState({ date: cell.date, ...rest })
  if (state.kind === "blank") {
    return (
      <span className="text-outline-variant flex min-h-[42px] cursor-default items-center justify-center text-[13px]">
        {cell.d}
      </span>
    )
  }
  if (state.kind === "held") {
    return <HeldDay day={cell.d} booked={state.booked} background={state.background} />
  }
  return (
    <DayButton
      day={cell.d}
      state={state}
      priceCents={priceCentsFor(state.date)}
      onPick={onPick}
      onHover={onHover}
    />
  )
}

interface VillaBookingCalendarProps {
  viewMonth: Date
  onViewMonthChange: (next: Date) => void
  onHoverChange: (date: Date | null) => void
  checkIn: Date
  shownOut: Date | null
  previewOut: Date | null
  today: Date
  nightSets: NightSets
  canDepartOn: (date: Date) => boolean
  priceCentsFor: (date: Date) => number
  onPick: (date: Date) => void
}

export function VillaBookingCalendar({
  viewMonth,
  onViewMonthChange,
  onHoverChange,
  onPick,
  ...dayProps
}: VillaBookingCalendarProps) {
  const cells = useMemo(() => buildCalendarCells(viewMonth), [viewMonth])
  return (
    <div className="border-outline-variant editorial-shadow absolute top-[calc(100%+8px)] right-0 left-0 z-30 border bg-white p-5">
      <MonthNav viewMonth={viewMonth} onViewMonthChange={onViewMonthChange} />
      <div
        className="grid grid-cols-7 gap-0.5"
        onMouseLeave={() => {
          onHoverChange(null)
        }}
      >
        {getDaysOfWeek().map((d) => (
          <div
            key={d}
            className="text-on-surface-variant py-2 text-center font-mono text-[9.5px] tracking-[0.15em] uppercase"
          >
            {d}
          </div>
        ))}
        {cells.map((cell) => (
          <DayCell
            key={cell.key}
            cell={cell}
            onPick={onPick}
            onHover={onHoverChange}
            {...dayProps}
          />
        ))}
      </div>
      <Legend />
    </div>
  )
}
