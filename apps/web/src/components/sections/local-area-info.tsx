interface LocalPoint {
  icon: string
  title: string
  description: string
}

interface LocalAreaInfoProps {
  imageUrl: string
  overlapImageUrl: string
  title: string
  subtitle: string
  description: string
  points: Array<LocalPoint>
}

function LocalAreaInfo({
  imageUrl,
  overlapImageUrl,
  title,
  subtitle,
  description,
  points,
}: LocalAreaInfoProps) {
  return (
    <section className="py-24 px-8 max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
        <div className="relative">
          <img className="w-full aspect-[4/5] object-cover rounded-sm" src={imageUrl} alt={title} />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 border-8 border-surface hidden lg:block">
            <img className="w-full h-full object-cover" src={overlapImageUrl} alt="Detail" />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="font-headline text-5xl text-primary leading-tight">
              {title} <br />
              <span className="italic text-secondary">{subtitle}</span>
            </h2>
          </div>

          <p className="text-on-surface-variant text-lg">{description}</p>

          <div className="space-y-6">
            {points.map((point, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="h-10 w-10 flex-shrink-0 bg-secondary-container flex items-center justify-center rounded-full">
                  <span className="text-secondary">{point.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">{point.title}</h4>
                  <p className="text-sm text-on-surface-variant">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LocalAreaInfo
