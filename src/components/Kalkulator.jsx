import { useState } from "react";
import { ArrowLeft, Check, ImagePlus, Sparkles, X } from "lucide-react";
import { useInView } from "../hooks/useInView.js";
import Button from "./Button.jsx";
import { CONTACT_EMAIL, EXTRAS, PACKAGES } from "../data/services.js";

const VEHICLE_CLASSES = [
  { id: "klein", label: "Kleinwagen", hint: "z. B. Polo, Corsa, Fiesta", multiplier: 1 },
  { id: "mittel", label: "Mittelklasse / Kombi", hint: "z. B. Golf, A4, 3er", multiplier: 1.15 },
  { id: "suv", label: "SUV / Van", hint: "z. B. Tiguan, X5, Sharan", multiplier: 1.3 },
  { id: "sport", label: "Sportwagen / Luxusklasse", hint: "z. B. GT3 RS, Panamera", multiplier: 1.5 },
];

const STEPS = ["Fahrzeugklasse", "Leistung", "Zusatzleistungen", "Kontakt"];

function roundPrice(value) {
  return Math.round(value / 5) * 5;
}

function OptionCard({ selected, title, hint, priceLabel, highlight = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative flex w-full flex-col gap-1 rounded-2xl border px-5 py-4 text-left transition-colors duration-150 ease-out ${
        selected
          ? "border-ink bg-ink text-bg"
          : highlight
            ? "border-accent bg-accent/10 text-ink hover:border-ink"
            : "border-line bg-bg text-ink hover:border-ink/40"
      }`}
    >
      {highlight && !selected && (
        <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent-ink">
          <Sparkles size={11} strokeWidth={2.5} aria-hidden="true" />
          Empfehlung
        </span>
      )}
      <span className="flex items-center justify-between gap-3">
        <span className="font-display text-base font-medium">{title}</span>
        {priceLabel && (
          <span className={`shrink-0 text-sm ${selected ? "text-bg/80" : "text-ink-soft"}`}>{priceLabel}</span>
        )}
      </span>
      {hint && <span className={`text-sm ${selected ? "text-bg/70" : "text-ink-soft"}`}>{hint}</span>}
    </button>
  );
}

function StepIndicator({ step }) {
  return (
    <ol className="mb-10 flex flex-wrap gap-x-6 gap-y-2">
      {STEPS.map((label, i) => (
        <li
          key={label}
          className={`flex items-center gap-2 text-xs font-medium uppercase tracking-widest ${
            i === step ? "text-ink" : "text-ink-soft"
          }`}
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
              i < step
                ? "border-ink bg-ink text-bg"
                : i === step
                  ? "border-ink text-ink"
                  : "border-line text-ink-soft"
            }`}
          >
            {i < step ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : i + 1}
          </span>
          {label}
        </li>
      ))}
    </ol>
  );
}

function PriceBar({ total }) {
  return (
    <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-line bg-bg-alt px-5 py-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-ink-soft">Richtpreis</p>
        <p className="font-display text-xl font-semibold text-ink">ab {total} €</p>
      </div>
      <p className="max-w-[11rem] text-right text-xs text-ink-soft">
        Unverbindlich — finaler Preis nach kurzer Sichtprüfung vor Ort.
      </p>
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <>
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft">{eyebrow}</p>
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-3 max-w-lg text-sm text-ink-soft sm:text-base">{subtitle}</p>}
    </>
  );
}

function Confirmation({ title, description, onReset }) {
  return (
    <div className="rounded-2xl border border-line bg-bg-alt px-6 py-10 text-center">
      <p className="font-display text-xl font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">{description}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 text-sm font-medium text-ink underline decoration-line underline-offset-4 transition-colors duration-150 hover:decoration-ink"
      >
        Neue Anfrage starten
      </button>
    </div>
  );
}

const EMPTY_CONTACT = { name: "", email: "", phone: "", message: "" };

