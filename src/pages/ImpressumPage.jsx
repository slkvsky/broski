import { useEffect } from "react";
import { LegalSection } from "../components/LegalText.jsx";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from "../data/services.js";

export default function ImpressumPage() {
  useEffect(() => {
    document.title = "Broski Detailing — Impressum";
    return () => {
      document.title = "Broski Detailing — Wuppertal";
    };
  }, []);

  return (
    <div className="pt-16 md:pt-[73px]">
      <section className="bg-bg px-6 py-24 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft">Rechtliches</p>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Impressum</h1>

          <div className="mt-12 flex flex-col gap-8">
            <LegalSection title="Angaben gemäß § 5 TMG">
              <p>
                Mykolai Bohaichyk
                <br />
                Friedrich-Ebert-Straße 114
                <br />
                42117 Wuppertal-Elberfeld
              </p>
            </LegalSection>

            <LegalSection title="Kontakt">
              <p className="flex flex-col gap-1">
                <span>
                  Telefon:{" "}
                  <a href={CONTACT_PHONE_HREF} className="text-ink transition-colors duration-150 hover:text-accent">
                    {CONTACT_PHONE}
                  </a>
                </span>
                <span>
                  E-Mail:{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-ink transition-colors duration-150 hover:text-accent"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </span>
              </p>
            </LegalSection>

            <LegalSection title="Umsatzsteuer">
              <p>
                Gemäß § 19 UStG wird als Kleinunternehmer keine Umsatzsteuer berechnet.
              </p>
            </LegalSection>

            <LegalSection title="Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV">
              <p>
                Mykolai Bohaichyk
                <br />
                Friedrich-Ebert-Straße 114
                <br />
                42117 Wuppertal-Elberfeld
              </p>
            </LegalSection>

            <LegalSection title="EU-Streitschlichtung">
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink underline decoration-line underline-offset-4 transition-colors duration-150 hover:text-accent hover:decoration-accent"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
                . Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </LegalSection>

            <LegalSection title="Haftung für Inhalte">
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
                allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch
                nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <p>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen
                Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt
                der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
                Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
            </LegalSection>

            <LegalSection title="Haftung für Links">
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss
                haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
                verantwortlich.
              </p>
              <p>
                Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
                Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente
                inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
                Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige
                Links umgehend entfernen.
              </p>
            </LegalSection>

            <LegalSection title="Urheberrecht">
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
                deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
                jeweiligen Autors bzw. Erstellers.
              </p>
              <p>
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch
                gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
                Urheberrechte Dritter beachtet.
              </p>
            </LegalSection>
          </div>
        </div>
      </section>
    </div>
  );
}
