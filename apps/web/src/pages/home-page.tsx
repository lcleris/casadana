import bgHome from "@/assets/shared/bg-home.jpeg"
import PropertyCard from "@/components/sections/property-card"
import { properties } from "@/constants/collection.const"
import { m } from "@/paraglide/messages"

export default function HomePage() {
  return (
    <main className="flex min-h-screen grow flex-col">
      <section
        className="relative flex min-h-screen flex-col justify-center bg-cover bg-center bg-no-repeat px-8 pt-24 pb-12 text-center"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <h1 className="font-headline text-5xl leading-tight text-white drop-shadow-lg md:text-7xl">
            {m.home_title()}
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-light text-white drop-shadow">
            {m.home_subtitle()}
          </p>
        </div>
      </section>

      <section className="flex flex-col">
        {properties.map((property, index) => (
          <div key={property.title}>
            <PropertyCard
              id={property.id}
              title={property.title}
              category={property.category}
              description={property.description}
              imageUrl={property.imageUrl}
              imageAlt={property.title}
              features={property.features}
              layout={property.layout}
            />
            {index < properties.length - 1 && (
              <div className="bg-surface-container-high mx-auto h-px max-w-7xl" />
            )}
          </div>
        ))}
      </section>
    </main>
  )
}
