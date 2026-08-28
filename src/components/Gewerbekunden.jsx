import { useState } from "react";
import { Check, Mail, MessageCircle, Phone } from "lucide-react";
import { useInView } from "../hooks/useInView.js";
import Button from "./Button.jsx";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, WHATSAPP_HREF } from "../data/services.js";

const B2B_SERVICES = [
  { id: "innenraum", label: "Innenraum-Aufbereitung" },
  { id: "aussen", label: "Außen-Aufbereitung" },
  { id: "lack", label: "Lackaufbereitung & Politur" },
  { id: "leder", label: "Leder-Farbwiederherstellung" },
  { id: "verkauf", label: "Verkaufsvorbereitung" },
  { id: "sonstiges", label: "weitere Leistungen nach Absprache" },
];

const READINESS_POINTS = [
  "mit einzelnen Fahrzeugen",
  "mit einem bestimmten Fahrzeugvolumen",
  "auf regelmäßiger Basis",
  "nach abgestimmter Art der Arbeiten",
  "zu individuellen Konditionen",
];

const EMPTY_B2B_FORM = {
  company: "",
  contactPerson: "",
  email: "",
  phone: "",
  scope: "",
  message: "",
};

function buildMailto({ form, serviceIds }) {
  const services = B2B_SERVICES.filter((s) => serviceIds.includes(s.id));
  const subject = `B2B-Anfrage – ${form.company || "Gewerbekunde"}`;
  const body = [
    `Firma: ${form.company}`,
    `Ansprechpartner: ${form.contactPerson}`,
    `E-Mail: ${form.email}`,
    form.phone ? `Telefon: ${form.phone}` : null,
    form.scope ? `Anzahl/Umfang: ${form.scope}` : null,
    services.length ? `Gewünschte Leistungen: ${services.map((s) => s.label).join(", ")}` : "Gewünschte Leistungen: noch offen",
    form.message ? `Nachricht: ${form.message}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function ServiceToggle({ selected, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-150 ${
        selected
          ? "border-accent bg-accent/15 text-ink"
          : "border-line bg-bg text-ink-soft hover:border-ink/40"
      }`}
    >
      <Check
        size={14}
        strokeWidth={2.5}
        className={selected ? "text-accent" : "text-ink-soft/30"}
        aria-hidden="true"
      />
      {label}
    </button>
  );
}

