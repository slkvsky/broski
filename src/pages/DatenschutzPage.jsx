import { useEffect } from "react";
import { LegalSection } from "../components/LegalText.jsx";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from "../data/services.js";

export default function DatenschutzPage() {
  useEffect(() => {
    document.title = "Broski Detailing — Datenschutz";
    return () => {
      document.title = "Broski Detailing — Wuppertal";
    };
  }, []);

  return (
    <div className="pt-16 md:pt-[73px]">
      <section className="bg-bg px-6 py-24 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft">Rechtliches</p>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Datenschutzerklärung</h1>

          <div className="mt-12 flex flex-col gap-8">
            <LegalSection title="1. Verantwortlicher">
              <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
              <p>
                Mykolai Bohaichyk
                <br />
                Friedrich-Ebert-Straße 114
                <br />
                42117 Wuppertal-Elberfeld
                <br />
                Telefon:{" "}
                <a href={CONTACT_PHONE_HREF} className="text-ink transition-colors duration-150 hover:text-accent">
                  {CONTACT_PHONE}
                </a>
                <br />
                E-Mail:{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-ink transition-colors duration-150 hover:text-accent"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </LegalSection>

            <LegalSection title="2. Allgemeines zur Datenverarbeitung">
              <p>
                Wir verarbeiten personenbezogene Daten unserer Nutzer:innen grundsätzlich nur, soweit dies zur
                Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich
                ist. Die Verarbeitung personenbezogener Daten erfolgt nur nach Einwilligung der Nutzer:innen oder
                sofern die Verarbeitung durch gesetzliche Vorschriften gestattet ist, insbesondere Art. 6 Abs. 1
                lit. a (Einwilligung) und lit. b (Vertragserfüllung bzw. vorvertragliche Anfrage) DSGVO.
              </p>
            </LegalSection>

            <LegalSection title="3. Ihre Rechte">
              <p>Sie haben jederzeit das Recht,</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Auskunft über die von uns gespeicherten Daten zu Ihrer Person zu erhalten (Art. 15 DSGVO),</li>
                <li>die Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO),</li>
                <li>die Löschung Ihrer bei uns gespeicherten Daten zu verlangen (Art. 17 DSGVO),</li>
                <li>die Einschränkung der Datenverarbeitung zu verlangen (Art. 18 DSGVO),</li>
                <li>der Verarbeitung Ihrer Daten zu widersprechen (Art. 21 DSGVO),</li>
                <li>Ihre Daten in einem übertragbaren Format zu erhalten (Art. 20 DSGVO) sowie</li>
                <li>eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen (Art. 7 Abs. 3 DSGVO).</li>
              </ul>
              <p>
                Zudem steht Ihnen ein Beschwerderecht bei der zuständigen Datenschutz-Aufsichtsbehörde zu, für uns
                die Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW).
              </p>
            </LegalSection>

            <LegalSection title="4. Hosting">
              <p>
                Diese Website wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA („Vercel“)
                gehostet. Beim Besuch der Website erfasst Vercel automatisch Informationen in sogenannten
                Server-Logfiles, die Ihr Browser übermittelt (z. B. IP-Adresse, Datum und Uhrzeit der Anfrage,
                Browsertyp, verwendetes Betriebssystem). Diese Daten sind nicht bestimmten Personen zuordenbar
                und werden ausschließlich zur Gewährleistung eines störungsfreien Betriebs sowie zur
                Verbesserung des Angebots ausgewertet (Art. 6 Abs. 1 lit. f DSGVO).
              </p>
              <p>
                Da Vercel seinen Sitz in den USA hat, kann es dabei zu einer Übermittlung personenbezogener
                Daten in ein Drittland außerhalb der EU/des EWR kommen. Vercel hat sich zur Einhaltung der
                EU-Standardvertragsklauseln verpflichtet, um ein angemessenes Datenschutzniveau sicherzustellen.
                Weitere Informationen finden Sie in der Datenschutzerklärung von Vercel:{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink underline decoration-line underline-offset-4 transition-colors duration-150 hover:text-accent hover:decoration-accent"
                >
                  vercel.com/legal/privacy-policy
                </a>
                .
              </p>
            </LegalSection>

            <LegalSection title="5. Kontaktaufnahme">
              <p>
                Das Kontaktformular auf dieser Website öffnet Ihr eigenes E-Mail-Programm mit einer
                vorausgefüllten Nachricht — Ihre Angaben werden dabei nicht an einen Server übertragen oder von
                uns gespeichert, bevor Sie die E-Mail selbst absenden. Sobald Sie uns per E-Mail, Telefon oder
                WhatsApp kontaktieren, verarbeiten wir die von Ihnen mitgeteilten Daten (u. a. Name,
                Kontaktdaten, Nachrichteninhalt) zur Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. b bzw. f
                DSGVO). Diese Daten löschen wir, sobald die Speicherung nicht mehr erforderlich ist, oder
                schränken die Verarbeitung ein, falls gesetzliche Aufbewahrungspflichten bestehen.
              </p>
              <p className="text-xs text-ink-soft/70">
                Für WhatsApp-Kontakte gilt zusätzlich die Datenschutzerklärung von WhatsApp/Meta, da Nachrichten
                über deren Infrastruktur übermittelt werden.
              </p>
            </LegalSection>

            <LegalSection title="6. Google Fonts">
              <p>
                Diese Website nutzt zur einheitlichen Darstellung von Schriftarten sogenannte Google Fonts, die
                von einem Server von Google beim Aufruf der Seite geladen werden. Dabei wird eine Verbindung zu
                Servern von Google in den USA hergestellt und Ihre IP-Adresse an Google übermittelt. Weitere
                Informationen finden Sie in der Datenschutzerklärung von Google:{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink underline decoration-line underline-offset-4 transition-colors duration-150 hover:text-accent hover:decoration-accent"
                >
                  policies.google.com/privacy
                </a>
                .
              </p>
            </LegalSection>

            <LegalSection title="7. Cookies &amp; lokale Speicherung">
              <p>
                Diese Website verwendet keine Cookies und speichert keine Daten im lokalen Speicher (Local
                Storage) Ihres Browsers.
              </p>
            </LegalSection>

            <LegalSection title="8. Keine Analyse- oder Tracking-Tools">
              <p>
                Wir setzen auf dieser Website derzeit keine Analyse-, Tracking- oder Werbetools (z. B. Google
                Analytics, Facebook-Pixel) ein.
              </p>
            </LegalSection>

            <LegalSection title="9. Links zu sozialen Netzwerken">
              <p>
                Wir verlinken auf dieser Website auf unsere Profile bei Instagram, TikTok, Facebook, YouTube und
                WhatsApp. Es handelt sich dabei um einfache Links, keine eingebetteten Plugins — beim Besuch
                unserer Website werden dadurch noch keine Daten an diese Anbieter übertragen. Erst wenn Sie
                aktiv auf einen Link klicken, werden Sie zum jeweiligen Anbieter weitergeleitet, für den dann
                dessen eigene Datenschutzerklärung gilt.
              </p>
            </LegalSection>

            <LegalSection title="10. SSL-/TLS-Verschlüsselung">
              <p>
                Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte
                eine SSL-/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die
                Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer
                Browserzeile.
              </p>
            </LegalSection>

            <LegalSection title="11. Änderung dieser Datenschutzerklärung">
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen
                rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen umzusetzen. Für Ihren
                erneuten Besuch gilt dann die jeweils aktuelle Datenschutzerklärung.
              </p>
            </LegalSection>
          </div>
        </div>
      </section>
    </div>
  );
}
