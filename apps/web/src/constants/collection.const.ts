import { PropertyCardProps } from "@/components/sections/property-card";

export const properties = [
  {
    title: "Casa DaNa Los Alcazares",
    category: "Coastal Elite",
    description:
      "Experience the ultimate dialogue between architecture and nature. Casa DaNa Los Alcazares is a masterclass in coastal minimalism, featuring floor-to-ceiling glass walls that erase the boundary between life and the Mediterranean.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA706DfuYemgJfYx5wmdI79d4u3Km2gMNH83j8QpS-lqVJMs-wvOMcal8utHsRfL7NwUTQuHRegFb-AbHKDzrpD8TrQBQ1bd418QDpjyKQhtwdFvcLInMXVHJa52CtlmTgO3qikKKmgKQC0UYIBzp_tXADsERb9L4tjKTX_lYims-krtximtA2aHvkabdt08fyA1bDBfOpYlzD90pn0_4xcAJ5XPPcw_JIcw4i51wzeHzZhq-yYOkllSK8GtENgOEsMY1opHSqgFQQ",
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
    title: "Casa DaNa Vue sur la Ville",
    category: "Urban Luxury",
    description:
      "Perched above the vibrant city lights, this residence offers an unparalleled urban sanctuary. The sprawling rooftop terrace provides a 360-degree theater of the skyline.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCShyEQx9lwNClBxNJkIX1laZiooMbghbgutbtqPQ2qdTivVVvBxC2s_tMXyfnjsBkPE_DAu_XAfF5YmE3yGL_S-1ZXdbta0mQsc3mAp5bkeZMmhDys-8FKJ27KImhEQSmTmrpHl2wMrrUbejWslMZPpD33jQ_DNeAkN3ukMHWO-dToFldYRZkcC0N-Ca6O9BdN8ALIJNRj-9MwazRlc-JD-hC_M8W15as40GmTYXFfwj-3MPA8qZTXL58SVXUSFBfwvRx27bUS7k0",
    features: [
      { icon: "👥", label: "8 GUESTS" },
      { icon: "🛏️", label: "4 BEDROOMS" },
      { icon: "🛁", label: "Rooftop Jacuzzi" },
    ],
    imageAlt: "Casa DaNa Vue sur la Ville",
    layout: "right",
  },
] satisfies Array<PropertyCardProps>;
