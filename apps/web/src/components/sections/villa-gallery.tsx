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
    <section className="bg-surface-container-low overflow-hidden py-24">
      <div className="mx-auto max-w-screen-2xl px-8">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <h2 className="font-headline text-primary mb-4 text-4xl italic">{title}</h2>
            <div className="bg-secondary h-1 w-24"></div>
          </div>
          <p className="text-on-surface-variant hidden max-w-sm md:block">{description}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {images.map((image, index) => {
            const sizeClasses: Record<string, string> = {
              large: "md:col-span-8 h-[500px]",
              medium: "md:col-span-6 h-[400px]",
              small: "md:col-span-4 h-[400px]",
            }

            const colClass = sizeClasses[image.size || "large"]

            return (
              <div key={index} className={`${colClass} group relative overflow-hidden`}>
                <img
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={image.src}
                  alt={image.alt}
                />
                <div className="absolute bottom-6 left-6 z-10 text-white">
                  <span className="text-xs tracking-widest uppercase">{image.label}</span>
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
