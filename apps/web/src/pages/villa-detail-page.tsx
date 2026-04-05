import { useParams } from "@tanstack/react-router"
import { useEffect } from "react"

import BookingForm from "@/components/forms/booking-form"
import ExperienceCards from "@/components/sections/experience-cards"
import LocalAreaInfo from "@/components/sections/local-area-info"
import VillaFeatures from "@/components/sections/villa-features"
import VillaGallery from "@/components/sections/villa-gallery"
import VillaHero from "@/components/sections/villa-hero"
import { CASADANA_RAW_DATA } from "@/constants/casadana.const"

function VillaDetailPage() {
  const { villaId } = useParams({ from: "/villa/$villaId" })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [villaId])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow">
        <VillaHero
          title={CASADANA_RAW_DATA.title}
          imageUrl={CASADANA_RAW_DATA.heroImageUrl}
          highlights={CASADANA_RAW_DATA.heroHighlights}
        />

        <section className="py-24 px-8 max-w-screen-2xl mx-auto" id="about">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7">
              <h2 className="font-headline text-4xl text-primary mb-8">
                Refined Living on the Mar Menor
              </h2>
              <p className="text-lg leading-relaxed text-on-surface-variant mb-12 max-w-2xl">
                {CASADANA_RAW_DATA.description}
              </p>
              <VillaFeatures features={CASADANA_RAW_DATA.features} />
            </div>

            <div className="lg:col-span-5">
              <BookingForm />
            </div>
          </div>
        </section>

        <VillaGallery
          images={CASADANA_RAW_DATA.galleryImages}
          title="Interior Selection"
          description="Every room is designed with an editorial eye, blending local textures with modern luxury."
        />

        <LocalAreaInfo
          title={CASADANA_RAW_DATA.localArea.title}
          subtitle={CASADANA_RAW_DATA.localArea.subtitle}
          description={CASADANA_RAW_DATA.localArea.description}
          imageUrl={CASADANA_RAW_DATA.localArea.imageUrl}
          overlapImageUrl={CASADANA_RAW_DATA.localArea.overlapImageUrl}
          points={CASADANA_RAW_DATA.localArea.points}
        />

        <ExperienceCards experiences={CASADANA_RAW_DATA.experiences} />
      </main>
    </div>
  )
}

export default VillaDetailPage
