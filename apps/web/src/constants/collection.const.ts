import CASADANA_BG from "@/assets/casadana/rooftop7.jpeg"
import CASACASAY_BG from "@/assets/casadessy/pool1.jpeg"
import { PropertyCardProps } from "@/components/sections/property-card"
import { m } from "@/paraglide/messages"

export const properties = [
  {
    title: "Casa DaNa Los Alcazares",
    category: "Maison",
    description: m.casadana_description(),
    imageUrl: CASADANA_BG,
    features: [
      { icon: "👥", label: "8 GUESTS" },
      { icon: "🏖️", label: "Beach Front" },
    ],
    layout: "left",
    imageAlt: "Casa DaNa Los Alcazares",
    id: "casadana",
  },
  {
    id: "casadessy",
    title: "Casa CasAy Vue sur la Ville",
    category: "Appartement",
    description: m.casacasay_description(),
    imageUrl: CASACASAY_BG,
    features: [
      { icon: "👥", label: "8 GUESTS" },
      { icon: "🛏️", label: "4 BEDROOMS" },
      { icon: "🛁", label: "Rooftop Jacuzzi" },
    ],
    imageAlt: "Casa DaNa Vue sur la Ville",
    layout: "right",
  },
] satisfies Array<PropertyCardProps>
