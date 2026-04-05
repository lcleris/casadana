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
    <section className="mx-auto max-w-screen-2xl px-8 py-24">
      <div className="grid grid-cols-1 items-center gap-24 md:grid-cols-2">
        <div className="relative">
          <img className="aspect-[4/5] w-full rounded-sm object-cover" src={imageUrl} alt={title} />
          <div className="border-surface absolute -right-12 -bottom-12 hidden h-64 w-64 border-8 lg:block">
            <img className="h-full w-full object-cover" src={overlapImageUrl} alt="Detail" />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="font-headline text-primary text-5xl leading-tight">
              {title} <br />
              <span className="text-secondary italic">{subtitle}</span>
            </h2>
          </div>

          <p className="text-on-surface-variant text-lg">{description}</p>

          <div className="space-y-6">
            {points.map((point, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-secondary-container flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                  <span className="text-secondary">{point.icon}</span>
                </div>
                <div>
                  <h4 className="text-primary font-semibold">{point.title}</h4>
                  <p className="text-on-surface-variant text-sm">{point.description}</p>
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
