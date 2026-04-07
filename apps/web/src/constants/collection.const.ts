import CASADANA_BG from "@/assets/casadana/rooftop7.jpeg"
import CASACASAY_BG from "@/assets/casadessy/pool1.jpeg"
import { PropertyCardProps } from "@/components/sections/property-card"
import { m } from "@/paraglide/messages"

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
  },
] satisfies Array<PropertyCardProps>
