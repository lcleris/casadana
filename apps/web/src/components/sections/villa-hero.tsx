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
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img className="h-full w-full object-cover" src={imageUrl} alt={title} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10" />
      </div>

      <div className="relative z-10 px-4 text-center text-white">
        <h1 className="font-headline mb-6 text-5xl tracking-tight md:text-7xl">{title}</h1>

        <div className="bg-primary/20 mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-6 rounded-xl p-8 backdrop-blur-md md:gap-12">
          {highlights.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              <span className="text-xs font-medium tracking-widest uppercase">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <span className="text-3xl text-white">↓</span>
      </div>
    </section>
  )
}

export default VillaHero
