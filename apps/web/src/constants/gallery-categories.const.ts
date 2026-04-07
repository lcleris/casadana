// apps/web/src/constants/gallery-categories.const.ts

export const GALLERY_CATEGORIES = {
  LIVING_SPACES: "Living Spaces",
  BEDROOMS: "Bedrooms",
  BATHROOMS: "Bathrooms",
  KITCHEN: "Kitchen",
  OUTDOOR: "Outdoor",
  DINING: "Dining",
  UTILITY: "Utility",
} as const;

export type GalleryCategory = keyof typeof GALLERY_CATEGORIES;

export const getCategoryLabel = (category: GalleryCategory): string => {
  return GALLERY_CATEGORIES[category];
};

export const getAllCategories = (): GalleryCategory[] => {
  return Object.keys(GALLERY_CATEGORIES) as GalleryCategory[];
};
