import { Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { m } from "@/paraglide/messages"

import { LangSelector } from "../lang-selector"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        "bg-white/30 dark:bg-slate-950/30 backdrop-blur-lg shadow-[0_20px_40px_-10px_rgba(0,38,53,0.05)]",
        {
          "bg-white/95 dark:bg-slate-950/95 shadow-[0_20px_40px_-10px_rgba(0,38,53,0.1)]":
            isScrolled,
        },
      )}
    >
      <nav className="flex justify-between items-center px-8 py-6 max-w-screen-2xl mx-auto">
        <Link
          to="/"
          className="font-headline text-2xl tracking-[0.2em] uppercase text-primary dark:text-slate-50"
        >
          {m.nav_brand()}
        </Link>
        <LangSelector />
      </nav>
    </header>
  )
}
