import { useInView } from "../hooks/useInView.js";

/**
 * Stand-in for a not-yet-built section. Each instance owns its own
 * IntersectionObserver, created lazily on mount rather than all at once —
 * matches the pattern real sections should follow once real content lands.
 */
export default function PlaceholderSection({ id, eyebrow, title, alt = false }) {
  const [ref, inView] = useInView();

  return (
    <section
      id={id}
      className={`border-b border-line px-6 py-24 md:px-10 ${alt ? "bg-bg-alt" : "bg-bg"}`}
    >
      <div
        ref={ref}
        className={`mx-auto max-w-7xl transition-[opacity,transform] duration-700 ease-out ${
          inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft">
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          {title}
        </h2>
        <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-dashed border-line text-sm text-ink-soft">
          Platzhalter-Inhalt — folgt
        </div>
      </div>
    </section>
  );
}
