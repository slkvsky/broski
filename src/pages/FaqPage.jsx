import { useEffect } from "react";
import FaqAccordion from "../components/FaqAccordion.jsx";
import { FAQS } from "../data/faq.js";

export default function FaqPage() {
  useEffect(() => {
    document.title = "Broski Detailing — Häufige Fragen";
    return () => {
      document.title = "Broski Detailing — Wuppertal";
    };
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="pt-16 md:pt-[73px]">
      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      <section className="bg-bg px-6 py-24 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft">Häufige Fragen</p>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Alle Fragen &amp; Antworten</h1>

          <div className="mt-10 border-t border-line">
            <FaqAccordion items={FAQS} />
          </div>
        </div>
      </section>
    </div>
  );
}
