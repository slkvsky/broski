import { lazy, Suspense, useState } from "react";
import Button from "./Button.jsx";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

// Code-split: only motion-allowed visitors render this branch, so
// reduced-motion visitors never fetch the shader package at all.
const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering })),
);

const STATS = [
  { value: "500+", label: "Fahrzeuge" },
  { value: "8", label: "Jahre Erfahrung" },
  { value: "4.9★", label: "Bewertung" },
];

// Static, zero-cost stand-in for the shader — shown under reduced-motion,
// and briefly while the shader chunk loads on any device.
function StaticGlow() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 60% 55% at 72% 32%, rgba(245, 196, 0, 0.35), rgba(245, 196, 0, 0) 70%)",
      }}
      aria-hidden="true"
    />
  );
}

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const showShader = !prefersReducedMotion;

  return (
    <section
      id="top"
      className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-dark-bg pt-16 md:pt-[73px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showShader ? (
        <Suspense fallback={<StaticGlow />}>
          <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]">
            <Dithering
              colorBack="#00000000"
              colorFront="#F5C400"
              shape="warp"
              type="4x4"
              size={4}
              speed={isHovered ? 0.5 : 0.15}
              className="size-full"
              minPixelRatio={1}
            />
          </div>
        </Suspense>
      ) : (
        <StaticGlow />
      )}

      <div className="animate-fade-up relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <h1 className="mb-8 font-display text-5xl font-medium leading-[1.05] tracking-tight text-dark-ink md:text-7xl lg:text-8xl">
          Platzhalter
          <br />
          <span className="text-dark-ink-soft">&Uuml;berschrift.</span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-dark-ink-soft md:text-xl">
          Platzhalter-Untertext: kurze Beschreibung der Leistung, des
          Versprechens und der Zielgruppe folgt hier sp&auml;ter.
        </p>

        <Button as="a" href="#kontakt" variant="primary" className="mb-12 h-14 px-10 text-base">
          Termin anfragen
        </Button>

        <div className="grid grid-cols-3 gap-8 border-t border-dark-ink/10 pt-6">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-xl font-semibold text-dark-ink sm:text-2xl">
                {stat.value}
              </div>
              <div className="mt-1 text-[11px] leading-snug text-dark-ink-soft">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
