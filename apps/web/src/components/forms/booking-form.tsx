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
    <div className="bg-surface-container-low sticky top-32 rounded-xl p-10 shadow-[0_20px_40px_-10px_rgba(0,38,53,0.08)]">
      <h3 className="font-headline text-primary mb-6 text-2xl">Reservation et Contact</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">
              Check-in
            </label>
            <Input type="date" name="checkIn" />
          </div>
          <div className="space-y-2">
            <label className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">
              Check-out
            </label>
            <Input type="date" name="checkOut" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">
            Guests
          </label>
          <select className="bg-surface-container-lowest border-outline focus:ring-secondary w-full rounded-md border px-4 py-3 text-sm focus:ring-2">
            <option>2 Adults</option>
            <option>4 Adults</option>
            <option>Family (Up to 8)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">
            Full Name
          </label>
          <Input type="text" name="fullName" placeholder="Your Name" />
        </div>

        <div className="space-y-2">
          <label className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">
            Message
          </label>
          <textarea
            name="message"
            placeholder="How can we help you plan your stay?"
            rows={4}
            className="bg-surface-container-lowest border-outline focus:ring-secondary w-full rounded-md border px-4 py-3 text-sm focus:ring-2"
          />
        </div>

        <Button
          type="submit"
          className="bg-primary text-on-primary w-full py-4 font-semibold tracking-wide hover:opacity-90"
        >
          Check Availability
        </Button>
      </form>
    </div>
  )
}

export default BookingForm
