import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BookingFormProps {
  onSubmit?: (formData: FormData) => void
}

function BookingForm({ onSubmit }: BookingFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit?.(formData)
  }

  return (
    <div className="bg-surface-container-low p-10 rounded-xl shadow-[0_20px_40px_-10px_rgba(0,38,53,0.08)] sticky top-32">
      <h3 className="font-headline text-2xl text-primary mb-6">Reservation et Contact</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Check-in
            </label>
            <Input type="date" name="checkIn" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Check-out
            </label>
            <Input type="date" name="checkOut" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Guests
          </label>
          <select className="w-full bg-surface-container-lowest border border-outline rounded-md px-4 py-3 focus:ring-2 focus:ring-secondary text-sm">
            <option>2 Adults</option>
            <option>4 Adults</option>
            <option>Family (Up to 8)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Full Name
          </label>
          <Input type="text" name="fullName" placeholder="Your Name" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Message
          </label>
          <textarea
            name="message"
            placeholder="How can we help you plan your stay?"
            rows={4}
            className="w-full bg-surface-container-lowest border border-outline rounded-md px-4 py-3 focus:ring-2 focus:ring-secondary text-sm"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-on-primary py-4 font-semibold tracking-wide hover:opacity-90"
        >
          Check Availability
        </Button>
      </form>
    </div>
  )
}

export default BookingForm