export default function Kalkulator() {
  const [ref, inView] = useInView();
  const [mode, setMode] = useState("calculator");

  const [step, setStep] = useState(0);
  const [vehicleClassId, setVehicleClassId] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [packageId, setPackageId] = useState(null);
  const [extraIds, setExtraIds] = useState([]);
  const [contact, setContact] = useState(EMPTY_CONTACT);
  const [submitted, setSubmitted] = useState(false);

  const [customVehicleInfo, setCustomVehicleInfo] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [customFiles, setCustomFiles] = useState([]);
  const [customContact, setCustomContact] = useState(EMPTY_CONTACT);
  const [customSubmitted, setCustomSubmitted] = useState(false);

  const selectedVehicleClass = VEHICLE_CLASSES.find((v) => v.id === vehicleClassId) ?? null;
  const selectedPackage = PACKAGES.find((p) => p.id === packageId) ?? null;
  const selectedExtras = EXTRAS.filter((e) => extraIds.includes(e.id));

  const packagePrice = selectedPackage
    ? roundPrice(selectedPackage.basePrice * (selectedVehicleClass?.multiplier ?? 1))
    : 0;
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const totalPrice = packagePrice + extrasTotal;

  function toggleExtra(id) {
    setExtraIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const canGoNext = step === 0 ? Boolean(vehicleClassId) : step === 1 ? Boolean(packageId) : true;

  function goNext() {
    if (!canGoNext) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function buildMailto() {
    const subject = `Aufbereitungsanfrage – ${selectedPackage?.label ?? "Kalkulator"}`;
    const body = [
      `Fahrzeugklasse: ${selectedVehicleClass?.label ?? "–"}`,
      vehicleInfo ? `Marke/Modell: ${vehicleInfo}` : null,
      `Leistung: ${selectedPackage?.label ?? "–"}`,
      selectedExtras.length ? `Zusatzleistungen: ${selectedExtras.map((e) => e.label).join(", ")}` : "Zusatzleistungen: keine",
      `Richtpreis: ab ${totalPrice} €`,
      "",
      `Name: ${contact.name}`,
      `E-Mail: ${contact.email}`,
      contact.phone ? `Telefon: ${contact.phone}` : null,
      contact.message ? `Nachricht: ${contact.message}` : null,
    ]
      .filter((line) => line !== null)
      .join("\n");

    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function handleSubmit(event) {
    event.preventDefault();
    window.location.href = buildMailto();
    setSubmitted(true);
  }

  function resetCalculator() {
    setStep(0);
    setVehicleClassId(null);
    setVehicleInfo("");
    setPackageId(null);
    setExtraIds([]);
    setContact(EMPTY_CONTACT);
    setSubmitted(false);
  }

  function handleCustomFiles(event) {
    const files = Array.from(event.target.files ?? []);
    setCustomFiles((prev) => [...prev, ...files]);
    event.target.value = "";
  }

  function removeCustomFile(index) {
    setCustomFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function buildCustomMailto() {
    const subject = "Individuelle Aufbereitungsanfrage";
    const body = [
      customVehicleInfo ? `Marke/Modell: ${customVehicleInfo}` : null,
      `Nachricht: ${customMessage || "–"}`,
      customFiles.length
        ? `Fotos: ${customFiles.length} Datei(en) ausgewählt — bitte manuell an diese E-Mail anhängen.`
        : null,
      "",
      `Name: ${customContact.name}`,
      `E-Mail: ${customContact.email}`,
      customContact.phone ? `Telefon: ${customContact.phone}` : null,
    ]
      .filter((line) => line !== null)
      .join("\n");

    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function handleCustomSubmit(event) {
    event.preventDefault();
    window.location.href = buildCustomMailto();
    setCustomSubmitted(true);
  }

  function resetCustom() {
    setCustomVehicleInfo("");
    setCustomMessage("");
    setCustomFiles([]);
    setCustomContact(EMPTY_CONTACT);
    setCustomSubmitted(false);
  }

  const revealClass = `transition-[opacity,transform] duration-700 ease-out ${
    inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
  }`;

  if (mode === "custom") {
    return (
      <section id="leistungen" className="border-b border-line bg-bg px-6 py-24 md:px-10">
        <div ref={ref} className={`mx-auto max-w-7xl ${revealClass}`}>
          <button
            type="button"
            onClick={() => setMode("calculator")}
            className="mb-8 inline-flex items-center gap-2 text-sm text-ink-soft transition-colors duration-150 hover:text-ink"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Zurück zum Kalkulator
          </button>

          <SectionHeader
            eyebrow="Individuelle Anfrage"
            title="Passt keine Standard-Option?"
            subtitle="Beschreibe dein Fahrzeug und dein Anliegen, lade optional Fotos hoch — wir melden uns mit einem passenden Angebot."
          />

          <div className="mt-10">
            {customSubmitted ? (
              <div key="confirmation" className="animate-step-fade">
                <Confirmation
                  title="Anfrage vorbereitet"
                  description={
                    customFiles.length
                      ? "Dein E-Mail-Programm öffnet sich mit allen Angaben. Bitte hänge die ausgewählten Fotos manuell an, bevor du die E-Mail absendest."
                      : "Dein E-Mail-Programm öffnet sich mit allen Angaben. Prüfe die Nachricht kurz und sende sie ab — wir melden uns zeitnah."
                  }
                  onReset={resetCustom}
                />
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} key="custom-form" className="flex flex-col gap-6 animate-step-fade">
                <div>
                  <label htmlFor="custom-vehicle" className="mb-2 block text-sm text-ink-soft">
                    Marke &amp; Modell <span className="text-ink-soft/70">(optional)</span>
                  </label>
                  <input
                    id="custom-vehicle"
                    type="text"
                    value={customVehicleInfo}
                    onChange={(e) => setCustomVehicleInfo(e.target.value)}
                    placeholder="z. B. Porsche 911 GT3 RS"
                    className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="custom-message" className="mb-2 block text-sm text-ink-soft">
                    Was möchtest du aufbereiten lassen?
                  </label>
                  <textarea
                    id="custom-message"
                    required
                    rows={4}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Beschreibe kurz Zustand und Wunsch …"
                    className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
                  />
                </div>

                <div>
                  <span className="mb-2 block text-sm text-ink-soft">
                    Fotos <span className="text-ink-soft/70">(optional)</span>
                  </span>
                  <label
                    htmlFor="custom-photos"
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line px-6 py-8 text-center text-sm text-ink-soft transition-colors duration-150 hover:border-ink/40"
                  >
                    <ImagePlus size={22} strokeWidth={1.75} aria-hidden="true" />
                    <span>Fotos auswählen</span>
                    <input
                      id="custom-photos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleCustomFiles}
                      className="sr-only"
                    />
                  </label>
                  {customFiles.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {customFiles.map((file, i) => (
                        <li
                          key={`${file.name}-${i}`}
                          className="flex items-center gap-2 rounded-full border border-line bg-bg-alt px-3 py-1.5 text-xs text-ink-soft"
                        >
                          {file.name}
                          <button
                            type="button"
                            onClick={() => removeCustomFile(i)}
                            aria-label={`${file.name} entfernen`}
                            className="text-ink-soft transition-colors duration-150 hover:text-ink"
                          >
                            <X size={12} strokeWidth={2.5} aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="custom-name" className="mb-2 block text-sm text-ink-soft">
                      Name
                    </label>
                    <input
                      id="custom-name"
                      type="text"
                      required
                      value={customContact.name}
                      onChange={(e) => setCustomContact((c) => ({ ...c, name: e.target.value }))}
                      className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="custom-email" className="mb-2 block text-sm text-ink-soft">
                      E-Mail
                    </label>
                    <input
                      id="custom-email"
                      type="email"
                      required
                      value={customContact.email}
                      onChange={(e) => setCustomContact((c) => ({ ...c, email: e.target.value }))}
                      className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="custom-phone" className="mb-2 block text-sm text-ink-soft">
                      Telefon <span className="text-ink-soft/70">(optional)</span>
                    </label>
                    <input
                      id="custom-phone"
                      type="tel"
                      value={customContact.phone}
                      onChange={(e) => setCustomContact((c) => ({ ...c, phone: e.target.value }))}
                      className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" className="self-start">
                  Anfrage senden
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="leistungen" className="border-b border-line bg-bg px-6 py-24 md:px-10">
      <div ref={ref} className={`mx-auto max-w-7xl ${revealClass}`}>
        <SectionHeader
          eyebrow="Kalkulator"
          title="Berechne deinen Richtpreis"
          subtitle="In drei Schritten zum unverbindlichen Preis — deine Kontaktdaten brauchen wir erst ganz am Ende."
        />

        <div className="mt-10">
          {submitted ? (
            <div key="confirmation" className="animate-step-fade">
              <Confirmation
                title="Anfrage vorbereitet"
                description="Dein E-Mail-Programm öffnet sich mit allen Angaben. Prüfe die Nachricht kurz und sende sie ab — wir melden uns zeitnah mit deinem finalen Angebot."
                onReset={resetCalculator}
              />
            </div>
          ) : (
            <div key="calculator" className="animate-step-fade">
              <StepIndicator step={step} />

              <div key={step} className="animate-step-fade">
              {step === 0 && (
                <div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {VEHICLE_CLASSES.map((vc) => (
                      <OptionCard
                        key={vc.id}
                        selected={vehicleClassId === vc.id}
                        title={vc.label}
                        hint={vc.hint}
                        onClick={() => setVehicleClassId(vc.id)}
                      />
                    ))}
                  </div>
                  <div className="mt-6">
                    <label htmlFor="vehicle-info" className="mb-2 block text-sm text-ink-soft">
                      Marke &amp; Modell <span className="text-ink-soft/70">(optional)</span>
                    </label>
                    <input
                      id="vehicle-info"
                      type="text"
                      value={vehicleInfo}
                      onChange={(e) => setVehicleInfo(e.target.value)}
                      placeholder="z. B. Porsche 911 GT3 RS"
                      className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-3">
                  {PACKAGES.map((pkg) => (
                    <OptionCard
                      key={pkg.id}
                      selected={packageId === pkg.id}
                      title={pkg.label}
                      hint={pkg.desc}
                      priceLabel={`ab ${roundPrice(pkg.basePrice * (selectedVehicleClass?.multiplier ?? 1))} €`}
                      onClick={() => setPackageId(pkg.id)}
                    />
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {EXTRAS.map((extra) => (
                    <OptionCard
                      key={extra.id}
                      selected={extraIds.includes(extra.id)}
                      title={extra.label}
                      hint={extra.desc}
                      priceLabel={`+${extra.price} €`}
                      highlight={extra.highlight}
                      onClick={() => toggleExtra(extra.id)}
                    />
                  ))}
                </div>
              )}

              {step === 3 && (
                <form id="contact-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-2 block text-sm text-ink-soft">
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={contact.name}
                        onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                        className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="mb-2 block text-sm text-ink-soft">
                        E-Mail
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={contact.email}
                        onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                        className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="mb-2 block text-sm text-ink-soft">
                        Telefon <span className="text-ink-soft/70">(optional)</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                        className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="mb-2 block text-sm text-ink-soft">
                        Nachricht <span className="text-ink-soft/70">(optional)</span>
                      </label>
                      <input
                        id="contact-message"
                        type="text"
                        value={contact.message}
                        onChange={(e) => setContact((c) => ({ ...c, message: e.target.value }))}
                        className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                  </div>
                </form>
              )}
              </div>

              {step > 0 && selectedPackage && <PriceBar total={totalPrice} />}

              {step === 3 ? (
                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
                  >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Zurück
                  </button>
                  <Button type="submit" form="contact-form" variant="primary">
                    Anfrage senden
                  </Button>
                </div>
              ) : (
                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={step === 0}
                    className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors duration-150 hover:text-ink disabled:pointer-events-none disabled:opacity-0"
                  >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Zurück
                  </button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={goNext}
                    className={!canGoNext ? "pointer-events-none opacity-40" : ""}
                  >
                    Weiter
                  </Button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setMode("custom")}
                className="mt-8 block text-sm text-ink-soft underline decoration-line underline-offset-4 transition-colors duration-150 hover:text-ink"
              >
                Passt keine Option? Individuelle Anfrage mit Fotos stellen →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
