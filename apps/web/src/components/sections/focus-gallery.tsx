"use client"

import { useState, useMemo } from "react"

import { getCategoryLabel, GalleryCategory } from "@/constants/gallery-categories.const"
import { cn } from "@/lib/utils"
import { m } from "@/paraglide/messages"

import type { GalleryImage } from "./villa-gallery"

interface FocusGalleryProps {
  images: GalleryImage[]
  initialCategory: GalleryCategory
  onClose: () => void
}

export default function FocusGallery({ images, initialCategory, onClose }: FocusGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>(initialCategory)

  const availableCategories = useMemo(() => {
    const categories = new Set(images.map((img) => img.category))
    return Array.from(categories) as GalleryCategory[]
  }, [images])

  const filteredImages = useMemo(() => {
    return images.filter((img) => img.category === selectedCategory)
  }, [images, selectedCategory])

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-surface-container-low sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap gap-2">
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                `rounded-full px-4 py-2 text-sm font-medium transition-all`,
                "bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80",
                {
                  "bg-primary text-on-primary": selectedCategory === category,
                },
              )}
              type="button"
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="bg-error text-on-error hover:bg-error/90 rounded-full px-4 py-2 text-sm font-medium transition-all"
          type="button"
        >
          {m.gallery_close()}
        </button>
      </div>

      <div className="min-h-125 pr-4">
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {filteredImages.map((image, index) => {
              const sizeClasses: Record<string, string> = {
                large: "md:col-span-8 h-96",
                medium: "md:col-span-6 h-96",
                small: "md:col-span-4 h-96",
              }

              const colClass = sizeClasses[image.size || "large"]

              return (
                <div key={index} className={`${colClass} group relative overflow-hidden`}>
                  <img
                    src={image.src}
                    alt={image.label}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-4 z-10 text-white">
                    <span className="text-xs tracking-widest uppercase">{image.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
