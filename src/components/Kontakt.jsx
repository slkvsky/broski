import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useInView } from "../hooks/useInView.js";
import Button from "./Button.jsx";
import { WhatsappIcon, InstagramIcon, TiktokIcon, FacebookIcon, YoutubeIcon } from "./icons/SocialIcons.jsx";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, WHATSAPP_HREF } from "../data/services.js";

const CONTACT_METHODS = [
  {
    id: "phone",
    icon: Phone,
    label: "Anrufen",
    value: CONTACT_PHONE,
    href: CONTACT_PHONE_HREF,
  },
  {
    id: "whatsapp",
    icon: WhatsappIcon,
    label: "WhatsApp",
    value: "Direkt Nachricht schreiben",
    href: WHATSAPP_HREF,
    external: true,
  },
  {
    id: "email",
    icon: Mail,
    label: "E-Mail",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
];

const SOCIAL_LINKS = [
  { label: "WhatsApp", href: WHATSAPP_HREF, icon: WhatsappIcon },
  { label: "E-Mail", href: `mailto:${CONTACT_EMAIL}`, icon: Mail },
  // Placeholders until the real social profiles are ready — kept in one
  // place so swapping them later is a one-line change per entry.
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "TikTok", href: "#", icon: TiktokIcon },
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "YouTube", href: "#", icon: YoutubeIcon },
];

const EMPTY_FORM = { name: "", contact: "", message: "" };

function buildMailtoHref(form) {
  const body = [`Name: ${form.name}`, `Kontakt: ${form.contact}`, "", form.message].filter(Boolean).join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Kontaktanfrage – ${form.name || "Website"}`,
  )}&body=${encodeURIComponent(body)}`;
}

function ContactCard({ icon: Icon, label, value, href, external, index, inView }) {
  return (
    <div
      className="transition-[opacity,transform] duration-500 ease-out"
      style={{
        transitionDelay: `${Math.min(index, 5) * 90}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(0.75rem)",
      }}
    >
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="group relative flex flex-col gap-4 rounded-2xl border border-line bg-bg-alt px-6 py-7 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-accent/50"
      >
        {/* Same static-shadow / opacity-only glow trick as Kalkulator's
            OptionCard — cheap to animate, reads as a soft accent halo. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 rounded-2xl opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
          style={{ boxShadow: "0 14px 34px -12px rgba(245, 196, 0, 0.4)" }}
        />

        <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 ease-out group-hover:border-accent group-hover:text-accent">
          <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
        </span>

        <span className="relative">
          <span className="block text-xs font-medium uppercase tracking-widest text-ink-soft">{label}</span>
          <span className="mt-1.5 block font-display text-lg font-medium text-ink">{value}</span>
        </span>
      </a>
    </div>
  );
}

export default function Kontakt() {
  const [heroRef, heroInView] = useInView();
  const [cardsRef, cardsInView] = useInView();
  const [formRef, formInView] = useInView();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    window.location.href = buildMailtoHref(form);
    setSubmitted(true);
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setSubmitted(false);
  }

  return (
    <>
      <section className="relative overflow-hidden bg-bg px-6 pb-14 pt-20 md:px-10 md:pb-20 md:pt-28">
        {/* Ghost wordmark, same treatment as FinalCta's — ties the page's
            opening to the site's closing section. */}
        <h2
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none text-center font-display text-[20vw] font-bold uppercase leading-none tracking-[0.01em] text-ink/[0.04] sm:text-[14vw]"
        >
          Kontakt
        </h2>

        <div
          ref={heroRef}
          className={`relative z-10 mx-auto max-w-3xl text-center transition-[opacity,transform] duration-700 ease-out ${
            heroInView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft">Kontakt</p>
          <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-5xl">
            Lass uns dein Auto verwandeln.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
            Ruf an, schreib uns oder schick dein Anliegen direkt über das Formular — wir melden uns in der
            Regel innerhalb weniger Stunden.
          </p>
          <span
            aria-hidden="true"
            className="mx-auto mt-6 block h-px w-16 origin-center bg-accent transition-transform duration-700 ease-out"
            style={{ transform: heroInView ? "scaleX(1)" : "scaleX(0)", transitionDelay: "300ms" }}
          />
        </div>
      </section>

      <section className="bg-bg px-6 pb-6 md:px-10">
        <div ref={cardsRef} className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          {CONTACT_METHODS.map((method, index) => (
            <ContactCard key={method.id} {...method} index={index} inView={cardsInView} />
          ))}
        </div>
      </section>

      <section className="border-b border-line bg-bg px-6 py-16 md:px-10 md:py-20">
        <div
          ref={formRef}
          className={`mx-auto grid max-w-7xl gap-10 transition-[opacity,transform] duration-700 ease-out lg:grid-cols-[1fr_360px] ${
            formInView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <div className="rounded-2xl border border-line bg-bg-alt p-6 sm:p-8 lg:p-10">
            {submitted ? (
              <div key="confirmation" className="animate-step-fade py-10 text-center">
                <p className="font-display text-xl font-semibold text-ink">Nachricht vorbereitet</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
                  Dein E-Mail-Programm öffnet sich mit allen Angaben. Prüfe die Nachricht kurz und sende sie
                  ab — wir melden uns zeitnah bei dir.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-6 text-sm font-medium text-ink underline decoration-line underline-offset-4 transition-colors duration-150 hover:decoration-ink"
                >
                  Neue Nachricht schreiben
                </button>
              </div>
            ) : (
              <form key="form" onSubmit={handleSubmit} className="animate-step-fade flex flex-col gap-5">
                <h2 className="font-display text-xl font-semibold text-ink">Schreib uns direkt</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="kontakt-name" className="mb-1.5 block text-sm text-ink-soft">
                      Name
                    </label>
                    <input
                      id="kontakt-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={update("name")}
                      className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="kontakt-contact" className="mb-1.5 block text-sm text-ink-soft">
                      Telefon oder E-Mail
                    </label>
                    <input
                      id="kontakt-contact"
                      type="text"
                      required
                      value={form.contact}
                      onChange={update("contact")}
                      className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="kontakt-message" className="mb-1.5 block text-sm text-ink-soft">
                    Nachricht
                  </label>
                  <textarea
                    id="kontakt-message"
                    rows={5}
                    required
                    placeholder="Beschreibe kurz dein Fahrzeug und dein Anliegen."
                    value={form.message}
                    onChange={update("message")}
                    className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
                  />
                </div>

                <Button type="submit" variant="primary" className="self-start">
                  <Send size={15} strokeWidth={2} aria-hidden="true" />
                  Nachricht senden
                </Button>
              </form>
            )}
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl border border-accent/30 bg-bg-alt px-6 py-6">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                <span className="text-xs font-medium uppercase tracking-widest text-ink-soft">
                  Mobiler Service
                </span>
              </div>
              <p className="mt-4 flex items-start gap-2.5 text-sm text-ink">
                <MapPin size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                Wuppertal &amp; Umgebung — wir kommen zu dir.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Termine nach Vereinbarung, auf Wunsch auch abends oder am Wochenende.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-bg-alt px-6 py-6">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-soft">Folge uns</p>
              <div className="mt-4 flex gap-3">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors duration-150 hover:border-accent hover:text-accent"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
