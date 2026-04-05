interface GalleryImage {
  src: string
  alt: string
  label: string
  size?: "large" | "medium" | "small"
}

interface VillaGalleryProps {
  images: Array<GalleryImage>
  title: string
  description: string
}

function VillaGallery({ images, title, description }: VillaGalleryProps) {
  return (
    <section className="py-24 bg-surface-container-low overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-headline text-4xl text-primary mb-4 italic">{title}</h2>
            <div className="h-1 w-24 bg-secondary"></div>
          </div>
          <p className="hidden md:block text-on-surface-variant max-w-sm">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {images.map((image, index) => {
            const sizeClasses: Record<string, string> = {
              large: "md:col-span-8 h-[500px]",
              medium: "md:col-span-6 h-[400px]",
              small: "md:col-span-4 h-[400px]",
            }

            const colClass = sizeClasses[image.size || "large"]

            return (
              <div key={index} className={`${colClass} overflow-hidden group relative`}>
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={image.src}
                  alt={image.alt}
                />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <span className="text-xs uppercase tracking-widest">{image.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default VillaGallery