export default function Gewerbekunden() {
  const [ref, inView] = useInView();
  const [form, setForm] = useState(EMPTY_B2B_FORM);
  const [serviceIds, setServiceIds] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  function toggleService(id) {
    setServiceIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleSubmit(event) {
    event.preventDefault();
    window.location.href = buildMailto({ form, serviceIds });
    setSubmitted(true);
  }

  function resetForm() {
    setForm(EMPTY_B2B_FORM);
    setServiceIds([]);
    setSubmitted(false);
  }

  return (
    <section id="gewerbekunden" className="border-b border-line bg-bg px-6 py-16 md:px-10 md:py-20">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl transition-[opacity,transform] duration-700 ease-out ${
          inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft">Gewerbekunden</p>
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Fahrzeugaufbereitung für Gewerbekunden
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-ink-soft sm:text-base">
          Sie benötigen regelmäßig professionelle Fahrzeugaufbereitung? Wir bieten individuelle Lösungen für
          Unternehmen – von einzelnen Fahrzeugen bis hin zu regelmäßigen Aufträgen und größeren
          Fahrzeugmengen. Nicht nur für Autohäuser: Wir freuen uns über individuelle Anfragen von jedem
          Gewerbekunden.
        </p>
        <p className="mt-3 max-w-2xl font-display text-base font-medium text-ink sm:text-lg">
          Sie liefern die Fahrzeuge. Wir kümmern uns um den Rest.
        </p>
        <div className="mt-10 flex flex-wrap gap-2.5">
          {B2B_SERVICES.map((service) => (
            <span
              key={service.id}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-alt px-4 py-2 text-sm text-ink"
            >
              <Check size={14} strokeWidth={2.5} className="text-accent" aria-hidden="true" />
              {service.label}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-accent/30 bg-bg-alt px-6 py-6 sm:px-8">
          <p className="font-display text-lg font-semibold text-ink sm:text-xl">
            Individuelle Konditionen bei regelmäßigen Aufträgen und größeren Fahrzeugmengen.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Wir arbeiten{" "}
            {READINESS_POINTS.map((point, i) => (
              <span key={point}>
                {i > 0 && <span className="text-ink-soft/40"> · </span>}
                {point}
              </span>
            ))}
            .
          </p>
        </div>

        <div id="gewerbe-form" className="mt-10 scroll-mt-24">
          {submitted ? (
            <div key="confirmation" className="mx-auto max-w-md rounded-2xl border border-line bg-bg-alt px-6 py-10 text-center animate-step-fade">
              <p className="font-display text-xl font-semibold text-ink">Anfrage vorbereitet</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
                Dein E-Mail-Programm öffnet sich mit allen Angaben. Prüfe die Nachricht kurz und sende
                sie ab — wir melden uns zeitnah mit einem passenden Angebot.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-6 text-sm font-medium text-ink underline decoration-line underline-offset-4 transition-colors duration-150 hover:decoration-ink"
              >
                Neue Anfrage starten
              </button>
            </div>
          ) : (
            <div key="form" className="rounded-2xl border border-line bg-bg-alt p-6 sm:p-8 lg:p-10 animate-step-fade">
              <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-0">
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">Jetzt B2B-Anfrage stellen</h3>
                  <p className="mt-1.5 text-sm text-ink-soft">
                    Kurze Angaben genügen — wir melden uns zeitnah mit einem passenden Angebot.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 text-sm text-ink-soft">
                    <a
                      href={CONTACT_PHONE_HREF}
                      className="flex items-center gap-2.5 transition-colors duration-150 hover:text-ink"
                    >
                      <Phone size={15} strokeWidth={2} className="text-accent" aria-hidden="true" />
                      {CONTACT_PHONE}
                    </a>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="flex items-center gap-2.5 transition-colors duration-150 hover:text-ink"
                    >
                      <Mail size={15} strokeWidth={2} className="text-accent" aria-hidden="true" />
                      {CONTACT_EMAIL}
                    </a>
                    <a
                      href={WHATSAPP_HREF}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 transition-colors duration-150 hover:text-ink"
                    >
                      <MessageCircle size={15} strokeWidth={2} className="text-accent" aria-hidden="true" />
                      WhatsApp
                    </a>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5 border-t border-line pt-8 lg:border-t-0 lg:border-l lg:border-line lg:pl-10 lg:pt-0"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="b2b-company" className="mb-1.5 block text-sm text-ink-soft">
                        Firmenname
                      </label>
                      <input
                        id="b2b-company"
                        type="text"
                        required
                        value={form.company}
                        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                        className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="b2b-contact" className="mb-1.5 block text-sm text-ink-soft">
                        Ansprechpartner
                      </label>
                      <input
                        id="b2b-contact"
                        type="text"
                        required
                        value={form.contactPerson}
                        onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))}
                        className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="b2b-email" className="mb-1.5 block text-sm text-ink-soft">
                        E-Mail
                      </label>
                      <input
                        id="b2b-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="b2b-phone" className="mb-1.5 block text-sm text-ink-soft">
                        Telefonnummer
                      </label>
                      <input
                        id="b2b-phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="b2b-scope" className="mb-1.5 block text-sm text-ink-soft">
                        Anzahl / Umfang der Fahrzeuge <span className="text-ink-soft/70">(optional)</span>
                      </label>
                      <input
                        id="b2b-scope"
                        type="text"
                        placeholder="z. B. 8 Fahrzeuge, wöchentlich"
                        value={form.scope}
                        onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
                        className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="mb-2 block text-sm text-ink-soft">
                      Gewünschte Leistungen <span className="text-ink-soft/70">(optional)</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {B2B_SERVICES.map((service) => (
                        <ServiceToggle
                          key={service.id}
                          selected={serviceIds.includes(service.id)}
                          label={service.label}
                          onClick={() => toggleService(service.id)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="b2b-message" className="mb-1.5 block text-sm text-ink-soft">
                      Nachricht <span className="text-ink-soft/70">(optional)</span>
                    </label>
                    <textarea
                      id="b2b-message"
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                    />
                  </div>

                  <Button type="submit" variant="primary" className="self-start">
                    B2B-Anfrage senden
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
