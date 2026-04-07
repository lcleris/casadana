"use client"

import { useMemo } from "react"

import { GalleryCategory } from "@/constants/gallery-categories.const"

import type { GalleryImage } from "./villa-gallery"

interface BentoGalleryProps {
  images: GalleryImage[]
  title: string
  description: string
  onImageClick: (category: GalleryCategory) => void
}

export default function BentoGallery({
  images,
  title,
  description,
  onImageClick,
}: BentoGalleryProps) {
  const bentoImages = useMemo(() => {
    const seenCategories = new Set<GalleryCategory>()
    return images.filter((image) => {
      if (seenCategories.has(image.category)) {
        return false
      }
      seenCategories.add(image.category)
      return true
    })
  }, [images])

  return (
    <div>
      <div className="mb-16 flex items-end justify-between">
        <div>
          <h2 className="font-headline text-primary mb-4 text-4xl italic">{title}</h2>
          <div className="bg-secondary h-1 w-24"></div>
        </div>
        <p className="text-on-surface-variant hidden max-w-sm md:block">{description}</p>
      </div>

      <div className="grid min-h-125 grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-12">
        {bentoImages.map((image, index) => {
          const sizeClasses: Record<string, string> = {
            large: "md:col-span-8 h-80",
            medium: "md:col-span-6 h-80",
            small: "md:col-span-4 h-80",
          }

          const colClass = sizeClasses[image.size || "large"]

          return (
            <button
              key={index}
              className={`${colClass} group relative overflow-hidden text-left transition-opacity hover:opacity-90`}
              onClick={() => onImageClick(image.category)}
              type="button"
            >
              <img
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={image.src}
                alt={image.alt}
              />
              <div className="absolute bottom-6 left-6 z-10 text-white">
                <span className="text-xs tracking-widest uppercase">{image.label}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
