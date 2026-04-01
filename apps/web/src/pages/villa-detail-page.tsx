import { useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VillaDetailPage = () => {
  const { villaId } = useParams({ from: "/villa/$villaId" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [villaId]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7Jk_RYfDTBkiYRo8JcC3MPLqL1YesIjWClrjMBWfiR1ymbgNwpa3iwnE-WqsTRXvqpcsUI7rcndKbAmq3ha6waEyoe3bjm1miFFijT-QCM3-bppMERzZQmRZQf6kH4r9BsdsanCtzWkeOoR3WY3g7k8bsvOlTKdVs95QC0-lfDysuaEI6hFaLBS_6uQFAm6fF7Ibg_7I3qe_R96u4DSdCHmWxCHfd93KuPll8uWwAx3jIVwfNd9PguIYbv9OUo8JuUYiefYnzerg"
              alt="Villa hero"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10"></div>
          </div>

          <div className="relative z-10 text-center text-white px-4">
            <h1 className="font-headline text-5xl md:text-7xl mb-6 tracking-tight">
              Casa DaNa à {villaId}
            </h1>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 bg-primary/20 backdrop-blur-md p-8 rounded-xl max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-2">
                <span>👥</span>
                <span className="text-xs uppercase tracking-widest font-medium">8 Guests</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span>🏖️</span>
                <span className="text-xs uppercase tracking-widest font-medium">200m to Beach</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span>🏄</span>
                <span className="text-xs uppercase tracking-widest font-medium">Activities</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span>🏙️</span>
                <span className="text-xs uppercase tracking-widest font-medium">Neighborhood</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <span className="text-white text-3xl">↓</span>
          </div>
        </section>

        {/* About & Booking Section */}
        <section className="py-24 px-8 max-w-screen-2xl mx-auto" id="about">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7">
              <h2 className="font-headline text-4xl text-primary mb-8">Refined Living on the Mar Menor</h2>
              <p className="text-lg leading-relaxed text-on-surface-variant mb-12 max-w-2xl">
                Casa DaNa is a sanctuary of curated comfort, where modern design meets the timeless rhythm of the Mediterranean.
                Nestled in the region, this villa offers an unparalleled escape for those seeking both relaxation and refined
                adventure.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
                <div className="flex flex-col gap-3">
                  <span className="text-secondary text-4xl">🛁</span>
                  <span className="text-sm font-label uppercase tracking-widest font-semibold">Jacuzzi</span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-secondary text-4xl">📡</span>
                  <span className="text-sm font-label uppercase tracking-widest font-semibold">High-speed Wifi</span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-secondary text-4xl">🔥</span>
                  <span className="text-sm font-label uppercase tracking-widest font-semibold">Summer BBQ</span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-secondary text-4xl">🌊</span>
                  <span className="text-sm font-label uppercase tracking-widest font-semibold">Beach Front</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-surface-container-low p-10 rounded-xl shadow-[0_20px_40px_-10px_rgba(0,38,53,0.08)] sticky top-32" id="contact">
                <h3 className="font-headline text-2xl text-primary mb-6">Reservation et Contact</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        Check-in
                      </label>
                      <Input type="date" className="bg-surface-container-lowest border-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        Check-out
                      </label>
                      <Input type="date" className="bg-surface-container-lowest border-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Guests
                    </label>
                    <select className="w-full bg-surface-container-lowest border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-secondary text-sm">
                      <option>2 Adults</option>
                      <option>4 Adults</option>
                      <option>Family (Up to 8)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Full Name
                    </label>
                    <Input type="text" placeholder="Your Name" className="bg-surface-container-lowest border-none" />
                  </div>

                  <Button type="submit" className="w-full bg-primary text-on-primary py-4 rounded-md font-semibold tracking-wide hover:opacity-90 transition-all mt-4">
                    Check Availability
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-24 bg-surface-container-low overflow-hidden" id="villas">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="font-headline text-4xl text-primary mb-4 italic">Interior Selection</h2>
                <div className="h-1 w-24 bg-secondary"></div>
              </div>
              <p className="hidden md:block text-on-surface-variant max-w-sm">
                Every room is designed with an editorial eye, blending local textures with modern luxury.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 h-[500px] overflow-hidden group relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_qX2fpfkdkEOZFlEZP7ZtxbLI6zQ9vppZ1r6c3BhWXLttJimzGSTuAUMY1kbzDlLR2eU2ztZc0SW-zd_nhQAqU2Rl4c-8fJP4VFKmMmld_oBoiLtpUP24-e85Rz7Tcw2RdAMbIAefR4eAb68sWTsMEyy7yM_BaV5TYvNdmBMPvwOkbpc_vCn_DuTYN3cHBJ4QZJcNf7aYMRK5dcTBeHLY6ybYpV8qJ5UoUNRGC9-gOO9oh62EpWNGd9tj2RIEtlKsVWFa9uxSpfI"
                  alt="Main Salon"
                />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <span className="text-xs uppercase tracking-widest">Main Salon</span>
                </div>
              </div>

              <div className="md:col-span-4 h-[500px] overflow-hidden group relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1LSN8zsE6H85Mhr3BtxSRXe3EjNRTU2OBUDofGdAfiCgwhf8lVXUVuQbBR8ZfYW6hahj0Boh6xxW1iafoGXJTJU4z5f-gVz3Y1ZRxCcq0izzsSviKX_YzA-4CRPrS9cVRRTXOdQ5bjwqNZwzvseaWIFCtItuFZkK0bzuRrnDxr23LN8Q-ImvsBCSFEj4ybfSbRndxER8F13E04gH5prYErGIQTN-54lHHzwGsNpQyktIDmS-S6wFh8cVd0Z8J0be1U-uDOaShYCw"
                  alt="Master Suite"
                />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <span className="text-xs uppercase tracking-widest">Master Suite</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VillaDetailPage;
