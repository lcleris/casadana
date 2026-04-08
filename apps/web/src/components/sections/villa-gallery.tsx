import { useState } from "react"

import { GalleryCategory } from "@/constants/gallery-categories.const"

import BentoGallery from "./bento-gallery"
import FocusGallery from "./focus-gallery"

interface GalleryImage {
  src: string
  label: string
  size?: "large" | "medium" | "small"
  category: GalleryCategory
}

interface VillaGalleryProps {
  images: Array<GalleryImage>
  title: string
  description: string
}

export default function VillaGallery({ images, title, description }: VillaGalleryProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [focusedCategory, setFocusedCategory] = useState<GalleryCategory | null>(null)

  const handleImageClick = (category: GalleryCategory) => {
    setFocusedCategory(category)
    setIsFocused(true)
  }

  const handleCloseFocus = () => {
    setIsFocused(false)
    setFocusedCategory(null)
  }

  return (
    <section className="bg-surface-container-low h-full py-24">
      <div className="mx-auto max-w-screen-2xl px-8">
        {isFocused && focusedCategory ? (
          <FocusGallery
            images={images}
            initialCategory={focusedCategory}
            onClose={handleCloseFocus}
          />
        ) : (
          <BentoGallery
            images={images}
            title={title}
            description={description}
            onImageClick={handleImageClick}
          />
        )}
      </div>
    </section>
  )
}

export type { GalleryImage, VillaGalleryProps }
