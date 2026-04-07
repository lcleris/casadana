import CASADANA_BATHROOM from "@/assets/casadana/bathroom.jpeg"
import CASADANA_BEDROOM_1 from "@/assets/casadana/bedroom1.jpeg"
import CASADANA_BEDROOM_2 from "@/assets/casadana/bedroom2.jpeg"
import CASADANA_BEDROOM_3 from "@/assets/casadana/bedroom3.jpeg"
import CASADANA_FRONT_1 from "@/assets/casadana/front1.jpeg"
import CASADANA_FRONT_2 from "@/assets/casadana/front2.jpeg"
import CASADANA_FRONT_3 from "@/assets/casadana/front3.jpeg"
import CASADANA_JACUZZI_1 from "@/assets/casadana/jacuzzi1.jpeg"
import CASADANA_JACUZZI_2 from "@/assets/casadana/jacuzzi2.jpeg"
import CASADANA_KITCHEN_1 from "@/assets/casadana/kitchen1.jpeg"
import CASADANA_KITCHEN_2 from "@/assets/casadana/kitchen2.jpeg"
import CASADANA_LIVING_ROOM_1 from "@/assets/casadana/living_room1.jpeg"
import CASADANA_LIVING_ROOM_2 from "@/assets/casadana/living_room2.jpeg"
import CASADANA_LIVING_ROOM_3 from "@/assets/casadana/living_room3.jpeg"
import CASADANA_LIVING_ROOM_4 from "@/assets/casadana/living_room4.jpg"
import CASADANA_ROOFTOP_1 from "@/assets/casadana/rooftop1.jpeg"
import CASADANA_ROOFTOP_2 from "@/assets/casadana/rooftop2.jpeg"
import CASADANA_ROOFTOP_3 from "@/assets/casadana/rooftop3.jpeg"
import CASADANA_ROOFTOP_4 from "@/assets/casadana/rooftop4.jpeg"
import CASADANA_ROOFTOP_5 from "@/assets/casadana/rooftop5.jpeg"
import CASADANA_ROOFTOP_6 from "@/assets/casadana/rooftop6.jpeg"
import CASADANA_ROOFTOP_7 from "@/assets/casadana/rooftop7.jpeg"
import { m } from "@/paraglide/messages"

import { GalleryCategory } from "./gallery-categories.const"

// Helper function to flatten gallery images by category
function flattenGalleryByCategory(
  grouped: Record<
    string,
    Array<{
      src: string
      alt: string
      label: string
      size?: "large" | "medium" | "small"
    }>
  >,
) {
  return Object.entries(grouped).flatMap(([category, images]) =>
    images.map((img) => ({ ...img, category: category as GalleryCategory })),
  )
}

const CASADANA_GALLERY_BY_CATEGORY = {
  LIVING_SPACES: [
    {
      src: CASADANA_LIVING_ROOM_1,
      alt: m.casadana_house_living_room(),
      label: m.casadana_house_living_room(),
      size: "large" as const,
    },
    {
      src: CASADANA_LIVING_ROOM_2,
      alt: m.casadana_house_living_room(),
      label: m.casadana_house_living_room(),
      size: "medium" as const,
    },
    {
      src: CASADANA_LIVING_ROOM_3,
      alt: m.casadana_house_living_room(),
      label: m.casadana_house_living_room(),
      size: "medium" as const,
    },
    {
      src: CASADANA_LIVING_ROOM_4,
      alt: m.casadana_house_living_room(),
      label: m.casadana_house_living_room(),
      size: "small" as const,
    },
  ],
  BEDROOMS: [
    {
      src: CASADANA_BEDROOM_1,
      alt: m.casadana_house_bedroom_first(),
      label: m.casadana_house_bedroom_first(),
      size: "small" as const,
    },
    {
      src: CASADANA_BEDROOM_2,
      alt: m.casadana_house_bedroom_second(),
      label: m.casadana_house_bedroom_second(),
      size: "medium" as const,
    },
    {
      src: CASADANA_BEDROOM_3,
      alt: m.casadana_house_bedroom_first(),
      label: m.casadana_house_bedroom_first(),
      size: "small" as const,
    },
  ],
  KITCHEN: [
    {
      src: CASADANA_KITCHEN_1,
      alt: m.casadana_house_kitchen(),
      label: m.casadana_house_kitchen(),
      size: "small" as const,
    },
    {
      src: CASADANA_KITCHEN_2,
      alt: m.casadana_house_kitchen(),
      label: m.casadana_house_kitchen(),
      size: "small" as const,
    },
  ],
  BATHROOMS: [
    {
      src: CASADANA_BATHROOM,
      alt: m.casadana_house_bathroom(),
      label: m.casadana_house_bathroom(),
      size: "large" as const,
    },
  ],
  OUTDOOR: [
    {
      src: CASADANA_ROOFTOP_1,
      alt: m.casadana_house_patio(),
      label: m.casadana_house_patio(),
      size: "large" as const,
    },
    {
      src: CASADANA_ROOFTOP_2,
      alt: m.casadana_house_patio(),
      label: m.casadana_house_patio(),
      size: "medium" as const,
    },
    {
      src: CASADANA_ROOFTOP_3,
      alt: m.casadana_house_patio(),
      label: m.casadana_house_patio(),
      size: "small" as const,
    },
    {
      src: CASADANA_ROOFTOP_4,
      alt: m.casadana_house_patio(),
      label: m.casadana_house_patio(),
      size: "small" as const,
    },
    {
      src: CASADANA_ROOFTOP_5,
      alt: m.casadana_house_patio(),
      label: m.casadana_house_patio(),
      size: "small" as const,
    },
    {
      src: CASADANA_ROOFTOP_6,
      alt: m.casadana_house_patio(),
      label: m.casadana_house_patio(),
      size: "small" as const,
    },
    {
      src: CASADANA_ROOFTOP_7,
      alt: m.casadana_house_patio(),
      label: m.casadana_house_patio(),
      size: "medium" as const,
    },
    {
      src: CASADANA_JACUZZI_1,
      alt: m.casadana_house_exterior(),
      label: m.casadana_house_exterior(),
      size: "small" as const,
    },
    {
      src: CASADANA_JACUZZI_2,
      alt: m.casadana_house_exterior(),
      label: m.casadana_house_exterior(),
      size: "small" as const,
    },
    {
      src: CASADANA_FRONT_1,
      alt: m.casadana_house_exterior(),
      label: m.casadana_house_exterior(),
      size: "medium" as const,
    },
    {
      src: CASADANA_FRONT_2,
      alt: m.casadana_house_exterior(),
      label: m.casadana_house_exterior(),
      size: "small" as const,
    },
    {
      src: CASADANA_FRONT_3,
      alt: m.casadana_house_exterior(),
      label: m.casadana_house_exterior(),
      size: "small" as const,
    },
  ],
} as const

