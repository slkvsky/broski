import { Star } from "lucide-react";
import { useInView } from "../hooks/useInView.js";

// Handwritten for now — not sourced from Google, so the section is labeled
// neutrally rather than "Google-Bewertungen". Swap this whole section for a
// live Google Places widget once real reviews are available.
const TESTIMONIALS = [
  {
    name: "Markus R.",
    context: "VW Golf GTI",
    text: "Termin per Kalkulator gemacht, zwei Tage später stand Broski mit allem Equipment direkt vor der Haustür. Kein Fahrtweg, kein Wartezimmer — und das Ergebnis sah aus wie neu.",
  },
  {
    name: "Sabine K.",
    context: "BMW X3",
    text: "Die Ledersitze hatten nach Jahren richtig gelitten. Nach der Farbauffrischung sehen sie aus wie beim Neuwagenkauf — ich hätte nicht gedacht, dass das noch möglich ist.",
  },
  {
    name: "Daniel T.",
    context: "Kleinflotte, 6 Fahrzeuge",
    text: "Als Autohaus brauchen wir verlässliche Termine ohne Aufwand. Sammelrechnung, fester Ansprechpartner, saubere Wagen pünktlich zur Übergabe — genau das haben wir bekommen.",
  },
  {
    name: "Julia H.",
    context: "Mini Cooper",
    text: "Die Keramikversiegelung war ihr Geld definitiv wert. Auch Monate später perlt der Regen einfach ab, und der Lack glänzt noch wie am ersten Tag.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} strokeWidth={0} className="fill-accent text-accent" />
      ))}
    </div>
  );
}

function TestimonialCard({ name, context, text }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-bg-alt px-6 py-6">
      <Stars />
      <p className="text-sm leading-relaxed text-ink sm:text-base">&bdquo;{text}&ldquo;</p>
      <p className="mt-auto text-sm text-ink-soft">
        <span className="font-medium text-ink">{name}</span> · {context}
      </p>
    </div>
  );
}

export default function Testimonials() {
  const [ref, inView] = useInView();

  return (
    <section className="border-b border-line bg-bg px-6 py-24 md:px-10">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl transition-[opacity,transform] duration-700 ease-out ${
          inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft">Kundenstimmen</p>
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Was unsere Kunden sagen</h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
