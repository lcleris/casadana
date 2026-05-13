import { m } from "@/paraglide/messages"

export const GALLERY_CATEGORIES = [
  "LIVING_SPACES",
  "BEDROOMS",
  "BATHROOMS",
  "KITCHEN",
  "OUTDOOR",
  "DINING",
  "UTILITY",
] as const

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]

const CATEGORY_LABEL_FNS: Record<GalleryCategory, () => string> = {
  LIVING_SPACES: m.gallery_category_living_spaces,
  BEDROOMS: m.gallery_category_bedrooms,
  BATHROOMS: m.gallery_category_bathrooms,
  KITCHEN: m.gallery_category_kitchen,
  OUTDOOR: m.gallery_category_outdoor,
  DINING: m.gallery_category_dining,
  UTILITY: m.gallery_category_utility,
}

export const getCategoryLabel = (category: GalleryCategory): string => {
  return CATEGORY_LABEL_FNS[category]()
}

export const getAllCategories = (): Array<GalleryCategory> => {
  return [...GALLERY_CATEGORIES]
}
