import { cn } from "@/lib/utils";

interface Experience {
  icon: string;
  title: string;
  description: string;
}

interface ExperienceCardsProps {
  experiences: Array<Experience>;
}

function ExperienceCards({ experiences }: ExperienceCardsProps) {
  return (
    <section className="py-24 bg-primary text-white">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl mb-4">Unforgettable Experiences</h2>
          <p className="text-on-primary-container max-w-xl mx-auto">
            From high-speed thrills to serene maritime journeys, the Mar Menor offers activities for every soul.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={cn(
                "bg-primary-container p-6 rounded-lg group hover:bg-secondary transition-colors duration-500"
              )}
            >
              <span className="text-4xl text-secondary group-hover:text-white transition-colors">
                {exp.icon}
              </span>
              <h3 className="font-headline text-xl mt-6 mb-3">{exp.title}</h3>
              <p className="text-sm text-on-primary-container group-hover:text-white/80 transition-colors">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExperienceCards;
