import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const CollectionPage = () => {
  const navigate = useNavigate();

  const handleVillaNavigate = (villaId: string) => {
    navigate({ to: `/villa/${villaId}` });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="max-w-screen-2xl mx-auto px-8 pt-12 pb-12 text-center">
          <span className="font-label text-secondary uppercase tracking-[0.3em] text-xs mb-4 block">
            The Collection
          </span>
          <h1 className="font-headline text-5xl md:text-7xl text-primary leading-tight mb-6">
            Editorial Living <br />
            <span className="italic font-normal">by the shore.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-on-surface-variant font-light text-lg">
            Curated coastal escapes designed for the modern aesthete. Explore our signature residences.
          </p>
        </section>

        {/* Property 1: Los Alcazares */}
        <section className="relative min-h-[700px] flex flex-col items-center justify-center py-20 overflow-hidden">
          <div className="max-w-screen-2xl w-full mx-auto px-8 grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 relative group">
              <div className="aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-lg editorial-shadow">
                <img
                  alt="Luxury seaside villa"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA706DfuYemgJfYx5wmdI79d4u3Km2gMNH83j8QpS-lqVJMs-wvOMcal8utHsRfL7NwUTQuHRegFb-AbHKDzrpD8TrQBQ1bd418QDpjyKQhtwdFvcLInMXVHJa52CtlmTgO3qikKKmgKQC0UYIBzp_tXADsERb9L4tjKTX_lYims-krtximtA2aHvkabdt08fyA1bDBfOpYlzD90pn0_4xcAJ5XPPcw_JIcw4i51wzeHzZhq-yYOkllSK8GtENgOEsMY1opHSqgFQQ"
                />
              </div>
            </div>

            <div className="md:col-span-5 space-y-8 md:pl-8">
              <div className="space-y-4">
                <span className="inline-flex items-center px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
                  Coastal Elite
                </span>
                <h2 className="font-headline text-4xl md:text-5xl text-primary leading-tight">
                  Casa DaNa Los Alcazares
                </h2>
              </div>

              <div className="flex flex-wrap gap-8 py-6 border-y border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <span className="text-secondary">👥</span>
                  <span className="font-label text-sm tracking-wider">8 GUESTS</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-secondary">🏖️</span>
                  <span className="font-label text-sm tracking-wider uppercase">Beach Front</span>
                </div>
              </div>

              <p className="text-on-surface-variant leading-relaxed font-light">
                Experience the ultimate dialogue between architecture and nature. Casa DaNa Los Alcazares is a masterclass
                in coastal minimalism, featuring floor-to-ceiling glass walls that erase the boundary between life and the
                Mediterranean.
              </p>

              <Button
                onClick={() => handleVillaNavigate("alcazares")}
                className="w-full md:w-auto bg-primary text-on-primary hover:opacity-90 flex items-center justify-center gap-2"
              >
                Découvrir cette propriété
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </section>

        <div className="h-px bg-surface-container-high max-w-screen-xl mx-auto"></div>

        {/* Property 2: Vue sur la Ville */}
        <section className="relative min-h-[700px] flex flex-col items-center justify-center py-20 bg-surface-container-low">
          <div className="max-w-screen-2xl w-full mx-auto px-8 grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 order-2 md:order-1 space-y-8 md:pr-8">
              <div className="space-y-4">
                <span className="inline-flex items-center px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
                  Urban Luxury
                </span>
                <h2 className="font-headline text-4xl md:text-5xl text-primary leading-tight">
                  Casa DaNa Vue sur la Ville
                </h2>
              </div>

              <div className="flex flex-wrap gap-8 py-6 border-y border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <span>👥</span>
                  <span className="font-label text-sm tracking-wider">8 GUESTS</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>🛏️</span>
                  <span className="font-label text-sm tracking-wider">4 BEDROOMS</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>🛁</span>
                  <span className="font-label text-sm tracking-wider uppercase">Rooftop Jacuzzi</span>
                </div>
              </div>

              <p className="text-on-surface-variant leading-relaxed font-light">
                Perched above the vibrant city lights, this residence offers an unparalleled urban sanctuary. The sprawling
                rooftop terrace provides a 360-degree theater of the skyline.
              </p>

              <Button className="w-full md:w-auto bg-primary text-on-primary hover:opacity-90 flex items-center justify-center gap-2">
                Découvrir cette propriété
                <ChevronRight size={18} />
              </Button>
            </div>

            <div className="md:col-span-7 order-1 md:order-2 relative group">
              <div className="aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-lg editorial-shadow">
                <img
                  alt="Luxury city villa with rooftop"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCShyEQx9lwNClBxNJkIX1laZiooMbghbgutbtqPQ2qdTivVVvBxC2s_tMXyfnjsBkPE_DAu_XAfF5YmE3yGL_S-1ZXdbta0mQsc3mAp5bkeZMmhDys-8FKJ27KImhEQSmTmrpHl2wMrrUbejWslMZPpD33jQ_DNeAkN3ukMHWO-dToFldYRZkcC0N-Ca6O9BdN8ALIJNRj-9MwazRlc-JD-hC_M8W15as40GmTYXFfwj-3MPA8qZTXL58SVXUSFBfwvRx27bUS7k0"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CollectionPage;
