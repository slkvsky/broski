import { Link } from "react-router-dom";
import { useInView } from "../hooks/useInView.js";
import { FAQS } from "../data/faq.js";
import FaqAccordion from "./FaqAccordion.jsx";
import Button from "./Button.jsx";

const FEATURED_FAQS = FAQS.filter((faq) => faq.featured);

export default function Faq() {
  const [ref, inView] = useInView();

  return (
    <section id="faq" className="border-b border-line bg-bg px-6 py-24 md:px-10">
      <div
        ref={ref}
        className={`mx-auto max-w-3xl transition-[opacity,transform] duration-700 ease-out ${
          inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft">Häufige Fragen</p>
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Kurz beantwortet</h2>

        <div className="mt-10 border-t border-line">
          <FaqAccordion items={FEATURED_FAQS} inView={inView} />
        </div>

        <Button as={Link} to="/faq" variant="outline" className="mt-8">
          Alle Fragen ansehen
        </Button>
      </div>
    </section>
  );
}
