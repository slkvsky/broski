import { ArrowUpRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "../hooks/useInView.js";

export default function GewerbekundenCta() {
  const [ref, inView] = useInView();

  return (
    <section className="border-b border-line bg-bg px-6 py-16 md:px-10 md:py-20">
      <Link
        ref={ref}
        to="/gewerbekunden"
        className={`group mx-auto flex max-w-7xl flex-col items-start gap-6 rounded-2xl border border-line bg-bg-alt px-6 py-8 transition-[opacity,transform,border-color] duration-700 ease-out hover:border-accent/50 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-10 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="flex items-start gap-4 sm:items-center">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent transition-transform duration-300 ease-out group-hover:scale-110">
            <Building2 size={22} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-ink-soft">Gewerbekunden</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
              Fuhrpark, Autohaus oder Flotte?
            </h2>
            <p className="mt-2 max-w-md text-sm text-ink-soft sm:text-base">
              Individuelle Konditionen für Unternehmen - von einzelnen Fahrzeugen bis zur ganzen Flotte.
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ink px-6 py-3.5 font-display text-sm font-medium tracking-wide text-ink transition-colors duration-150 ease-out group-hover:bg-ink group-hover:text-bg sm:self-auto">
          Zu den Gewerbekunden
          <ArrowUpRight
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-[translate] duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </Link>
    </section>
  );
}