export const CASADANA_RAW_DATA = {
  title: "Casa DaNa à Los Alcazares",
  heroImageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB7Jk_RYfDTBkiYRo8JcC3MPLqL1YesIjWClrjMBWfiR1ymbgNwpa3iwnE-WqsTRXvqpcsUI7rcndKbAmq3ha6waEyoe3bjm1miFFijT-QCM3-bppMERzZQmRZQf6kH4r9BsdsanCtzWkeOoR3WY3g7k8bsvOlTKdVs95QC0-lfDysuaEI6hFaLBS_6uQFAm6fF7Ibg_7I3qe_R96u4DSdCHmWxCHfd93KuPll8uWwAx3jIVwfNd9PguIYbv9OUo8JuUYiefYnzerg",
  description:
    "Casa DaNa is a sanctuary of curated comfort, where modern design meets the timeless rhythm of the Mediterranean. Nestled in Los Alcazares, this villa offers an unparalleled escape for those seeking both relaxation and refined adventure.",
  features: [
    { icon: "🛁", label: "Jacuzzi" },
    { icon: "📡", label: "High-speed Wifi" },
    { icon: "🔥", label: "Summer BBQ" },
    { icon: "❄️", label: "Central AC" },
    { icon: "☀️", label: "Solarium" },
    { icon: "🅿️", label: "Private Parking" },
    { icon: "🛏️", label: "Premium Linens" },
    { icon: "🌊", label: "Beach Front" },
  ],
  galleryImages: flattenGalleryByCategory(CASADANA_GALLERY_BY_CATEGORY),
  experiences: [
    {
      icon: "🏎️",
      title: "Go-Karts",
      description: "Professional tracks for the ultimate adrenaline rush just minutes away.",
    },
    {
      icon: "🏄",
      title: "Windsurfing",
      description: "Harness the coastal breeze on the calm, safe waters of the inland sea.",
    },
    {
      icon: "🏊",
      title: "Water Park",
      description: "Perfect family day out with slides and wave pools nearby.",
    },
    {
      icon: "🚣",
      title: "Kayaking",
      description: "Explore hidden coves and silent coastlines at your own pace.",
    },
  ],
  localArea: {
    title: "Explore the",
    subtitle: "Murcian Spirit",
    description:
      "Los Alcazares is more than a destination; it's a sensory experience. From the therapeutic waters of the Mar Menor to the hidden thermal springs of Archena, discover a region where history and wellness converge.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsVIVz7DY-4B2qJz_GlzzyG-2bLId1yu6c4LyB7qofTR_sXVICDPB8KPpYqYxzviN0Vclcx2u4MY_RzET_ofpiiwM6SSI-OPVmS-NaIvK-Z9qMT42f5yQvo0bZiWib7RDqqrkKsxVUxQBhdlsn6JlK8Knib20GQ1Gw8n_FI2KWS1htUKehxLOA1-cb3LI8Jiv5XOCGEbTR9x-PfiWJyQfAsm73yap5ifYBpC6u23vkq3mLFWd0dvlYa1eNHv42gd6VHRPA7mQrkpA",
    overlapImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBoORiaCIpf3QObvlsyg_0CjnwDCeoRjBWP8Nz46fAJ0RmwPo7Y6_s-G_6tfxCiW9CRSxwL4qRKErrr1TcclPS1_sfejoy0blkt2fQgLeFcElfsQTO0VRnrDuil_USxHDK5fSIhNbTmvuZJxg6ox932PpMWpGK5_Qdsv71bPJKtGYu1rfSNgVjhLOT9W5ZCUbPTwDXcfEQwDft6HBngxAnbU6KavojsVpg0FqnUf3O3hNb2-aso8jj0zSl2PFqhrzbF5UBrbcCDm3c",
    points: [
      {
        icon: "📍",
        title: "Los Alcazares",
        description: "Walk through Roman ruins and enjoy world-class coastal dining.",
      },
      {
        icon: "🧖",
        title: "Archena Spa",
        description: "A 40-minute drive to the famous Balneario de Archena thermal baths.",
      },
    ],
  },
}
