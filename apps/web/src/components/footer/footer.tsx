export default function Footer() {
  const handleNavigate = (href: string) => {
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <footer className="bg-primary mt-auto w-full pt-20 pb-12 dark:bg-black">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-12 px-8 text-center">
        <div className="font-headline text-2xl tracking-[0.3em] text-white uppercase">
          Casa DaNa
        </div>

        <p className="font-headline max-w-md text-lg text-white italic opacity-80">
          "Where the horizon meets curated comfort."
        </p>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <a
            className="hover:text-secondary-fixed text-xs tracking-widest text-slate-400 uppercase transition-colors"
            href="#"
          >
            Instagram
          </a>
          <a
            className="hover:text-secondary-fixed text-xs tracking-widest text-slate-400 uppercase transition-colors"
            href="#"
          >
            Facebook
          </a>
          <a
            className="hover:text-secondary-fixed text-xs tracking-widest text-slate-400 uppercase transition-colors"
            href="#"
          >
            Privacy
          </a>
          <a
            className="hover:text-secondary-fixed text-xs tracking-widest text-slate-400 uppercase transition-colors"
            href="#"
          >
            Terms
          </a>
        </div>

        <div className="mt-8 w-full border-t border-white/10 pt-8 text-[10px] tracking-[0.2em] text-slate-500 uppercase">
          © 2026 Casa DaNa. Coastal Editorial Living.
        </div>
      </div>
    </footer>
  )
}
