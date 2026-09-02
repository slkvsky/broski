import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CarFront, CarTaxiFront, Check, ChevronDown, Gem, ImagePlus, X } from "lucide-react";
import { IconCar, IconCarSuv, IconTruckDelivery } from "@tabler/icons-react";
import { useInView } from "../hooks/useInView.js";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import Button from "./Button.jsx";
import AutocompleteInput from "./AutocompleteInput.jsx";
import AnimatedNumber from "./AnimatedNumber.jsx";
import { CONTACT_EMAIL, EXTRAS, LEISTUNGEN, VEHICLE_SIZES } from "../data/services.js";
import { CAR_MAKES_MODELS } from "../data/carMakesModels.js";

const STEPS = ["Fahrzeuggröße", "Leistung", "Extras", "Kontakt"];

// Keyed by VEHICLE_SIZES id rather than stored in data/services.js — that
// file stays plain data, icons are a display concern of this component.
// Mixes lucide-react with @tabler/icons-react for the two sizes (SUV, the
// cargo-van "Transporter") where lucide has nothing more specific than a
// generic van/truck glyph — Tabler's car-suv and truck-delivery read as
// that body shape at a glance instead of "some car" / "some truck". Both
// libraries accept the same `size`/`strokeWidth` props, so OptionCard
// doesn't need to know which one it's rendering.
const VEHICLE_SIZE_ICONS = {
  klein: IconCar,
  kompakt: CarFront,
  mittel: CarTaxiFront,
  ober: Gem,
  suv: IconCarSuv,
  transporter: IconTruckDelivery,
};

const CAR_MAKE_NAMES = CAR_MAKES_MODELS.map((m) => m.make);

function modelsForMake(makeValue) {
  const match = CAR_MAKES_MODELS.find((m) => m.make.toLowerCase() === makeValue.trim().toLowerCase());
  return match ? match.models : [];
}

const INDIVIDUELLE_ANFRAGE_TEXT =
  "Du hast einen individuellen Wunsch oder bist dir nicht sicher, was dein Fahrzeug braucht? Schick uns einfach deine Anfrage.";

function priceLabelFor(item, sizeId) {
  const price = item.getPrice(sizeId);
  if (price == null) return "auf Anfrage";
  const prefix = item.noAb ? "" : "ab ";
  const suffix = item.priceSuffix ? ` ${item.priceSuffix}` : "";
  return `${prefix}${price} €${suffix}`;
}

function SectionGrain() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-grain opacity-[0.035]" />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 45%, rgba(255,255,255,0.05), transparent 70%)",
        }}
      />
    </div>
  );
}

