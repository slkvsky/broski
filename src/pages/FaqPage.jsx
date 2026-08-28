import { useEffect } from "react";
import { Link } from "react-router-dom";
import FaqAccordion from "../components/FaqAccordion.jsx";
import { FAQS } from "../data/faq.js";
import { CONTACT_EMAIL, WHATSAPP_HREF } from "../data/services.js";

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

          <div className="mt-16 border-t border-line pt-10 text-center">
            <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
              Ihre Frage war nicht dabei?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
              Schreiben Sie uns gerne direkt. Wir finden gemeinsam die passende Lösung für Ihr Fahrzeug.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-widest">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noreferrer"
                className="text-ink-soft transition-colors duration-150 hover:text-ink"
              >
                WhatsApp
              </a>
              <span className="text-ink-soft/40" aria-hidden="true">·</span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-ink-soft transition-colors duration-150 hover:text-ink"
              >
                E-Mail
              </a>
              <span className="text-ink-soft/40" aria-hidden="true">·</span>
              <Link to="/#leistungen" className="text-accent transition-colors duration-150 hover:text-ink">
                Anfrage senden
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
