import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(0,38,53,0.05)]">
      <nav className="flex justify-between items-center px-8 py-6 max-w-screen-2xl mx-auto">
        <Link
          to="/"
          className="font-headline text-2xl tracking-[0.2em] uppercase text-primary dark:text-slate-50"
        >
          Casa DaNa
        </Link>

        <Button className="bg-primary text-on-primary hover:opacity-80">
          Book Now
        </Button>
      </nav>
    </header>
  );
}
