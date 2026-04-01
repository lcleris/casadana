import PropertyCard from "@/components/sections/property-card";
import { properties } from "@/constants/collection.const";

export default function CollectionPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="grow pt-24">
        <section className="mx-auto max-w-screen-2xl px-8 pt-12 pb-12 text-center">
          <span className="font-label text-secondary mb-4 block text-xs tracking-[0.3em] uppercase">
            The Collection
          </span>
          <h1 className="font-headline text-primary mb-6 text-5xl leading-tight md:text-7xl">
            Editorial Living <br />
            <span className="font-normal italic">by the shore.</span>
          </h1>
          <p className="text-on-surface-variant mx-auto max-w-2xl text-lg font-light">
            Curated coastal escapes designed for the modern aesthete. Explore
            our signature residences.
          </p>
        </section>

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
      </main>
    </div>
  );
}
