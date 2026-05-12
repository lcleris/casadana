import type { IconName } from "lucide-react/dynamic"

import BATHROOM from "@/assets/casadana/bathroom.jpeg"
import BEDROOM_1 from "@/assets/casadana/bedroom1.jpeg"
import BEDROOM_2 from "@/assets/casadana/bedroom1_1.jpeg"
import BEDROOM_3 from "@/assets/casadana/bedroom1_2.jpg"
import BEDROOM_4 from "@/assets/casadana/bedroom1_3.jpg"
import BEDROOM_5 from "@/assets/casadana/bedroom2.jpeg"
import BEDROOM_6 from "@/assets/casadana/bedroom3.jpeg"
import FRONT_1 from "@/assets/casadana/front1.jpeg"
import FRONT_2 from "@/assets/casadana/front2.jpeg"
import FRONT_3 from "@/assets/casadana/front3.jpeg"
import JACUZZI_1 from "@/assets/casadana/jacuzzi1.jpeg"
import JACUZZI_2 from "@/assets/casadana/jacuzzi2.jpeg"
import KITCHEN_1 from "@/assets/casadana/kitchen1.jpeg"
import KITCHEN_2 from "@/assets/casadana/kitchen2.jpeg"
import LIVING_1 from "@/assets/casadana/living_room1.jpeg"
import LIVING_2 from "@/assets/casadana/living_room2.jpeg"
import LIVING_3 from "@/assets/casadana/living_room3.jpeg"
import LIVING_4 from "@/assets/casadana/living_room4.jpg"
import ROOFTOP_1 from "@/assets/casadana/rooftop1.jpeg"
import ROOFTOP_3 from "@/assets/casadana/rooftop3.jpeg"
import ROOFTOP_5 from "@/assets/casadana/rooftop5.jpeg"
import ROOFTOP_7 from "@/assets/casadana/rooftop7.jpeg"
import POOL_1 from "@/assets/casadessy/pool1.jpeg"

import { GalleryCategory } from "./gallery-categories.const"

export interface GalleryEntry {
  src: string
  label: string
  category: GalleryCategory
  size: "small" | "medium" | "large"
}

export interface BentoTile {
  category: GalleryCategory
  src: string
  index: string
  label: string
  caption: string
  span: "wide" | "tall" | "half" | "third" | "quarter"
  placeholder?: boolean
  placeholderLabel?: string
}

export interface PointOfInterest {
  number: string
  title: string
  description: string
  distance: string
}

export interface ExperienceEntry {
  number: string
  tag: string
  title: string
  description: string
  location: string
  icon: "kart" | "wind" | "splash" | "kayak" | "fairway" | "olive" | "salt" | "spa"
}

export interface ReviewEntry {
  initial: string
  name: string
  meta: string
  quote: string
  source: string
  stars: number
}

export interface FaqEntry {
  question: string
  answer: string
}

export interface VillaFeature {
  icon: IconName
  label: string
}

export interface VillaStat {
  label: string
  value: string
}

export interface VillaData {
  id: "casadana" | "casacasay"
  index: string
  badge: string
  brandSub: string
  hero: {
    image: string
    eyebrow: Array<string>
    titlePrefix: string
    titleItalic: string
    titleSuffix: string
    stats: Array<VillaStat>
    price: number
    priceLabel: string
  }
  ribbon: Array<string>
  about: {
    chapter: string
    titleLead: string
    titleItalic: string
    lead: string
    body: string
    features: Array<VillaFeature>
    meta: Array<VillaStat>
  }
  booking: {
    nightly: number
    cleaning: number
    concierge: number
    rating: number
    reviewCount: number
    maxGuests: number
    defaultGuests: number
    defaultCheckIn: string
    defaultCheckOut: string
  }
  gallery: {
    chapter: string
    titleItalic: string
    titleTail: string
    description: string
    totalLabel: string
    tiles: Array<BentoTile>
    images: Record<GalleryCategory, Array<GalleryEntry>>
  }
  localArea: {
    chapter: string
    titleLead: string
    titleItalic: string
    description: string
    mainImage: string
    overlapImage?: string
    stampBig: string
    stampSmall: string
    points: Array<PointOfInterest>
  }
  experiences?: {
    chapter: string
    titleLead: string
    titleItalic: string
    description: string
    entries: Array<ExperienceEntry>
  }
  reviews: {
    chapter: string
    titleLead: string
    titleItalic: string
    description: string
    score: number
    count: number
    bars: Array<{ label: string; pct: number; value: string }>
    entries: Array<ReviewEntry>
  }
  faq?: {
    chapter: string
    titleLead: string
    titleItalic: string
    intro: string
    entries: Array<FaqEntry>
  }
  ctaStrip: {
    lead: string
    italic: string
    tail: string
    button: string
  }
  sister: {
    chapter: string
    titleLead: string
    titleItalic: string
    description: string
    button: string
    targetId: "casadana" | "casacasay"
    image: string
  }
}

