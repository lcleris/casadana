export interface Villa {
  id: string
  name: string
  location: string
  description: string
  longDescription: string
  guests: number
  bedrooms?: number
  image: string
  gallery: Array<string>
  features: Array<Feature>
  amenities: Array<Amenity>
  price?: number
  pricePerNight?: number
  category: "coastal" | "urban" | "mountain"
}

export interface Feature {
  icon: string
  label: string
  description?: string
}

export interface Amenity {
  id: string
  name: string
  icon: string
}

export interface Experience {
  id: string
  name: string
  description: string
  icon: string
  category: string
}

export interface BookingFormData {
  checkIn: Date
  checkOut: Date
  guests: number
  fullName: string
  email?: string
  phone?: string
  specialRequests?: string
}

export interface BookingResponse {
  success: boolean
  message: string
  bookingId?: string
}
