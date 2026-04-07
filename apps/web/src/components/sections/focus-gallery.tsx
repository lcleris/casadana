"use client"

import { useState, useMemo } from "react"
import { GALLERY_CATEGORIES, getCategoryLabel, GalleryCategory } from "@/constants/gallery-categories.const"
import { m } from "@/paraglide/messages"
import type { GalleryImage } from "./villa-gallery"

interface FocusGalleryProps {
  images: GalleryImage[]
  initialCategory: GalleryCategory
  onClose: () => void
}

export default function FocusGallery({
  images,
  initialCategory,
  onClose,
}: FocusGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>(initialCategory)

  // Get unique categories from images
  const availableCategories = useMemo(() => {
    const categories = new Set(images.map((img) => img.category))
    return Array.from(categories) as GalleryCategory[]
  }, [images])

  // Filter images by selected category
  const filteredImages = useMemo(() => {
    return images.filter((img) => img.category === selectedCategory)
  }, [images, selectedCategory])

  return (
    <div className="flex flex-col gap-8">
      {/* Header with chips */}
      <div className="flex items-center justify-between gap-4 flex-wrap sticky top-0 bg-surface-container-low py-4 z-20">
        <div className="flex gap-2 flex-wrap">
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${
                selectedCategory === category
                  ? "bg-primary text-on-primary"
                  : "bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80"
              }`}
              type="button"
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>

        {/* Close chip */}
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium bg-error text-on-error rounded-full hover:bg-error/90 transition-all"
          type="button"
        >
          {m.gallery_close()}
        </button>
      </div>

      {/* Scrollable bento grid */}
      <div className="min-h-[500px] overflow-y-auto pr-4">
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {filteredImages.map((image, index) => {
              const sizeClasses: Record<string, string> = {
                large: "md:col-span-8 aspect-video",
                medium: "md:col-span-6 aspect-square",
                small: "md:col-span-4 aspect-square",
              }

              const colClass = sizeClasses[image.size || "large"]

              return (
                <div
                  key={index}
                  className={`${colClass} relative overflow-hidden group`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-4 z-10 text-white">
                    <span className="text-xs tracking-widest uppercase">{image.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-on-surface-variant">
              {m.gallery_no_images()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
