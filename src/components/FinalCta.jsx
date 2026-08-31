import Button from "./Button.jsx";
import { useInView } from "../hooks/useInView.js";

export default function FinalCta() {
  const [ref, inView] = useInView();

  return (
    <section className="relative overflow-hidden bg-dark-bg px-6 py-24 md:px-10 md:py-32">
      {/* Ghost wordmark bookends the Hero's own wordmark treatment, so the
          page opens and closes on the same visual signature. Fades in with
          the section instead of on load, since there's no car to gate on. */}
      <h3
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none text-center font-display text-[20vw] font-bold uppercase leading-none tracking-[0.01em] text-dark-ink/[0.06] [mask-image:linear-gradient(to_bottom,transparent,black_40%,black_60%,transparent)] transition-opacity duration-[1400ms] ease-out sm:text-[16vw] ${
          inView ? "opacity-100" : "opacity-0"
        }`}
      >
        Broski
      </h3>

      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-3xl text-center transition-[opacity,transform] duration-700 ease-out ${
          inView ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
        }`}
      >
        <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-tight text-dark-ink sm:text-5xl">
          Bereit für mehr als sauber?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-dark-ink-soft">
          Richtpreis in wenigen Schritten, Termin direkt bei dir vor Ort — starte jetzt deine Anfrage.
        </p>

        <Button as="a" href="/#leistungen" variant="primary" className="mt-8 uppercase">
          Aufbereitung anfragen
        </Button>
      </div>
    </section>
  );
}
