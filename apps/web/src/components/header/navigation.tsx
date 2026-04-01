import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(0,38,53,0.05)]">
      <nav className="flex justify-between items-center px-8 py-6 max-w-screen-2xl mx-auto">
        <Link to="/" className="font-headline text-2xl tracking-[0.2em] uppercase text-primary dark:text-slate-50">
          Casa DaNa
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link
            to="/"
            className="font-semibold pb-1 border-b-2 transition-colors text-primary dark:text-white border-primary hover:opacity-80"
          >
            Villas
          </Link>
          <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#experiences">
            Experiences
          </a>
          <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#about">
            About
          </a>
          <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#contact">
            Contact
          </a>
        </div>

        <Button className="bg-primary text-on-primary hover:opacity-80">Book Now</Button>
      </nav>
    </header>
  );
};

export default Navigation;
