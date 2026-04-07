import { Link } from "@tanstack/react-router"

import { m } from "@/paraglide/messages"

export default function Footer() {
  return (
    <footer className="bg-primary mt-auto w-full pt-20 pb-12 dark:bg-black">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-12 px-8 text-center">
        <div className="font-headline text-2xl tracking-[0.3em] text-white uppercase">
          {m.nav_brand()}
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <Link
            to="https://www.instagram.com/casa_dana_los_alcazares/"
            target="blank"
            className="hover:text-secondary-fixed text-xs tracking-widest text-slate-400 uppercase transition-colors"
          >
            Instagram
          </Link>
          <Link
            to="https://www.facebook.com/groups/607622748355117/"
            target="blank"
            className="hover:text-secondary-fixed text-xs tracking-widest text-slate-400 uppercase transition-colors"
          >
            Facebook
          </Link>
        </div>

        <div className="flex w-full justify-center space-x-2 border-t border-white/10 pt-8 text-[10px] tracking-[0.2em] text-slate-500 uppercase">
          <p> © 2026 Casa DaNa -</p>
          <Link to="https://github.com/TheHikuro/" target="blank" className="hover:underline">
            Loan CLERIS
          </Link>
        </div>
      </div>
    </footer>
  )
}
