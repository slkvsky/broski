import { useEffect, useRef } from "react";
import { useInView } from "../hooks/useInView.js";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

export default function SloganDivider() {
  const [sectionRef, inView] = useInView();
  const textRef = useRef(null);
  const rafRef = useRef(null);
  const tickingRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    const update = () => {
      tickingRef.current = false;
      const rect = section.getBoundingClientRect();
      const distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
      const offset = Math.max(-50, Math.min(50, -distanceFromCenter * 0.15));
      text.style.transform = `translateY(${offset}px)`;
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-accent py-14 md:py-20">
      <div
        className={`transition-opacity duration-700 ease-out ${inView ? "opacity-100" : "opacity-0"}`}
      >
        <p
          ref={textRef}
          className="mx-auto max-w-4xl px-6 text-center font-display text-3xl font-bold uppercase leading-tight tracking-tight text-accent-ink sm:text-5xl md:text-6xl"
        >
          Dreck war gestern.
        </p>
      </div>
    </section>
  );
}
