import { useState } from "react";
import { Check } from "lucide-react";
import { useInView } from "../hooks/useInView.js";
import Button from "./Button.jsx";
import { CONTACT_EMAIL, EXTRAS, PACKAGES } from "../data/services.js";

const SERVICES = [...PACKAGES, ...EXTRAS];

const EMPTY_B2B_FORM = {
  company: "",
  contactPerson: "",
  email: "",
  phone: "",
  scope: "",
  message: "",
};

function buildMailto({ form, serviceIds }) {
  const services = SERVICES.filter((s) => serviceIds.includes(s.id));
  const subject = `B2B-Anfrage – ${form.company || "Gewerbekunde"}`;
  const body = [
    `Firma: ${form.company}`,
    `Ansprechpartner: ${form.contactPerson}`,
    `E-Mail: ${form.email}`,
    form.phone ? `Telefon: ${form.phone}` : null,
    form.scope ? `Anzahl/Umfang: ${form.scope}` : null,
    services.length ? `Leistungen: ${services.map((s) => s.label).join(", ")}` : "Leistungen: noch offen",
    form.message ? `Nachricht: ${form.message}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
    <section id="gewerbekunden" className="border-b border-line bg-bg px-6 py-24 md:px-10">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl transition-[opacity,transform] duration-700 ease-out ${
          inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft">Gewerbekunden</p>
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Flottenpflege für Ihr Unternehmen
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-ink-soft sm:text-base">
          Für Fuhrparks, Autohäuser und Firmenflotten: feste Ansprechpartner, Sammelrechnung und
          flexible Termine direkt bei Ihnen vor Ort — abgestimmt auf Ihren Betrieb.
        </p>

        <Button as="a" href="#gewerbe-form" variant="primary" className="mt-8">
          B2B-Anfrage
        </Button>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="flex items-start gap-3 rounded-2xl border border-line bg-bg-alt px-5 py-4"
            >
              <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-sm text-ink">{service.label}</span>
            </div>
          ))}
        </div>

        <div id="gewerbe-form" className="mt-14 max-w-2xl scroll-mt-24">
          {submitted ? (
            <div className="rounded-2xl border border-line bg-bg-alt px-6 py-10 text-center">
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="b2b-company" className="mb-2 block text-sm text-ink-soft">
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
                  <label htmlFor="b2b-contact" className="mb-2 block text-sm text-ink-soft">
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
                  <label htmlFor="b2b-email" className="mb-2 block text-sm text-ink-soft">
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
                  <label htmlFor="b2b-phone" className="mb-2 block text-sm text-ink-soft">
                    Telefon <span className="text-ink-soft/70">(optional)</span>
                  </label>
                  <input
                    id="b2b-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="b2b-scope" className="mb-2 block text-sm text-ink-soft">
                    Anzahl Fahrzeuge / Umfang <span className="text-ink-soft/70">(optional)</span>
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
                  Leistungen <span className="text-ink-soft/70">(optional)</span>
                </span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SERVICES.map((service) => (
                    <label
                      key={service.id}
                      className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink transition-colors duration-150 hover:border-ink/40"
                    >
                      <input
                        type="checkbox"
                        checked={serviceIds.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                        className="h-4 w-4 accent-accent"
                      />
                      {service.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="b2b-message" className="mb-2 block text-sm text-ink-soft">
                  Nachricht <span className="text-ink-soft/70">(optional)</span>
                </label>
                <textarea
                  id="b2b-message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                />
              </div>

              <Button type="submit" variant="primary" className="self-start">
                B2B-Anfrage senden
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
