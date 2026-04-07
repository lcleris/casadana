import CASADANA_BG from "@/assets/casadana/rooftop7.jpeg"
import CASADANA_LIVING_ROOM from "@/assets/casadana/living_room2.jpeg"
import CASADANA_BEDROOM from "@/assets/casadana/bedroom1_1.jpeg"
import CASADANA_KITCHEN from "@/assets/casadana/kitchen1.jpeg"
import CASADANA_BATHROOM from "@/assets/casadana/bathroom.jpeg"
import CASACASAY_BG from "@/assets/casadessy/pool1.jpeg"
import { PropertyCardProps } from "@/components/sections/property-card"
import { m } from "@/paraglide/messages"
import { GalleryCategory } from "./gallery-categories.const"

export const properties = [
  {
    title: m.casadana_full_name(),
    category: m.category_house(),
    description: m.casadana_description(),
    imageUrl: CASADANA_BG,
    features: [
      { icon: "users", label: m.listing_guests({ guests: 6 }) },
      { icon: "sun", label: m.listing_rooftop() },
      { icon: "car", label: m.listing_car() },
    ],
    layout: "left",
    imageAlt: "Casa DaNa Los Alcazares",
    id: "casadana",
    galleryImages: [
      {
        src: CASADANA_BG,
        alt: "Casa DaNa - Main Salon",
        label: "MAIN SALON",
        size: "large" as const,
        category: "LIVING_SPACES" as GalleryCategory,
      },
      {
        src: CASADANA_BEDROOM,
        alt: "Casa DaNa - Master Suite",
        label: "MASTER SUITE",
        size: "medium" as const,
        category: "BEDROOMS" as GalleryCategory,
      },
      {
        src: CASADANA_KITCHEN,
        alt: "Casa DaNa - Gourmet Kitchen",
        label: "GOURMET KITCHEN",
        size: "medium" as const,
        category: "KITCHEN" as GalleryCategory,
      },
      {
        src: CASADANA_BATHROOM,
        alt: "Casa DaNa - Spa Bathroom",
        label: "SPA BATHROOM",
        size: "large" as const,
        category: "BATHROOMS" as GalleryCategory,
      },
    ],
  },
  {
    id: "casacasay",
    title: "Casa CasAy",
    category: m.category_flat(),
    description: m.casacasay_description(),
    imageUrl: CASACASAY_BG,
    features: [
      { icon: "users", label: m.listing_guests({ guests: 4 }) },
      { icon: "sun", label: m.listing_exterior() },
      { icon: "waves-ladder", label: m.listing_pool() },
    ],
    imageAlt: "Casa DaNa Vue sur la Ville",
    layout: "right",
    galleryImages: [
      {
        src: CASACASAY_BG,
        alt: "Casa CasAy - Pool",
        label: "POOL VIEW",
        size: "large" as const,
        category: "OUTDOOR" as GalleryCategory,
      },
    ],
  },
] satisfies Array<PropertyCardProps>
