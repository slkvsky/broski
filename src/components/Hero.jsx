import Button from "./Button.jsx";
import carImage from "../assets/car.webp";

// Intrinsic size of the exported asset — declared on the <img> so the
// browser reserves the right box before it loads (no layout shift on the
// largest element of the page).
const CAR_W = 2049;
const CAR_H = 727;

function ScrollCue({ className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`} aria-hidden="true">
      <span className="text-[10px] uppercase tracking-[0.3em] text-dark-ink-soft [writing-mode:vertical-lr]">
        Scroll
      </span>
      <span className="h-10 w-px bg-dark-ink/15" />
      <span className="animate-scroll-cue block h-1.5 w-1.5 rotate-45 border-b border-r border-dark-ink-soft" />
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-dark-bg pt-16 md:pt-[73px]"
    >
      {/* Stage: wordmark sits behind the car, both scale together */}
      <div className="relative flex flex-1 items-center justify-center">
        {/* shrink-0: without it the flex parent squeezes the intentional
            over-100% bleed back down to the viewport width on small screens */}
        <div className="@container relative w-[125%] max-w-none shrink-0 sm:w-full sm:max-w-[1250px]">
          {/* Sized in container-query units so the wordmark keeps the same
              proportion to the car at every viewport, capped car width included. */}
          {/* On phones the car bleeds past the viewport, so the wordmark is
              sized down (it must stay fully readable) and lifted higher to
              still clear the roofline. */}
          <h1 className="pointer-events-none absolute inset-x-0 bottom-[72%] z-0 select-none text-center font-display text-[17cqw] font-bold uppercase leading-none tracking-[0.01em] text-dark-ink/[0.08] [mask-image:linear-gradient(to_bottom,black_38%,transparent_92%)] sm:bottom-[46%] sm:text-[23cqw]">
            <span className="sr-only">
              Broski Detailing — Fahrzeugaufbereitung in Wuppertal
            </span>
            <span aria-hidden="true">Broski</span>
          </h1>

          <img
            src={carImage}
            alt=""
            width={CAR_W}
            height={CAR_H}
            fetchPriority="high"
            decoding="async"
            className="animate-fade-up relative z-10 block w-full translate-y-[6%] sm:translate-y-[9%]"
          />
        </div>
      </div>

      {/* Copy anchored bottom-left, clear of the car */}
      <div className="relative z-20 mx-auto flex w-full max-w-7xl items-end justify-between gap-8 px-6 pb-12 md:px-10 md:pb-16">
        <div className="max-w-md">
          <p
            className="animate-fade-up text-base leading-relaxed text-dark-ink-soft md:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Platzhalter-Untertext: kurze Beschreibung der Leistung, des
            Versprechens und der Zielgruppe folgt hier sp&auml;ter.
          </p>

          <Button
            as="a"
            href="#kontakt"
            variant="primary"
            className="animate-fade-up mt-8"
            style={{ animationDelay: "220ms" }}
          >
            Termin anfragen
          </Button>
        </div>

        <ScrollCue className="hidden lg:flex" />
      </div>
    </section>
  );
}