function OptionCard({ selected, dimmed = false, title, hint, description, priceLabel, highlight = false, icon: Icon, onClick }) {
  const [expanded, setExpanded] = useState(false);

  function toggleExpanded(event) {
    event.stopPropagation();
    setExpanded((v) => !v);
  }

  return (
    <div
      className={`relative flex flex-col rounded-2xl border transition-[transform,opacity,border-color,background-color] duration-200 ease-out hover:-translate-y-0.5 ${
        selected
          ? "border-accent bg-accent/5 text-ink"
          : highlight
            ? "border-accent/40 bg-bg text-ink hover:border-accent/70"
            : "border-line bg-bg text-ink hover:border-ink/40"
      } ${!selected && dimmed ? "opacity-60 hover:opacity-100" : "opacity-100"}`}
    >
      {/* Glow layer: box-shadow itself is static, only its opacity animates
          (cheap) — the "glow" reads the same as animating box-shadow directly
          but skips the expensive paint work that would cost. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-1 rounded-2xl transition-opacity duration-200 ease-out ${
          selected ? "opacity-100" : "opacity-0"
        }`}
        style={{ boxShadow: "0 10px 30px -10px rgba(245, 196, 0, 0.45)" }}
      />

      {highlight && !selected && (
        <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent-ink">
          Empfehlung
        </span>
      )}
      <button type="button" onClick={onClick} aria-pressed={selected} className="relative flex w-full flex-col gap-1 px-5 py-4 text-left">
        <span className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-4">
            {Icon && (
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ease-out ${
                  selected ? "border-accent/50 text-accent" : "border-line text-ink-soft"
                }`}
              >
                <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
              </span>
            )}
            <span className="font-display text-base font-medium">{title}</span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {priceLabel && (
              <span className={`text-sm ${selected ? "text-accent" : "text-ink-soft"}`}>{priceLabel}</span>
            )}
            {description && (
              <span
                role="button"
                tabIndex={0}
                onClick={toggleExpanded}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleExpanded(e);
                  }
                }}
                aria-expanded={expanded}
                aria-label={expanded ? "Details ausblenden" : "Details anzeigen"}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-ink-soft transition-transform duration-150 ease-out ${
                  selected ? "border-accent/50" : "border-line"
                } ${expanded ? "rotate-180" : ""}`}
              >
                <ChevronDown size={12} strokeWidth={2.5} aria-hidden="true" />
              </span>
            )}
          </span>
        </span>
        {hint && <span className="text-sm text-ink-soft">{hint}</span>}
      </button>
      {description && expanded && (
        <p className="animate-desc-reveal px-5 pb-4 text-sm text-ink-soft">{description}</p>
      )}
    </div>
  );
}

function LederExtraCard({ extra, selectedVariantId, onSelectVariant }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border-2 border-accent bg-accent/10 p-5 sm:col-span-2">
      <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent-ink">
        Empfehlung
      </span>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="font-display text-base font-medium text-ink">{extra.label}</p>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-sm text-ink-soft underline decoration-line underline-offset-4 transition-colors duration-150 hover:text-ink"
          >
            {expanded ? "Weniger anzeigen" : "Details anzeigen"}
          </button>
          {expanded && <p className="animate-desc-reveal mt-2 text-sm text-ink-soft">{extra.description}</p>}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {extra.variants.map((variant) => {
          const active = selectedVariantId === variant.id;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelectVariant(active ? null : variant.id)}
              aria-pressed={active}
              className={`relative rounded-xl border px-4 py-3 text-left text-sm transition-[transform,border-color,background-color] duration-200 ease-out hover:-translate-y-0.5 ${
                active ? "border-accent bg-accent/10 text-ink" : "border-line bg-bg text-ink hover:border-ink/40"
              }`}
            >
              <span className="block font-medium">{variant.label}</span>
              <span className={active ? "text-accent" : "text-ink-soft"}>ab {variant.getPrice()} €</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepIndicator({ step, onStepClick }) {
  return (
    <ol className="mb-10 flex items-center">
      {STEPS.map((label, i) => {
        const state = i < step ? "done" : i === step ? "current" : "upcoming";
        // Only completed steps can be jumped back to — the step ahead may
        // depend on data the user hasn't entered yet, so forward jumps stay
        // gated behind "Weiter" (which already enforces that).
        const clickable = state === "done";
        const Tag = clickable ? "button" : "div";
        return (
          <li key={label} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
            <Tag
              type={clickable ? "button" : undefined}
              onClick={clickable ? () => onStepClick(i) : undefined}
              aria-current={state === "current" ? "step" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-full ${
                clickable ? "cursor-pointer transition-opacity duration-150 ease-out hover:opacity-70" : ""
              }`}
            >
              <span
                className={`flex shrink-0 items-center justify-center rounded-full border text-[10px] transition-[transform,color,border-color,background-color] duration-200 ease-out ${
                  state === "done"
                    ? "h-5 w-5 border-accent bg-accent text-accent-ink"
                    : state === "current"
                      ? "h-6 w-6 border-ink text-ink font-semibold"
                      : "h-5 w-5 border-line text-ink-soft opacity-40"
                }`}
              >
                {state === "done" ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : i + 1}
              </span>
              <span
                className={`hidden text-xs font-medium uppercase tracking-widest sm:inline ${
                  state === "current" ? "text-ink" : state === "done" ? "text-accent" : "text-ink-soft opacity-40"
                }`}
              >
                {label}
              </span>
            </Tag>
            {i < STEPS.length - 1 && (
              <span className="relative mx-3 h-px flex-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
                <span
                  className="absolute inset-0 origin-left bg-accent transition-transform duration-300 ease-out"
                  style={{ transform: `scaleX(${i < step ? 1 : 0})` }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function PriceNode({ total, unknown, reducedMotion }) {
  if (unknown) return "auf Anfrage";
  return (
    <>
      ab <AnimatedNumber value={total} reducedMotion={reducedMotion} /> €
    </>
  );
}

// Desktop-only: sticks to the top of the viewport as the section scrolls by.
// Lives inside the normal content flow (position: sticky isn't affected by
// an ancestor's transform the way position: fixed is).
function DesktopPriceBar({ visible, total, unknown, reducedMotion }) {
  if (!visible) return null;
  return (
    <div className="sticky top-20 z-20 mb-6 hidden items-center justify-between rounded-2xl border border-accent/30 bg-bg-alt px-6 py-4 sm:flex">
      <div>
        <p className="text-xs uppercase tracking-widest text-ink-soft">Richtpreis</p>
        <p className="font-display text-3xl font-semibold text-ink">
          <PriceNode total={total} unknown={unknown} reducedMotion={reducedMotion} />
        </p>
      </div>
      <p className="max-w-[14rem] text-right text-xs text-ink-soft">
        Unverbindlich — finaler Preis nach kurzer Sichtprüfung vor Ort.
      </p>
    </div>
  );
}

// Mobile-only: pinned to the bottom of the viewport. Rendered as a sibling
// of (not nested inside) the reveal-animated content wrapper — that wrapper
// carries a `transform` (even `translate-y-0` counts) which would otherwise
// turn this `position: fixed` element into one contained by that wrapper's
// box instead of the real viewport.
function MobilePriceBar({ visible, total, unknown, reducedMotion }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-accent/30 bg-bg-alt px-5 py-3 sm:hidden">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-ink-soft">Richtpreis</span>
        <p className="font-display text-xl font-semibold text-ink">
          <PriceNode total={total} unknown={unknown} reducedMotion={reducedMotion} />
        </p>
      </div>
    </div>
  );
}

function Zusammenfassung({ vehicleLabel, leistungLabel, extraLabels, totalLabel }) {
  return (
    <div className="mb-8 rounded-2xl border border-line bg-bg-alt px-5 py-5">
      <p className="text-xs uppercase tracking-widest text-ink-soft">Zusammenfassung</p>
      <dl className="mt-3 flex flex-col gap-2 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-ink-soft">Fahrzeuggröße</dt>
          <dd className="text-right text-ink">{vehicleLabel}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-ink-soft">Leistung</dt>
          <dd className="text-right text-ink">{leistungLabel}</dd>
        </div>
        {extraLabels.length > 0 && (
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-ink-soft">Extras</dt>
            <dd className="text-right text-ink">{extraLabels.join(", ")}</dd>
          </div>
        )}
      </dl>
      <div className="mt-4 border-t border-line pt-4">
        <p className="font-display text-lg font-semibold text-ink">{totalLabel}</p>
        <p className="mt-1 text-xs text-ink-soft">
          Unverbindlicher Richtpreis. Der endgültige Preis richtet sich nach Zustand und tatsächlichem Aufwand.
        </p>
      </div>
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

function IndividuelleAnfrageBanner({ onClick }) {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-bg-alt px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-ink-soft">{INDIVIDUELLE_ANFRAGE_TEXT}</p>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ink px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-150 hover:bg-ink hover:text-bg sm:self-auto"
      >
        Individuelle Anfrage
      </button>
    </div>
  );
}

function PreisHinweis() {
  return (
    <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-soft">
      <p>
        Alle Preise verstehen sich als Einstiegspreise. Der endgültige Preis richtet sich nach Fahrzeuggröße,
        Zustand, Verschmutzungsgrad und tatsächlichem Arbeitsaufwand.
      </p>
      <p>Weitere individuelle Leistungen sind auf Anfrage möglich.</p>
    </div>
  );
}

function ContactFields({ idPrefix, contact, setContact, files, setFiles }) {
  // Object URLs for the thumbnail previews below — recreated whenever the
  // file list changes, revoked on cleanup so they don't leak memory.
  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  function update(field) {
    return (e) => setContact((c) => ({ ...c, [field]: e.target.value }));
  }

  function handleFiles(event) {
    const selected = Array.from(event.target.files ?? []);
    setFiles((prev) => [...prev, ...selected]);
    event.target.value = "";
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-name`} className="mb-2 block text-sm text-ink-soft">
            Name
          </label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            required
            value={contact.name}
            onChange={update("name")}
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-phone`} className="mb-2 block text-sm text-ink-soft">
            Telefon
          </label>
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            required
            value={contact.phone}
            onChange={update("phone")}
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-email`} className="mb-2 block text-sm text-ink-soft">
            E-Mail <span className="text-ink-soft/70">(optional)</span>
          </label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            value={contact.email}
            onChange={update("email")}
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-address`} className="mb-2 block text-sm text-ink-soft">
            Adresse <span className="text-ink-soft/70">(optional)</span>
          </label>
          <input
            id={`${idPrefix}-address`}
            type="text"
            value={contact.address}
            onChange={update("address")}
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-message`} className="mb-2 block text-sm text-ink-soft">
          Nachricht <span className="text-ink-soft/70">(optional)</span>
        </label>
        <textarea
          id={`${idPrefix}-message`}
          rows={4}
          value={contact.message}
          onChange={update("message")}
          placeholder="Beschreibe kurz dein Fahrzeug, deinen Wunsch, deinen Standort oder besondere Anforderungen."
          className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
        />
      </div>

      <div>
        <p className="mb-2 text-sm text-ink-soft">
          Fahrzeugdaten <span className="text-ink-soft/70">(optional)</span>
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <AutocompleteInput
            id={`${idPrefix}-marke`}
            ariaLabel="Marke"
            placeholder="Marke"
            value={contact.marke}
            onChange={(v) => setContact((c) => ({ ...c, marke: v }))}
            suggestions={CAR_MAKE_NAMES}
          />
          <AutocompleteInput
            id={`${idPrefix}-modell`}
            ariaLabel="Modell"
            placeholder="Modell"
            value={contact.modell}
            onChange={(v) => setContact((c) => ({ ...c, modell: v }))}
            suggestions={modelsForMake(contact.marke)}
          />
          <input
            type="text"
            aria-label="Baujahr"
            placeholder="Baujahr"
            value={contact.baujahr}
            onChange={update("baujahr")}
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
          />
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Fahrzeugdaten werden für die genaue Einschätzung benötigt, können aber auch später per WhatsApp
          übermittelt werden.
        </p>
      </div>

      <div>
        <span className="mb-2 block text-sm text-ink-soft">
          Fotos <span className="text-ink-soft/70">(optional)</span>
        </span>
        <label
          htmlFor={`${idPrefix}-photos`}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line px-6 py-8 text-center text-sm text-ink-soft transition-colors duration-150 hover:border-ink/40"
        >
          <ImagePlus size={22} strokeWidth={1.75} aria-hidden="true" />
          <span>Fahrzeugfotos hochladen</span>
          <input
            id={`${idPrefix}-photos`}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="sr-only"
          />
        </label>
        <p className="mt-2 text-xs text-ink-soft">
          Fotos helfen uns bei der Einschätzung und können hier oder später per WhatsApp gesendet werden.
        </p>
        {files.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center gap-2 rounded-full border border-line bg-bg-alt py-1.5 pl-1.5 pr-3 text-xs text-ink-soft"
              >
                {previews[i] && (
                  <img
                    src={previews[i]}
                    alt=""
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                )}
                <span className="max-w-[9rem] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={`${file.name} entfernen`}
                  className="shrink-0 text-ink-soft transition-colors duration-150 hover:text-ink"
                >
                  <X size={12} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Wraps the "Weiter" button so it drifts a few px toward the cursor while
// hovered — a plain `transform: translate(...)` written straight to the DOM
// on mousemove (no React state per frame), reset on mouseleave.
function MagneticWrap({ children, disabled = false }) {
  const ref = useRef(null);

  function handleMove(event) {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (event.clientX - rect.left - rect.width / 2) * 0.25;
    const dy = (event.clientY - rect.top - rect.height / 2) * 0.25;
    ref.current.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function handleLeave() {
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
  }

  return (
    <span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="inline-block transition-transform duration-150 ease-out will-change-transform"
    >
      {children}
    </span>
  );
}

const EMPTY_CONTACT = {
  name: "",
  phone: "",
  email: "",
  address: "",
  message: "",
  marke: "",
  modell: "",
  baujahr: "",
};

function buildMailtoHref(subject, lines, contact, files) {
  const body = [
    ...lines,
    "",
    `Name: ${contact.name}`,
    `Telefon: ${contact.phone}`,
    contact.email ? `E-Mail: ${contact.email}` : null,
    contact.address ? `Adresse: ${contact.address}` : null,
    contact.marke ? `Marke: ${contact.marke}` : null,
    contact.modell ? `Modell: ${contact.modell}` : null,
    contact.baujahr ? `Baujahr: ${contact.baujahr}` : null,
    contact.message ? `Nachricht: ${contact.message}` : null,
    files.length ? `Fotos: ${files.length} Datei(en) ausgewählt — bitte manuell an diese E-Mail anhängen.` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Kalkulator() {
  const [ref, inView] = useInView();
  const [mode, setMode] = useState("calculator");
  const reducedMotion = usePrefersReducedMotion();

  const [step, setStep] = useState(0);
  const [vehicleSizeId, setVehicleSizeId] = useState(null);
  const [leistungId, setLeistungId] = useState(null);
  const [extraIds, setExtraIds] = useState([]);
  const [lederVariantId, setLederVariantId] = useState(null);
  const [contact, setContact] = useState(EMPTY_CONTACT);
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const [customContact, setCustomContact] = useState(EMPTY_CONTACT);
  const [customFiles, setCustomFiles] = useState([]);
  const [customSubmitted, setCustomSubmitted] = useState(false);

  const lederExtra = EXTRAS.find((e) => e.variants);
  const simpleExtras = EXTRAS.filter((e) => !e.variants);

  const selectedSize = VEHICLE_SIZES.find((v) => v.id === vehicleSizeId) ?? null;
  const selectedLeistung = LEISTUNGEN.find((l) => l.id === leistungId) ?? null;
  // Extras already bundled into the chosen Leistung package (e.g. One-Step-Politur is
  // included in Komplett-Aufbereitung + Lackschutz) are hidden and excluded from pricing here.
  const visibleSimpleExtras = simpleExtras.filter(
    (e) => !selectedLeistung?.includesExtraIds?.includes(e.id)
  );
  const selectedSimpleExtras = visibleSimpleExtras.filter((e) => extraIds.includes(e.id));
  const lederVariant = lederExtra?.variants.find((v) => v.id === lederVariantId) ?? null;
  const anyExtraSelected = extraIds.length > 0 || lederVariantId != null;

  const leistungPrice = selectedLeistung && vehicleSizeId ? selectedLeistung.getPrice(vehicleSizeId) : null;
  const extrasPriceUnknown = selectedSimpleExtras.some((e) => e.getPrice(vehicleSizeId) == null);
  const extrasTotal =
    selectedSimpleExtras.reduce((sum, e) => sum + (e.getPrice(vehicleSizeId) ?? 0), 0) +
    (lederVariant ? lederVariant.getPrice() : 0);
  const totalPrice = (leistungPrice ?? 0) + extrasTotal;
  const priceUnknown = Boolean(leistungId) && (leistungPrice == null || extrasPriceUnknown);

  // The sticky price bar reflects only what's been reached so far in the
  // flow, not what's already picked further ahead — otherwise jumping back
  // to Leistung after having chosen Extras shows a total that doesn't match
  // anything visible on screen. Selections themselves are never cleared, so
  // moving forward again picks the full total right back up.
  const displayedExtrasTotal = step >= 2 ? extrasTotal : 0;
  const displayedTotalPrice = (leistungPrice ?? 0) + displayedExtrasTotal;
  const displayedPriceUnknown =
    Boolean(leistungId) && (leistungPrice == null || (step >= 2 && extrasPriceUnknown));

  function toggleExtra(id) {
    setExtraIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const canGoNext = step === 0 ? Boolean(vehicleSizeId) : step === 1 ? Boolean(leistungId) : true;

  function goNext() {
    if (!canGoNext) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const extraLabels = [
      ...selectedSimpleExtras.map((e) => e.label),
      lederVariant ? `${lederExtra.label} – ${lederVariant.label}` : null,
    ].filter(Boolean);

    const subject = `Aufbereitungsanfrage – ${selectedLeistung?.label ?? "Kalkulator"}`;
    const lines = [
      `Fahrzeuggröße: ${selectedSize?.label ?? "–"}`,
      `Leistung: ${selectedLeistung?.label ?? "–"}`,
      extraLabels.length ? `Extras: ${extraLabels.join(", ")}` : "Extras: keine",
      `Richtpreis: ${priceUnknown ? "auf Anfrage" : `ab ${totalPrice} €`}`,
    ];
    const href = buildMailtoHref(subject, lines, contact, files);
    window.location.href = href;
    setSubmitted(true);
  }

  function resetCalculator() {
    setStep(0);
    setVehicleSizeId(null);
    setLeistungId(null);
    setExtraIds([]);
    setLederVariantId(null);
    setContact(EMPTY_CONTACT);
    setFiles([]);
    setSubmitted(false);
  }

  function handleCustomSubmit(event) {
    event.preventDefault();
    window.location.href = buildMailtoHref("Individuelle Aufbereitungsanfrage", [], customContact, customFiles);
    setCustomSubmitted(true);
  }

  function resetCustom() {
    setCustomContact(EMPTY_CONTACT);
    setCustomFiles([]);
    setCustomSubmitted(false);
  }

  const revealClass = `transition-[opacity,transform] duration-700 ease-out ${
    inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
  }`;

  const stickyBarVisible = step > 0 && !submitted && Boolean(selectedLeistung);

  if (mode === "custom") {
    return (
      <section id="leistungen" className="relative border-b border-line bg-bg px-6 py-24 md:px-10">
        <SectionGrain />
        <div ref={ref} className={`relative z-10 mx-auto max-w-7xl ${revealClass}`}>
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
            subtitle={INDIVIDUELLE_ANFRAGE_TEXT}
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
              <form onSubmit={handleCustomSubmit} key="custom-form" className="animate-step-fade">
                <ContactFields
                  idPrefix="custom"
                  contact={customContact}
                  setContact={setCustomContact}
                  files={customFiles}
                  setFiles={setCustomFiles}
                />
                <Button type="submit" variant="primary" className="mt-6 self-start">
                  Anfrage senden
                </Button>
              </form>
            )}
          </div>

          <PreisHinweis />
        </div>
      </section>
    );
  }

  return (
    <section id="leistungen" className="relative border-b border-line bg-bg px-6 py-24 md:px-10">
      <SectionGrain />
      <div ref={ref} className={`relative z-10 mx-auto max-w-7xl ${revealClass}`}>
        <SectionHeader
          eyebrow="Kalkulator"
          title="Berechne deinen Richtpreis"
          subtitle="In wenigen Schritten zum unverbindlichen Preis — deine Kontaktdaten brauchen wir erst ganz am Ende."
        />

        {!submitted && <IndividuelleAnfrageBanner onClick={() => setMode("custom")} />}

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
              <StepIndicator step={step} onStepClick={setStep} />

              <DesktopPriceBar
                visible={stickyBarVisible}
                total={displayedTotalPrice}
                unknown={displayedPriceUnknown}
                reducedMotion={reducedMotion}
              />

              <div key={step} className="animate-step-fade">
                {step === 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {VEHICLE_SIZES.map((vs) => (
                      <OptionCard
                        key={vs.id}
                        selected={vehicleSizeId === vs.id}
                        dimmed={Boolean(vehicleSizeId)}
                        title={vs.label}
                        hint={vs.hint}
                        icon={VEHICLE_SIZE_ICONS[vs.id]}
                        onClick={() => setVehicleSizeId(vs.id)}
                      />
                    ))}
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-3">
                    {LEISTUNGEN.map((l) => (
                      <OptionCard
                        key={l.id}
                        selected={leistungId === l.id}
                        dimmed={Boolean(leistungId)}
                        title={l.label}
                        description={l.description}
                        priceLabel={priceLabelFor(l, vehicleSizeId)}
                        onClick={() => setLeistungId(l.id)}
                      />
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {visibleSimpleExtras.map((extra) => (
                      <OptionCard
                        key={extra.id}
                        selected={extraIds.includes(extra.id)}
                        dimmed={anyExtraSelected}
                        title={extra.label}
                        description={extra.description}
                        priceLabel={priceLabelFor(extra, vehicleSizeId)}
                        onClick={() => toggleExtra(extra.id)}
                      />
                    ))}
                    {lederExtra && (
                      <LederExtraCard
                        extra={lederExtra}
                        selectedVariantId={lederVariantId}
                        onSelectVariant={setLederVariantId}
                      />
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <Zusammenfassung
                      vehicleLabel={selectedSize?.label ?? "–"}
                      leistungLabel={selectedLeistung?.label ?? "–"}
                      extraLabels={[
                        ...selectedSimpleExtras.map((e) => e.label),
                        lederVariant ? `${lederExtra.label} – ${lederVariant.label}` : null,
                      ].filter(Boolean)}
                      totalLabel={priceUnknown ? "Preis auf Anfrage" : `Richtpreis ab ${totalPrice} €`}
                    />
                    <form id="contact-form" onSubmit={handleSubmit}>
                      <ContactFields
                        idPrefix="contact"
                        contact={contact}
                        setContact={setContact}
                        files={files}
                        setFiles={setFiles}
                      />
                    </form>
                  </div>
                )}
              </div>

              <div className={`mt-8 flex items-center justify-between ${stickyBarVisible ? "mb-20 sm:mb-0" : ""}`}>
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors duration-150 hover:text-ink disabled:pointer-events-none disabled:opacity-0"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Zurück
                </button>
                {step === 3 ? (
                  <Button key="submit" type="submit" form="contact-form" variant="primary">
                    Anfrage senden
                  </Button>
                ) : (
                  <MagneticWrap disabled={reducedMotion}>
                    <Button
                      key="next"
                      type="button"
                      variant="primary"
                      onClick={goNext}
                      className={!canGoNext ? "pointer-events-none opacity-40" : ""}
                    >
                      Weiter
                    </Button>
                  </MagneticWrap>
                )}
              </div>
            </div>
          )}
        </div>

        <PreisHinweis />
      </div>

      <MobilePriceBar
        visible={stickyBarVisible}
        total={displayedTotalPrice}
        unknown={displayedPriceUnknown}
        reducedMotion={reducedMotion}
      />
    </section>
  );
}
