import PropertyCard from "@/components/sections/property-card";
import { properties } from "@/constants/collection.const";
import bgHome from "@/assets/shared/bg-home.jpeg";

export default function HomePage() {
  return (
    <main className="grow flex min-h-screen flex-col">
      <section
        className="relative px-8 pt-24 pb-12 text-center min-h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <h1 className="font-headline text-white mb-6 text-5xl leading-tight md:text-7xl drop-shadow-lg">
            Editorial Living <br />
            <span className="font-normal italic">by the shore.</span>
          </h1>
          <p className="text-white mx-auto max-w-2xl text-lg font-light drop-shadow">
            Curated coastal escapes designed for the modern aesthete. Explore
            our signature residences.
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
  );
}
