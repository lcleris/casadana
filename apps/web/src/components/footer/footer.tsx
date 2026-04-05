export default function Footer() {
  const handleNavigate = (href: string) => {
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <footer className="bg-primary dark:bg-black w-full pt-20 pb-12 mt-auto">
      <div className="flex flex-col items-center gap-12 px-8 max-w-screen-2xl mx-auto text-center">
        <div className="text-white font-headline tracking-[0.3em] uppercase text-2xl">
          Casa DaNa
        </div>

        <p className="font-headline italic text-lg text-white max-w-md opacity-80">
          "Where the horizon meets curated comfort."
        </p>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <a
            className="text-slate-400 text-xs uppercase tracking-widest hover:text-secondary-fixed transition-colors"
            href="#"
          >
            Instagram
          </a>
          <a
            className="text-slate-400 text-xs uppercase tracking-widest hover:text-secondary-fixed transition-colors"
            href="#"
          >
            Facebook
          </a>
          <a
            className="text-slate-400 text-xs uppercase tracking-widest hover:text-secondary-fixed transition-colors"
            href="#"
          >
            Privacy
          </a>
          <a
            className="text-slate-400 text-xs uppercase tracking-widest hover:text-secondary-fixed transition-colors"
            href="#"
          >
            Terms
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 w-full text-slate-500 text-[10px] uppercase tracking-[0.2em]">
          © 2026 Casa DaNa. Coastal Editorial Living.
        </div>
      </div>
    </footer>
  )
}