const CASADANA: VillaData = {
  id: "casadana",
  index: "Villa № 01",
  badge: "Villa № 01",
  brandSub: "Los Alcázares · Est. 2021",
  hero: {
    image: ROOFTOP_7,
    eyebrow: ["Villa № 01", "37°44'N · 0°50'W", "Mar Menor · Murcia"],
    titlePrefix: "Casa ",
    titleItalic: "DaNa",
    titleSuffix: "à Los Alcázares",
    stats: [
      { label: "Sleeps", value: "Up to 6" },
      { label: "Bedrooms", value: "Three" },
      { label: "Beach", value: "1.6 km" },
      { label: "Solarium", value: "+ Jacuzzi" },
      { label: "Rating", value: "4.96 ★" },
    ],
    price: 185,
    priceLabel: "/ night · low season from",
  },
  ribbon: [
    "Mediterranean sun",
    "Roman ruins steps away",
    "Private rooftop solarium",
    "Thermal springs of Archena",
    "Calm waters of Mar Menor",
    "Slow mornings, local markets",
  ],
  about: {
    chapter: "Chapter 01 — The Villa",
    titleLead: "Refined living",
    titleItalic: "on the Mar Menor",
    lead: "A six-person Spanish casa built for slow mornings, long lunches on the rooftop, and quiet returns from the sea.",
    body: "Casa DaNa sits in a calm residential pocket of Los Alcázares, just 1.6 km from the Mediterranean's only inland sea. Three bedrooms, two terraces, a jacuzzi and a private solarium — designed for families and small groups who want the rhythm of the south without the crowds of the Costa.",
    features: [
      { icon: "bath", label: "Jacuzzi" },
      { icon: "sun", label: "Solarium" },
      { icon: "snowflake", label: "Central AC" },
      { icon: "wifi", label: "High-speed Wifi" },
      { icon: "flame", label: "Summer BBQ" },
      { icon: "car", label: "Private Parking" },
      { icon: "waves", label: "Beach Front" },
      { icon: "bed", label: "Premium Linens" },
    ],
    meta: [
      { label: "Property", value: "Detached casa" },
      { label: "Surface", value: "142 m²" },
      { label: "Stay", value: "3-night min." },
    ],
  },
  booking: {
    nightly: 185,
    cleaning: 80,
    concierge: 45,
    rating: 4.96,
    reviewCount: 87,
    maxGuests: 6,
    defaultGuests: 4,
    defaultCheckIn: "2026-07-18",
    defaultCheckOut: "2026-07-25",
  },
  gallery: {
    chapter: "Chapter 02 — Interiors",
    titleItalic: "Interior",
    titleTail: " selection",
    description:
      "Every room is designed with an editorial eye, blending local textures with quiet, modern luxury. Tap a room to explore its full gallery.",
    totalLabel: "Open the full gallery — 28 photos",
    tiles: [
      {
        category: "LIVING_SPACES",
        src: LIVING_1,
        index: "01 · Living",
        label: "01 · Living",
        caption: "The Salon",
        span: "wide",
      },
      {
        category: "BEDROOMS",
        src: BEDROOM_3,
        index: "02 · Bedrooms",
        label: "02 · Bedrooms",
        caption: "Suites & Linens",
        span: "half",
      },
      {
        category: "KITCHEN",
        src: KITCHEN_1,
        index: "03 · Kitchen",
        label: "03 · Kitchen",
        caption: "The Gourmet",
        span: "half",
      },
      {
        category: "BATHROOMS",
        src: BATHROOM,
        index: "04 · Bath",
        label: "04 · Bath",
        caption: "Spa Bathroom",
        span: "third",
      },
      {
        category: "OUTDOOR",
        src: ROOFTOP_1,
        index: "05 · Outside",
        label: "05 · Outside",
        caption: "Solarium & Jacuzzi",
        span: "wide",
      },
    ],
    images: {
      LIVING_SPACES: [
        { src: LIVING_1, label: "The Salon", category: "LIVING_SPACES", size: "large" },
        { src: LIVING_2, label: "Reading nook", category: "LIVING_SPACES", size: "small" },
        { src: LIVING_4, label: "Open plan", category: "LIVING_SPACES", size: "medium" },
        { src: LIVING_3, label: "Dining", category: "LIVING_SPACES", size: "medium" },
      ],
      BEDROOMS: [
        { src: BEDROOM_3, label: "Master suite", category: "BEDROOMS", size: "large" },
        { src: BEDROOM_2, label: "Master detail", category: "BEDROOMS", size: "small" },
        { src: BEDROOM_5, label: "Bedroom 2", category: "BEDROOMS", size: "small" },
        { src: BEDROOM_6, label: "Bedroom 3", category: "BEDROOMS", size: "medium" },
        { src: BEDROOM_1, label: "Linens", category: "BEDROOMS", size: "medium" },
        { src: BEDROOM_4, label: "Detail", category: "BEDROOMS", size: "small" },
      ],
      KITCHEN: [
        { src: KITCHEN_1, label: "The Gourmet", category: "KITCHEN", size: "large" },
        { src: KITCHEN_2, label: "Coffee corner", category: "KITCHEN", size: "medium" },
      ],
      BATHROOMS: [
        { src: BATHROOM, label: "Spa bathroom", category: "BATHROOMS", size: "large" },
      ],
      OUTDOOR: [
        { src: ROOFTOP_7, label: "Solarium at dusk", category: "OUTDOOR", size: "large" },
        { src: ROOFTOP_1, label: "Rooftop lounge", category: "OUTDOOR", size: "small" },
        { src: ROOFTOP_3, label: "Solarium", category: "OUTDOOR", size: "medium" },
        { src: ROOFTOP_5, label: "Pergola", category: "OUTDOOR", size: "medium" },
        { src: JACUZZI_1, label: "Jacuzzi", category: "OUTDOOR", size: "small" },
        { src: JACUZZI_2, label: "Jacuzzi sunset", category: "OUTDOOR", size: "medium" },
        { src: FRONT_2, label: "Front entrance", category: "OUTDOOR", size: "large" },
        { src: FRONT_1, label: "Facade", category: "OUTDOOR", size: "small" },
        { src: FRONT_3, label: "Street", category: "OUTDOOR", size: "medium" },
      ],
      DINING: [],
      UTILITY: [],
    },
  },
  localArea: {
    chapter: "Chapter 03 — The Region",
    titleLead: "Explore the",
    titleItalic: "Murcian spirit",
    description:
      "Los Alcázares is more than a destination; it's a sensory experience. From the therapeutic waters of the Mar Menor to the hidden thermal springs of Archena, this is a region where history and wellness still set the pace of the day.",
    mainImage: FRONT_2,
    overlapImage: JACUZZI_1,
    stampBig: "1.6",
    stampSmall: "km to\nMar Menor",
    points: [
      {
        number: "№ 01",
        title: "Los Alcázares old town",
        description:
          "Walk through Roman thermal ruins and the seafront promenade. Tapas bars, the Tuesday market, and salt-air mornings.",
        distance: "5 min walk · 0.4 km",
      },
      {
        number: "№ 02",
        title: "Balneario de Archena",
        description:
          "A 40-minute drive inland to the famous Roman thermal spa nestled in the Ricote Valley.",
        distance: "40 min drive · 48 km",
      },
      {
        number: "№ 03",
        title: "Cabo de Palos & La Manga",
        description:
          "Sail to the lighthouse, dive the marine reserve, dinner on the narrow strip between two seas.",
        distance: "25 min drive · 22 km",
      },
      {
        number: "№ 04",
        title: "Murcia City",
        description:
          "Baroque cathedral, the casino, late-night terraces in Plaza de las Flores.",
        distance: "30 min drive · 37 km",
      },
      {
        number: "№ 05",
        title: "Corvera Airport (RMU)",
        description: "Direct flights from London, Manchester, Paris and Brussels.",
        distance: "30 min drive · 35 km",
      },
    ],
  },
  experiences: {
    chapter: "Chapter 04 — Things to do",
    titleLead: "Unforgettable",
    titleItalic: "experiences",
    description:
      "From high-speed thrills to serene maritime journeys, the Mar Menor offers something for every soul. Our concierge will help you book any of these.",
    entries: [
      {
        number: "№ 01",
        tag: "High-octane",
        title: "Go-Karts",
        description:
          "Professional tracks for the ultimate adrenaline rush, just minutes from the villa.",
        location: "Karting Cartagena · 8 km",
        icon: "kart",
      },
      {
        number: "№ 02",
        tag: "On the water",
        title: "Windsurf",
        description:
          "Harness the coastal breeze on the calm, shallow, sailor-friendly waters of the inland sea.",
        location: "Club Náutico · 2.1 km",
        icon: "wind",
      },
      {
        number: "№ 03",
        tag: "For the family",
        title: "Water Park",
        description:
          "Slides, lazy rivers and wave pools — a perfect family day out, all under the Murcian sun.",
        location: "Aquopolis · 24 km",
        icon: "splash",
      },
      {
        number: "№ 04",
        tag: "Slow travel",
        title: "Kayaking",
        description:
          "Paddle through hidden coves and silent coastlines around the Mar Menor at your own pace.",
        location: "Playa Honda · 6 km",
        icon: "kayak",
      },
    ],
  },
  reviews: {
    chapter: "Chapter 05 — Guest stories",
    titleLead: "What guests",
    titleItalic: "remember",
    description:
      "Eighty-seven reviews across Airbnb, Booking and direct stays. We keep them all — the rooftop sunrise comes up a lot.",
    score: 4.96,
    count: 87,
    bars: [
      { label: "Cleanliness", pct: 99, value: "5.0" },
      { label: "Comfort", pct: 98, value: "4.9" },
      { label: "Location", pct: 96, value: "4.9" },
      { label: "Host", pct: 100, value: "5.0" },
      { label: "Value", pct: 94, value: "4.8" },
    ],
    entries: [
      {
        initial: "C",
        name: "Camille & Théo",
        meta: "Lyon, France · Stayed July 2025",
        quote:
          "The rooftop at sunrise alone is worth the trip — coffee, the call of the gulls, the Mar Menor turning pink. Loan thought of everything, down to the linens.",
        source: "via Airbnb · Family of 4",
        stars: 5,
      },
      {
        initial: "M",
        name: "Marta Ruiz",
        meta: "Madrid, Spain · Stayed September 2025",
        quote:
          "A real Spanish casa, not a rental box. Quiet street, perfect kitchen, and the jacuzzi was the highlight after long beach days. We'll be back off-season.",
        source: "via Booking · Couple",
        stars: 5,
      },
      {
        initial: "J",
        name: "James & Eloise",
        meta: "Bristol, UK · Stayed June 2025",
        quote:
          "Six of us, three generations. Felt like a home, not an Airbnb. The BBQ and the solarium turned every evening into something to remember.",
        source: "Direct booking · Group of 6",
        stars: 5,
      },
    ],
  },
  faq: {
    chapter: "Chapter 06 — Practical",
    titleLead: "Before",
    titleItalic: "you arrive",
    intro:
      "A few quick answers — anything else, message us directly and we'll get back within a few hours.",
    entries: [
      {
        question: "What is the minimum stay?",
        answer:
          "Three nights in low season (Oct–May) and five nights in high season (Jun–Sep). For full weeks Saturday-to-Saturday, we offer 10% off the nightly rate.",
      },
      {
        question: "How do we check in?",
        answer:
          "Self check-in from 4pm via a smart lock — we send the code 24 hours before arrival. The host or a local contact is always reachable in under 30 minutes if you need anything.",
      },
      {
        question: "Is the villa good for families with small children?",
        answer:
          "Yes — a travel cot, high chair and stair gate are provided on request at no extra cost. The Mar Menor itself is a shallow, calm inland sea, ideal for small swimmers.",
      },
      {
        question: "Can we host an event or party?",
        answer:
          "The villa is in a quiet residential street and we ask guests to keep things at speaking level after 11pm. Small gatherings (up to 8) are absolutely welcome.",
      },
      {
        question: "Do you offer airport transfers?",
        answer:
          "Yes — we work with a local driver from Corvera (RMU, 30 min) and Alicante (ALC, 1h). One-way from €45 / €95 respectively. Book through the concierge after confirmation.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "Full refund up to 30 days before arrival. 50% refund 15–30 days before. Within 14 days, the stay is non-refundable but fully reschedulable inside the next 12 months.",
      },
    ],
  },
  ctaStrip: {
    lead: "Eight days of",
    italic: "quiet sun",
    tail: " are waiting at Casa DaNa.",
    button: "Check Availability",
  },
  sister: {
    chapter: "Sister property",
    titleLead: "Or a quieter penthouse",
    titleItalic: "over the green",
    description:
      "Casa CasAy is our two-bedroom penthouse inside a gated community fifteen minutes inland — wide southern terrace, shared pool, uninterrupted views of the golf course. Same hosts, same care.",
    button: "Visit Casa CasAy",
    targetId: "casacasay",
    image: POOL_1,
  },
}

