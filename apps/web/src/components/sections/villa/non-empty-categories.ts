import type { GalleryCategory } from "@/constants/gallery-categories.const"
import { GALLERY_CATEGORIES } from "@/constants/gallery-categories.const"
import type { GalleryEntry } from "@/constants/villas.const"

function isGalleryCategory(value: string): value is GalleryCategory {
  return GALLERY_CATEGORIES.some((c) => c === value)
}

/** Categories that have at least one photo, in the order the villa declares them. */
export function nonEmptyCategories(
  images: Record<GalleryCategory, Array<GalleryEntry>>,
): Array<GalleryCategory> {
  const categories: Array<GalleryCategory> = []
  for (const key of Object.keys(images)) {
    if (isGalleryCategory(key) && images[key].length > 0) {
      categories.push(key)
    }
  }
  return categories
}
