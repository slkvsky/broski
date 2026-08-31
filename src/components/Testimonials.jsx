import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useInView } from "../hooks/useInView.js";

// Handwritten for now — not sourced from Google, so the section is labeled
// neutrally rather than "Google-Bewertungen". Swap this whole section for a
// live Google Places widget once real reviews are available.
const TESTIMONIALS = [
  {
    name: "Sabine K.",
    context: "BMW X3",
    text: "Die Ledersitze hatten nach Jahren richtig gelitten. Nach der Farbauffrischung sehen sie aus wie beim Neuwagenkauf — ich hätte nicht gedacht, dass das noch möglich ist.",
    featured: true,
  },
  {
    name: "Markus R.",
    context: "VW Golf GTI",
    text: "Termin per Kalkulator gemacht, zwei Tage später stand Broski mit allem Equipment direkt vor der Haustür. Kein Fahrtweg, kein Wartezimmer.",
  },
  {
    name: "Daniel T.",
    context: "Kleinflotte, 6 Fahrzeuge",
    text: "Als Autohaus brauchen wir verlässliche Termine ohne Aufwand. Sammelrechnung, fester Ansprechpartner, saubere Wagen pünktlich zur Übergabe.",
  },
  {
    name: "Julia H.",
    context: "Mini Cooper",
    text: "Die Keramikversiegelung war ihr Geld definitiv wert. Auch Monate später perlt der Regen einfach ab.",
  },
  {
    name: "Tobias W.",
    context: "Audi A4 Avant",
    text: "Motorwäsche und Innenreinigung an einem Nachmittag, direkt auf dem Firmenparkplatz. Effizienter geht's nicht.",
  },
  {
    name: "Nadine P.",
    context: "Škoda Kodiaq",
    text: "Drei Kinder, ein Hund — der Innenraum war eine Katastrophe. Die Behandlung hat den Wagen komplett gerettet.",
  },
];

function Stars({ size = 14 }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} strokeWidth={0} className="fill-accent text-accent" />
      ))}
    </div>
  );
}

function TestimonialCard({ name, context, text, featured }) {
  const cardRef = useRef(null);

  // Same cursor-spotlight technique as the Hero car photo: track the
  // pointer in percentages of the card's own box via CSS custom
  // properties, written straight to the DOM to skip a re-render per move.
  function handleMouseMove(event) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--spot-x", `${x}%`);
    el.style.setProperty("--spot-y", `${y}%`);
    el.style.setProperty("--spot-opacity", "1");
  }

  function handleMouseLeave() {
    cardRef.current?.style.setProperty("--spot-opacity", "0");
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md transition-[border-color,translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] ${
        featured ? "px-6 py-6 sm:justify-center sm:px-10 sm:py-10" : "px-6 py-6"
      }`}
    >
      {/* Cursor-follow glass sheen — only opacity is transitioned; position
          is written directly via JS, matching the Hero spotlight pattern. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[var(--spot-opacity,0)] transition-opacity duration-300 ease-out"
        style={{
          background:
            "radial-gradient(280px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(245,196,0,0.16), transparent 70%)",
        }}
      />

      <Stars size={featured ? 16 : 14} />
      <p
        className={`relative leading-relaxed text-ink ${
          featured ? "text-sm sm:font-display sm:text-xl lg:text-2xl" : "text-sm sm:text-base"
        }`}
      >
        &bdquo;{text}&ldquo;
      </p>
      <p className="relative mt-auto text-sm text-ink-soft">
        <span className="font-medium text-ink">{name}</span> · {context}
      </p>
    </div>
  );
}

const PAGE_SIZE = 1;
const PAGE_COUNT = Math.ceil(TESTIMONIALS.length / PAGE_SIZE);

function MobileCarousel({ inView }) {
  const trackRef = useRef(null);
  const [page, setPage] = useState(0);

  function updatePage() {
    const el = trackRef.current;
    if (!el) return;
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }

  function goToPage(index) {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(PAGE_COUNT - 1, index));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div
      className={`mt-10 transition-[opacity,transform] duration-[900ms] ease-smooth sm:hidden ${
        inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <div
        ref={trackRef}
        onScroll={updatePage}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto"
      >
        {TESTIMONIALS.map((testimonial) => (
          <div key={testimonial.name} className="w-full shrink-0 snap-start">
            <TestimonialCard {...testimonial} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: PAGE_COUNT }).map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                index === page ? "w-4 bg-accent" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Vorherige Bewertungen"
            disabled={page === 0}
            onClick={() => goToPage(page - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors duration-150 hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Weitere Bewertungen"
            disabled={page === PAGE_COUNT - 1}
            onClick={() => goToPage(page + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors duration-150 hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="border-b border-line bg-bg px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div
          className={`flex flex-col gap-6 transition-[opacity,transform] duration-700 ease-out sm:flex-row sm:items-end sm:justify-between ${
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft">Kundenstimmen</p>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Was unsere Kunden sagen</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-display text-4xl font-semibold text-ink sm:text-5xl">4,9</span>
            <div>
              <Stars size={14} />
              <p className="mt-1 text-xs text-ink-soft">aus 40+ Aufbereitungen</p>
            </div>
          </div>
        </div>

        {/* Desktop / tablet: full bento grid, unchanged */}
        <div className="mt-10 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`transition-[opacity,transform] duration-[900ms] ease-smooth ${
                testimonial.featured ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
              }`}
              style={{
                transitionDelay: `${index * 70}ms`,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(1.1rem)",
              }}
            >
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>

        {/* Mobile: 2-up snap carousel instead of six stacked cards */}
        <MobileCarousel inView={inView} />
      </div>
    </section>
  );
}
