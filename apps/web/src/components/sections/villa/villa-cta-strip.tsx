import { ArrowRight } from "lucide-react"

import type { VillaData } from "@/constants/villas.const"

interface VillaCtaStripProps {
  data: VillaData["ctaStrip"]
}

export default function VillaCtaStrip({ data }: VillaCtaStripProps) {
  return (
    <section className="bg-secondary-fixed text-on-secondary-container py-16 md:py-20">
      <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-6 md:grid-cols-[1fr_auto] md:gap-16 md:px-10">
        <h2 className="font-display m-0 text-[clamp(32px,4.4vw,52px)] leading-tight font-light tracking-[-0.02em]">
          {data.lead} <em className="italic-display">{data.italic}</em>
          {data.tail}
        </h2>
        <a
          href="#book"
          className="bg-primary text-on-primary hover:bg-primary-container inline-flex items-center justify-center gap-3 px-9 py-5 font-mono text-[11px] tracking-[0.28em] uppercase transition-colors"
        >
          {data.button}
          <ArrowRight size={12} />
        </a>
      </div>
    </section>
  )
}
