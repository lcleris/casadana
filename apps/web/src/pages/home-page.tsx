import CtaStrip from "@/components/sections/home/cta-strip"
import HomeHero from "@/components/sections/home/home-hero"
import IntroCollection from "@/components/sections/home/intro-collection"
import MarqueeRibbon from "@/components/sections/home/marquee-ribbon"
import StoryStrip from "@/components/sections/home/story-strip"
import PropertyCard from "@/components/sections/property-card"
import { properties } from "@/constants/collection.const"

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <IntroCollection />
      {properties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
      <MarqueeRibbon />
      <StoryStrip />
      <CtaStrip />
    </>
  )
}
