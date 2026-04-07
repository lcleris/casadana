import { useNavigate } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { m } from "@/paraglide/messages"

export interface PropertyCardProps {
  id: string
  title: string
  category: string
  description: string
  imageUrl: string
  imageAlt: string
  features: Array<{
    icon: string
    label: string
  }>
  layout: "left" | "right"
}

export default function PropertyCard({
  id,
  title,
  category,
  description,
  imageUrl,
  imageAlt,
  features,
  layout = "left",
}: PropertyCardProps) {
  const navigate = useNavigate()
  return (
    <section
      className={cn(
        "relative flex min-h-175 flex-col items-center justify-center overflow-hidden py-20",
        {
          "bg-surface-container-low": layout !== "left",
        },
      )}
    >
      <div className="mx-auto grid w-full max-w-screen-2xl items-center gap-12 px-8 md:grid-cols-12">
        <div
          className={cn("group relative order-2 md:order-2 md:col-span-7", {
            "order-1": layout === "left",
          })}
        >
          <div className="editorial-shadow aspect-4/5 overflow-hidden rounded-lg md:aspect-16/10">
            <img
              alt={imageAlt}
              className="h-full w-full transform object-cover transition-transform duration-700 group-hover:scale-105"
              src={imageUrl}
            />
          </div>
        </div>

        <div
          className={cn("order-1 space-y-8 md:order-1 md:col-span-5 md:pr-8", {
            "order-2 md:order-2 md:pl-8": layout === "left",
          })}
        >
          <div className="space-y-4">
            <span className="bg-secondary-container text-on-secondary-container inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase">
              {category}
            </span>
            <h2 className="font-headline text-primary text-4xl leading-tight md:text-5xl">
              {title}
            </h2>
          </div>

          <div className="border-outline-variant/30 flex flex-wrap gap-8 border-y py-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <span>{feature.icon}</span>
                <span className="font-label text-sm tracking-wider uppercase">{feature.label}</span>
              </div>
            ))}
          </div>

          <p className="text-on-surface-variant text-justify leading-relaxed font-light">
            {description}
          </p>

          <Button
            onClick={() => navigate({ to: `/villa/${id}` })}
            className="bg-primary text-on-primary flex w-full items-center justify-center gap-2 px-4 py-6 hover:opacity-90 md:w-auto"
          >
            {m.casadana_los_alcazares_button()}
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  )
}
