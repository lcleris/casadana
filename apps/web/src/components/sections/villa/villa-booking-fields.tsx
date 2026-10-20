import { Minus, Plus } from "lucide-react"
import type { Control, UseFormRegister } from "react-hook-form"
import { Controller } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { m } from "@/paraglide/messages"

import { EMAIL_PATTERN, NOT_PHONE_CHAR, PHONE_PATTERN } from "./villa-booking-utils"
import type { BookingFormValues } from "./villa-booking-utils"

const LABEL_CLASS =
  "text-on-surface-variant block font-mono text-[10px] tracking-[0.22em] uppercase"
const ROW_CLASS = "border-outline-variant block border-b px-4 py-3"
const INPUT_CLASS =
  "text-primary placeholder:text-on-surface-variant/50 mt-1 h-auto w-full rounded-none border-0 bg-transparent px-0 py-0 text-[15px] shadow-none focus-visible:border-0 focus-visible:ring-0 md:text-[15px]"
const STEP_BUTTON_CLASS =
  "border-outline-variant text-primary hover:bg-surface-container-low inline-flex h-7 w-7 items-center justify-center rounded-full border"

interface GuestsFieldProps {
  control: Control<BookingFormValues>
  guests: number
  maxGuests: number
}

export function GuestsField({ control, guests, maxGuests }: GuestsFieldProps) {
  return (
    <Controller
      control={control}
      name="guests"
      render={({ field }) => (
        <div className="border-outline-variant flex items-center justify-between border border-t-0 bg-white px-4 py-3.5">
          <span className="text-on-surface-variant font-mono text-[10px] tracking-[0.22em] uppercase">
            {m.villa_booking_guests_label()}
          </span>
          <span className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                field.onChange(Math.max(1, field.value - 1))
              }}
              aria-label={m.villa_booking_aria_remove_guest()}
              className={STEP_BUTTON_CLASS}
            >
              <Minus size={12} />
            </button>
            <span className="font-display text-primary text-[17px] italic">
              {guests}{" "}
              {guests === 1 ? m.villa_booking_guest_singular() : m.villa_booking_guest_plural()}
            </span>
            <button
              type="button"
              onClick={() => {
                field.onChange(Math.min(maxGuests, field.value + 1))
              }}
              aria-label={m.villa_booking_aria_add_guest()}
              className={STEP_BUTTON_CLASS}
            >
              <Plus size={12} />
            </button>
          </span>
        </div>
      )}
    />
  )
}

interface ContactFieldsProps {
  register: UseFormRegister<BookingFormValues>
}

export function ContactFields({ register }: ContactFieldsProps) {
  const telField = register("tel", { required: true, pattern: PHONE_PATTERN })
  return (
    <div className="border-outline-variant mt-4 grid border border-b-0 bg-white">
      <label className={ROW_CLASS}>
        <span className={LABEL_CLASS}>{m.villa_booking_name_label()}</span>
        <Input
          type="text"
          autoComplete="name"
          placeholder={m.villa_booking_name_placeholder()}
          className={INPUT_CLASS}
          {...register("name", { required: true })}
        />
      </label>
      <label className={ROW_CLASS}>
        <span className={LABEL_CLASS}>{m.villa_booking_email_label()}</span>
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={m.villa_booking_email_placeholder()}
          className={INPUT_CLASS}
          {...register("email", { required: true, pattern: EMAIL_PATTERN })}
        />
      </label>
      <label className={ROW_CLASS}>
        <span className={LABEL_CLASS}>{m.villa_booking_phone_label()}</span>
        <Input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={m.villa_booking_phone_placeholder()}
          className={INPUT_CLASS}
          {...telField}
          onChange={(e) => {
            e.target.value = e.target.value.replaceAll(NOT_PHONE_CHAR, "")
            void telField.onChange(e)
          }}
        />
      </label>
      <label className={ROW_CLASS}>
        <span className={LABEL_CLASS}>{m.villa_booking_stay_about_label()}</span>
        <Textarea
          placeholder={m.villa_booking_stay_about_placeholder()}
          rows={3}
          className="text-primary placeholder:text-on-surface-variant/50 mt-1 min-h-0 w-full resize-none rounded-none border-0 bg-transparent px-0 py-0 text-[15px] leading-relaxed shadow-none focus-visible:border-0 focus-visible:ring-0 md:text-[15px]"
          {...register("description")}
        />
      </label>
    </div>
  )
}
