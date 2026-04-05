import { cn } from "@/lib/utils"

interface Experience {
  icon: string
  title: string
  description: string
}

interface ExperienceCardsProps {
  experiences: Array<Experience>
}

function ExperienceCards({ experiences }: ExperienceCardsProps) {
  return (
    <section className="bg-primary py-24 text-white">
      <div className="mx-auto max-w-screen-2xl px-8">
        <div className="mb-16 text-center">
          <h2 className="font-headline mb-4 text-4xl">Unforgettable Experiences</h2>
          <p className="text-on-primary-container mx-auto max-w-xl">
            From high-speed thrills to serene maritime journeys, the Mar Menor offers activities for
            every soul.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={cn(
                "bg-primary-container group hover:bg-secondary rounded-lg p-6 transition-colors duration-500",
              )}
            >
              <span className="text-secondary text-4xl transition-colors group-hover:text-white">
                {exp.icon}
              </span>
              <h3 className="font-headline mt-6 mb-3 text-xl">{exp.title}</h3>
              <p className="text-on-primary-container text-sm transition-colors group-hover:text-white/80">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExperienceCards
