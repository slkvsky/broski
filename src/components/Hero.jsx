import { useEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";
import Button from "./Button.jsx";
import { InstagramIcon, WhatsappIcon } from "./icons/SocialIcons.jsx";
import { CONTACT_EMAIL, WHATSAPP_HREF } from "../data/services.js";
import carImage from "../assets/car.png";

// Instagram placeholder until the real profile is ready, same pattern as
// the footer's SOCIAL_LINKS.
const HERO_SOCIAL_LINKS = [
  { label: "WhatsApp", href: WHATSAPP_HREF, icon: WhatsappIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "E-Mail", href: `mailto:${CONTACT_EMAIL}`, icon: Mail },
];

// Intrinsic size of the exported asset — declared on the <img> so the
// browser reserves the right box before it loads (no layout shift on the
// largest element of the page).
const CAR_W = 1927;
const CAR_H = 816;

function ScrollCue({ className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`} aria-hidden="true">
      <span className="text-[10px] uppercase tracking-[0.3em] text-dark-ink-soft [writing-mode:vertical-lr]">
        Scroll
      </span>
      <span className="h-10 w-px bg-dark-ink/15" />
      <span className="block h-1.5 w-1.5 rotate-45 border-b border-r border-dark-ink-soft" />
    </div>
  );
}

export default function Hero() {
  // The car photo is a large PNG — on a slow connection it can still be
  // decoding well after a fixed-delay CSS animation would have finished,
  // so the reveal is gated on the actual load event instead of mount.
  const [carLoaded, setCarLoaded] = useState(false);
  const carRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    if (carRef.current?.complete) setCarLoaded(true);
  }, []);

  // Tracks the cursor in percentages of the car image's own rendered box
  // (not the stage) so the spotlight lines up correctly even though the
  // image is visually offset by its translate-y utility. Written straight
  // to the DOM via CSS custom properties to skip a re-render per move.
  function handleCarMouseMove(event) {
    const img = carRef.current;
    const stage = stageRef.current;
    if (!img || !stage) return;
    const rect = img.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    stage.style.setProperty("--spot-x", `${x}%`);
    stage.style.setProperty("--spot-y", `${y}%`);
    stage.style.setProperty("--spot-opacity", "1");
  }

  function handleCarMouseLeave() {
    stageRef.current?.style.setProperty("--spot-opacity", "0");
  }

  return (
    <section
      id="top"
      className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-dark-bg pt-16 md:pt-[73px]"
    >
      {/* Stage: wordmark sits behind the car, both scale together */}
      <div className="relative flex flex-1 items-center justify-center">
        {/* shrink-0: without it the flex parent squeezes the intentional
            over-100% bleed back down to the viewport width on small screens */}
        <div
          ref={stageRef}
          className="@container relative w-[105%] max-w-none shrink-0 sm:w-full sm:max-w-[1250px]"
        >
          {/* Sized in container-query units so the wordmark keeps the same
              proportion to the car at every viewport, capped car width included. */}
          {/* On phones the car bleeds past the viewport, so the wordmark is
              sized down (it must stay fully readable) and lifted higher to
              still clear the roofline. */}
          <h1
            className={`pointer-events-none absolute inset-x-0 bottom-[72%] z-0 select-none text-center font-display text-[17cqw] font-bold uppercase leading-none tracking-[0.01em] text-dark-ink/[0.08] [mask-image:linear-gradient(to_bottom,black_38%,transparent_92%)] sm:bottom-[46%] sm:text-[23cqw] ${carLoaded ? "animate-fade-up" : "opacity-0"}`}
            style={carLoaded ? { animationDelay: "450ms" } : undefined}
          >
            <span className="sr-only">
              Broski Detailing — Fahrzeugaufbereitung in Wuppertal
            </span>
            <span aria-hidden="true">Broski</span>
          </h1>

          <img
            ref={carRef}
            src={carImage}
            alt=""
            width={CAR_W}
            height={CAR_H}
            fetchPriority="high"
            decoding="async"
            draggable={false}
            onLoad={() => setCarLoaded(true)}
            onError={() => setCarLoaded(true)}
            onMouseMove={handleCarMouseMove}
            onMouseLeave={handleCarMouseLeave}
            className={`relative z-10 block w-full translate-y-[6%] select-none grayscale brightness-75 sm:translate-y-[9%] ${carLoaded ? "animate-car-reveal" : "opacity-0"}`}
          />

          {/* Color copy of the same photo, masked to a small circle that
              follows the cursor — reveals color only where the pointer is,
              everything else stays grayscale. */}
          {carLoaded && (
            <img
              src={carImage}
              alt=""
              aria-hidden="true"
              width={CAR_W}
              height={CAR_H}
              className="car-spotlight pointer-events-none absolute inset-0 z-10 block w-full translate-y-[6%] brightness-75 sm:translate-y-[9%]"
            />
          )}
        </div>
      </div>

      {/* Copy anchored bottom-left, clear of the car */}
      <div className="relative z-20 mx-auto flex w-full max-w-7xl items-end justify-between gap-8 px-6 pb-12 md:px-10 md:pb-16">
        <div className="max-w-md">
          <p
            className={`text-base leading-relaxed text-dark-ink-soft md:text-lg ${carLoaded ? "animate-fade-up" : "opacity-0"}`}
            style={carLoaded ? { animationDelay: "700ms" } : undefined}
          >
            Platzhalter-Untertext: kurze Beschreibung der Leistung, des
            Versprechens und der Zielgruppe folgt hier sp&auml;ter.
          </p>

          <div
            className={`mt-8 flex items-center gap-5 ${carLoaded ? "animate-fade-up" : "opacity-0"}`}
            style={carLoaded ? { animationDelay: "800ms" } : undefined}
          >
            <Button as="a" href="#kontakt" variant="primary">
              Termin anfragen
            </Button>

            <div className="flex items-center gap-3">
              {HERO_SOCIAL_LINKS.map(({ label, href, icon: Icon }) => {
                const isMail = href.startsWith("mailto:");
                return (
                  <a
                    key={label}
                    href={href}
                    target={isMail ? undefined : "_blank"}
                    rel={isMail ? undefined : "noreferrer"}
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-dark-ink/15 text-dark-ink-soft transition-colors duration-150 hover:border-accent hover:text-accent"
                  >
                    <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <ScrollCue className="hidden lg:flex" />
      </div>
    </section>
  );
}
