import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button.jsx";
import logoMark from "../assets/logo-mark.webp";

const NAV_LINKS = [
  { label: "Leistungen", href: "/#leistungen" },
  { label: "Galerie", href: "/#galerie" },
  { label: "Über uns", href: "/#ueber-uns" },
  { label: "Kontakt", href: "/#kontakt" },
];

function MenuIcon({ open }) {
  return (
    <span className="relative flex h-3.5 w-5 flex-col justify-between">
      <span
        className={`h-px w-full bg-current transition-transform duration-200 ease-out ${
          open ? "translate-y-[6.5px] rotate-45" : ""
        }`}
      />
      <span
        className={`h-px w-full bg-current transition-transform duration-200 ease-out ${
          open ? "-translate-y-[6.5px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  // Lazy-initialized: pages without a Hero (e.g. /gewerbekunden) have
  // nothing dark behind the header to stay transparent over, so it should
  // read as solid from the first render instead of assuming a Hero exists.
  const [overHero, setOverHero] = useState(() => Boolean(document.getElementById("top")));

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;

    // Header stays transparent for as long as the Hero (dark, has its own
    // background) fills the band behind it; once Hero scrolls past, the
    // header picks up a solid background so nav text stays legible over
    // whatever lighter section follows.
    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ease-out ${
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-dark-ink/10 bg-dark-bg"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="shrink-0">
          <img src={logoMark} alt="Broski Detailing" className="h-8 w-auto md:h-9" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium uppercase tracking-[0.15em] text-dark-ink-soft transition-colors duration-150 ease-out hover:text-dark-ink"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/gewerbekunden"
            className="text-xs font-medium uppercase tracking-[0.15em] text-dark-ink-soft transition-colors duration-150 ease-out hover:text-dark-ink"
          >
            Gewerbekunden
          </Link>
          <Button as="a" href="/#kontakt" variant="primary" arrow={false} className="px-5 py-2.5 text-xs">
            Termin anfragen
          </Button>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center text-dark-ink md:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`fixed inset-0 top-[65px] z-40 flex flex-col justify-between bg-dark-bg px-6 py-10 transition-[opacity,transform] duration-300 ease-out md:hidden ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-dark-ink/10 py-4 font-display text-2xl text-dark-ink"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/gewerbekunden"
            onClick={() => setOpen(false)}
            className="border-b border-dark-ink/10 py-4 font-display text-2xl text-dark-ink"
          >
            Gewerbekunden
          </Link>
        </nav>

        <Button
          as="a"
          href="/#kontakt"
          variant="primary"
          onClick={() => setOpen(false)}
          className="w-full justify-center"
        >
          Termin anfragen
        </Button>
      </div>
    </header>
  );
}
