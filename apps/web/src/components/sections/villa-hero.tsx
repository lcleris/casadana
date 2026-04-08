interface VillaHeroProps {
  title: string
  imageUrl: string
}

function VillaHero({ title, imageUrl }: VillaHeroProps) {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img className="h-full w-full object-cover" src={imageUrl} alt={title} />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/10" />
      </div>

      <div className="relative z-10 px-4 text-center text-white">
        <h1 className="font-headline mb-6 text-5xl tracking-wider uppercase md:text-7xl">
          {title}
        </h1>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <span className="text-3xl text-white">↓</span>
      </div>
    </section>
  )
}

export default VillaHero
