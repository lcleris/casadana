import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { m } from "@/paraglide/messages"

import { Field, FieldLabel } from "../ui/field"
import {
  SelectContent,
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

interface BookingFormProps {
  onSubmit?: (formData: FormData) => void
}

export default function BookingForm({ onSubmit }: BookingFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit?.(formData)
  }

  return (
    <div className="sticky top-32 rounded-xl p-10 shadow-[0_20px_40px_-10px_rgba(0,38,53,0.08)]">
      <h3 className="font-headline text-primary mb-6 text-2xl">Reservation et Contact</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="sticky top-32 space-y-8">
          <div className="bg-surface-container-lowest border-outline-variant/10 border p-8 shadow-[0_40px_80px_-20px_rgba(0,38,53,0.12)]">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="font-headline text-primary text-3xl">$1,850</span>
                <span className="text-on-surface-variant font-body text-sm"> / night</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-outline-variant grid grid-cols-2 border">
                <Button variant="ghost" className="space-y-1 border-r py-6">
                  <label className="font-label text-on-surface-variant block text-[10px] tracking-[0.2em] uppercase">
                    Check In
                  </label>
                </Button>
                <Button variant="ghost" className="space-y-1 py-6">
                  <label className="font-label text-on-surface-variant block text-[10px] tracking-[0.2em] uppercase">
                    Check Out
                  </label>
                </Button>
              </div>
              <Field className="border-outline-variant space-y-1 border p-3">
                <FieldLabel className="font-label text-on-surface-variant block text-[10px] tracking-[0.2em] uppercase">
                  Guests
                </FieldLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={m.reservation_form_guests()} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem>{m.listing_guests({ guests: 1 })}</SelectItem>
                      <SelectItem>4 Guests</SelectItem>
                      <SelectItem>6 Guests</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Button className="bg-primary text-on-primary font-label hover:bg-primary-container w-full rounded-none py-6 text-sm tracking-[0.2em] uppercase transition-all active:scale-[0.98]">
                Check Availability
              </Button>
            </div>

            <p className="text-on-surface-variant font-body mt-6 text-center text-xs italic">
              No charge will be made yet
            </p>
            <div className="border-outline-variant/30 mt-8 space-y-4 border-t pt-8">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">4 nights x $1,850</span>
                <span className="text-primary font-medium">$7,400</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Experience concierge fee</span>
                <span className="text-primary font-medium">$250</span>
              </div>
              <div className="font-headline border-primary/10 flex justify-between border-t pt-4 text-lg">
                <span className="text-primary">Total</span>
                <span className="text-primary">$7,650</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
