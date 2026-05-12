interface VillaRibbonProps {
  phrases: Array<string>
}

export default function VillaRibbon({ phrases }: VillaRibbonProps) {
  return (
    <div className="bg-primary text-on-primary border-primary-container overflow-hidden border-t py-6 md:py-7">
      <div
        className="flex w-max items-center gap-16 whitespace-nowrap"
        style={{ animation: "marquee 50s linear infinite" }}
      >
        {[...phrases, ...phrases].map((phrase, index) => (
          <span
            key={`${phrase}-${index}`}
            className="font-display inline-flex items-center gap-16 text-xl font-light italic md:text-[26px]"
          >
            {phrase}
            <span className="text-secondary-fixed text-sm not-italic opacity-75">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