const CASACASAY: VillaData = {
  id: "casacasay",
  index: "Villa № 02",
  badge: "Villa № 02",
  brandSub: "Los Alcázares · No. 02",
  hero: {
    image: POOL_1,
    eyebrow: ["Villa № 02", "Murcia · Inland", "15 min to Mar Menor"],
    titlePrefix: "Casa ",
    titleItalic: "CasAy",
    titleSuffix: "au-dessus du green",
    stats: [
      { label: "Sleeps", value: "Up to 4" },
      { label: "Bedrooms", value: "Two" },
      { label: "Surface", value: "104 m²" },
      { label: "View", value: "Golf course" },
      { label: "Rating", value: "4.92 ★" },
    ],
    price: 145,
    priceLabel: "/ night · low season from",
  },
  ribbon: [
    "Quiet residential community",
    "Wide southern terrace",
    "Shared pool, no crowds",
    "15 min to Los Alcázares",
    "30 min to Murcia city",
    "Slow afternoons over the green",
  ],
  about: {
    chapter: "Chapter 01 — The Penthouse",
    titleLead: "A quieter",
    titleItalic: "kind of stay",
    lead: "A 104 m² penthouse with a southern terrace, designed for slow mornings, late lunches over the fairway, and full nights of sleep.",
    body: "Casa CasAy sits inside a small gated community fifteen minutes inland from Los Alcázares. Two bedrooms, a wide terrace, and an uninterrupted view of the golf course — the kind of place that suits couples, friends, and small families looking for a calmer base than the seafront.",
    features: [
      { icon: "waves-ladder", label: "Shared pool" },
      { icon: "armchair", label: "Terrace" },
      { icon: "snowflake", label: "Central AC" },
      { icon: "wifi", label: "High-speed Wifi" },
      { icon: "shield-check", label: "Gated community" },
      { icon: "car", label: "Private parking" },
      { icon: "bed", label: "Premium linens" },
      { icon: "flag", label: "Golf course view" },
    ],
    meta: [
      { label: "Property", value: "Penthouse" },
      { label: "Surface", value: "104 m²" },
      { label: "Stay", value: "3-night min." },
    ],
  },
  booking: {
    nightly: 145,
    cleaning: 60,
    concierge: 35,
    rating: 4.92,
    reviewCount: 41,
    maxGuests: 4,
    defaultGuests: 2,
    defaultCheckIn: "2026-09-12",
    defaultCheckOut: "2026-09-19",
  },
  gallery: {
    chapter: "Chapter 02 — The Rooms",
    titleItalic: "Light & space",
    titleTail: " over the green",
    description:
      "The full photoshoot is coming soon — for now, a glimpse of the terrace and the pool. Drop us a line and we'll send the rest.",
    totalLabel: "Open the full gallery",
    tiles: [
      {
        category: "OUTDOOR",
        src: POOL_1,
        index: "01 · The Pool",
        label: "01 · The Pool",
        caption: "Shared community pool",
        span: "wide",
      },
      {
        category: "OUTDOOR",
        src: "",
        index: "02 · Terrace",
        label: "02 · Terrace",
        caption: "South-facing",
        span: "third",
        placeholder: true,
        placeholderLabel: "Terrace",
      },
      {
        category: "LIVING_SPACES",
        src: "",
        index: "03 · Living",
        label: "03 · Living",
        caption: "Open-plan",
        span: "third",
        placeholder: true,
        placeholderLabel: "Living Area",
      },
      {
        category: "BEDROOMS",
        src: "",
        index: "04 · Master",
        label: "04 · Master",
        caption: "Suite",
        span: "third",
        placeholder: true,
        placeholderLabel: "Bedroom",
      },
      {
        category: "KITCHEN",
        src: "",
        index: "05 · Kitchen",
        label: "05 · Kitchen",
        caption: "Fully equipped",
        span: "third",
        placeholder: true,
        placeholderLabel: "Kitchen",
      },
    ],
    images: {
      LIVING_SPACES: [],
      BEDROOMS: [],
      KITCHEN: [],
      BATHROOMS: [],
      OUTDOOR: [{ src: POOL_1, label: "Shared community pool", category: "OUTDOOR", size: "large" }],
      DINING: [],
      UTILITY: [],
    },
  },
  localArea: {
    chapter: "Chapter 03 — The Region",
    titleLead: "Inland Murcia,",
    titleItalic: "at your pace",
    description:
      "A short drive from the salt, the village and the sea — but with the quiet of the inland valleys. Spend mornings on the terrace, drive to the Mar Menor for lunch, return for sunset over the green.",
    mainImage: POOL_1,
    stampBig: "15",
    stampSmall: "min to\nMar Menor",
    points: [
      {
        number: "№ 01",
        title: "Los Alcázares & Mar Menor",
        description:
          "The seafront village, the inland sea, our sister property Casa DaNa.",
        distance: "15 min drive · 14 km",
      },
      {
        number: "№ 02",
        title: "Murcia city",
        description:
          "Baroque cathedral, casino, late terraces in Plaza de las Flores.",
        distance: "30 min drive · 30 km",
      },
      {
        number: "№ 03",
        title: "Balneario de Archena",
        description:
          "Famous Roman thermal spa nestled in the Ricote Valley.",
        distance: "35 min drive · 40 km",
      },
      {
        number: "№ 04",
        title: "Corvera Airport (RMU)",
        description: "Direct flights from London, Manchester, Paris and Brussels.",
        distance: "20 min drive · 18 km",
      },
    ],
  },
  reviews: {
    chapter: "Chapter 04 — Guest stories",
    titleLead: "What guests",
    titleItalic: "remember",
    description:
      "Forty-one verified stays so far. The terrace at golden hour and the quiet keep coming up.",
    score: 4.92,
    count: 41,
    bars: [
      { label: "Cleanliness", pct: 98, value: "4.9" },
      { label: "Comfort", pct: 96, value: "4.8" },
      { label: "Location", pct: 94, value: "4.7" },
      { label: "Host", pct: 100, value: "5.0" },
      { label: "Value", pct: 96, value: "4.8" },
    ],
    entries: [
      {
        initial: "S",
        name: "Sophie & Marc",
        meta: "Brussels · Stayed May 2025",
        quote:
          "A real find. The terrace faces straight onto the green — coffee at sunrise, wine at sunset, no one in sight. Beautifully kept, every detail thought through.",
        source: "via Booking · Couple",
        stars: 5,
      },
      {
        initial: "H",
        name: "Hannah K.",
        meta: "London · Stayed October 2025",
        quote:
          "Quieter than we expected and exactly what we needed. Pool is calm, the community is gated, and Loan answered every question within minutes.",
        source: "via Airbnb · Family of 3",
        stars: 5,
      },
      {
        initial: "A",
        name: "Alejandro Pons",
        meta: "Valencia · Stayed July 2025",
        quote:
          "Perfect base for a golf week. Airy interiors, fast wifi, and a 15-minute drive to the Mar Menor for lunch. Already rebooked for spring.",
        source: "Direct booking · Friends",
        stars: 5,
      },
    ],
  },
  ctaStrip: {
    lead: "Slow mornings over",
    italic: "the green",
    tail: " — your week starts at Casa CasAy.",
    button: "Check Availability",
  },
  sister: {
    chapter: "Sister property",
    titleLead: "Looking for the beachfront",
    titleItalic: "casa?",
    description:
      "Casa DaNa is our six-person family casa in Los Alcázares itself — rooftop solarium, jacuzzi, and 1.6 km from the Mar Menor. Same hosts, same care.",
    button: "Visit Casa DaNa",
    targetId: "casadana",
    image: ROOFTOP_7,
  },
}

export const VILLAS: Record<"casadana" | "casacasay", VillaData> = {
  casadana: CASADANA,
  casacasay: CASACASAY,
}

export function getVilla(id: string): VillaData | null {
  if (id === "casadana" || id === "casacasay") return VILLAS[id]
  return null
}
