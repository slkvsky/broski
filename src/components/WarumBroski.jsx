import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Car, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const REASONS = [
  {
    number: "01",
    icon: Sparkles,
    title: "Individueller Anspruch",
    text: "Jedes Fahrzeug bekommt ein Vorgehen, das zu seinem Zustand und deinen Wünschen passt — keine Aufbereitung von der Stange.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Qualität ohne Kompromisse",
    text: "Hochwertige Produkte, geprüfte Abläufe, sorgfältige Ausführung — bei jedem Auftrag, unabhängig vom Umfang.",
  },
  {
    number: "03",
    icon: ScanSearch,
    title: "Detail für Detail",
    text: "Vom Türfalz bis zur Felgeninnenseite — wir schauen genau hin, wo andere längst fertig sind.",
  },
  {
    number: "04",
    icon: Car,
    title: "Mobil bei Ihnen",
    text: "Wir kommen zu dir — nach Hause, ins Büro, auf den Firmenparkplatz. Du musst dafür nirgendwo hinfahren.",
  },
];

// GSAP tweens run outside React and ignore the site's global
// prefers-reduced-motion CSS rule (that rule only mutes CSS
// transitions/animations), so scroll-linked motion needs its own check.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event) => setReduced(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}

function ContentBlock({ icon: Icon, iconGlowRef, title, text, reducedMotion, side }) {
  // Mobile always reads left-aligned next to the badge; the mirrored,
  // spine-hugging alignment only kicks in once there's room either side (sm+).
  const alignClasses = side === "left" ? "items-start text-left sm:items-end sm:text-right" : "items-start text-left";

  return (
    <div className={`flex min-w-0 flex-1 flex-col pt-1.5 ${alignClasses}`}>
      <div className="relative mb-3 h-5 w-5">
        <Icon size={20} strokeWidth={1.75} className="absolute inset-0 text-ink" aria-hidden="true" />
        <span
          ref={iconGlowRef}
          aria-hidden="true"
          className="absolute inset-0"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          <Icon size={20} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
        </span>
      </div>
      <h3 className="font-display text-lg font-medium text-ink sm:text-xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">{text}</p>
    </div>
  );
}

function ReasonItem({ number, icon, title, text, reducedMotion, side }) {
  const itemRef = useRef(null);
  const numberGlowRef = useRef(null);
  const iconGlowRef = useRef(null);
  const isLeft = side === "left";

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Opacity + a crossfaded accent-colored overlay (number badge, icon) —
      // both driven by the same scrub so the item "activates" as it passes
      // through the same viewport band the connecting line grows through.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top 68%",
            end: "top 42%",
            scrub: true,
          },
        })
        .fromTo(itemRef.current, { opacity: 0.35 }, { opacity: 1, ease: "none" }, 0)
        .fromTo(numberGlowRef.current, { opacity: 0 }, { opacity: 1, ease: "none" }, 0)
        .fromTo(iconGlowRef.current, { opacity: 0 }, { opacity: 1, ease: "none" }, 0);
    }, itemRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={itemRef}
      className="relative flex items-start gap-6 sm:grid sm:grid-cols-[1fr_2.5rem_1fr] sm:items-start sm:gap-10"
      style={{ opacity: reducedMotion ? 1 : 0.35 }}
    >
      <div className="order-2 sm:order-none">
        {isLeft && (
          <ContentBlock
            icon={icon}
            iconGlowRef={iconGlowRef}
            title={title}
            text={text}
            reducedMotion={reducedMotion}
            side="left"
          />
        )}
      </div>

      <div className="relative z-10 order-1 h-10 w-10 shrink-0 sm:order-none">
        <div className="absolute inset-0 flex items-center justify-center rounded-full border border-line bg-bg font-mono text-sm text-ink-soft">
          {number}
        </div>
        <div
          ref={numberGlowRef}
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center rounded-full border border-accent bg-bg font-mono text-sm text-accent"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          {number}
        </div>
      </div>

      <div className="order-2 sm:order-none">
        {!isLeft && (
          <ContentBlock
            icon={icon}
            iconGlowRef={iconGlowRef}
            title={title}
            text={text}
            reducedMotion={reducedMotion}
            side="right"
          />
        )}
      </div>
    </div>
  );
}

export default function WarumBroski() {
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    gsap.set(progressRef.current, { xPercent: -50, scaleY: reducedMotion ? 1 : 0 });
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(progressRef.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 68%",
          end: "bottom 42%",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="warum-broski" className="border-b border-line bg-bg px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft">Warum Broski</p>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Was uns unterscheidet</h2>
        </div>

        <div ref={containerRef} className="relative mt-16 flex flex-col gap-[60px] md:mt-20">
          {/* Line sits under the badge column: left edge on mobile (badges
              are left-aligned there), dead center once items split left/right. */}
          <div
            className="absolute left-5 top-0 bottom-0 w-px -translate-x-1/2 bg-line sm:left-1/2"
            aria-hidden="true"
          />
          <div
            ref={progressRef}
            className="absolute left-5 top-0 w-px origin-top bg-accent sm:left-1/2"
            style={{ height: "100%" }}
            aria-hidden="true"
          />

          {REASONS.map((reason, index) => (
            <ReasonItem
              key={reason.number}
              {...reason}
              side={index % 2 === 0 ? "left" : "right"}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
