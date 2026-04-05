interface VillaHeroProps {
  title: string
  imageUrl: string
  highlights: Array<{
    icon: string
    label: string
  }>
}

function VillaHero({ title, imageUrl, highlights }: VillaHeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img className="w-full h-full object-cover" src={imageUrl} alt={title} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10" />
      </div>

      <div className="relative z-10 text-center text-white px-4">
        <h1 className="font-headline text-5xl md:text-7xl mb-6 tracking-tight">{title}</h1>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 bg-primary/20 backdrop-blur-md p-8 rounded-xl max-w-4xl mx-auto">
          {highlights.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              <span className="text-xs uppercase tracking-widest font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <span className="text-white text-3xl">↓</span>
      </div>
    </section>
  )
}

export default VillaHero
