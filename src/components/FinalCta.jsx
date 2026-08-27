import Button from "./Button.jsx";
import { useInView } from "../hooks/useInView.js";

export default function FinalCta() {
  const [ref, inView] = useInView();

  return (
    <section className="bg-dark-bg px-6 py-24 md:px-10 md:py-32">
      <div
        ref={ref}
        className={`mx-auto max-w-3xl text-center transition-[opacity,transform] duration-700 ease-out ${
          inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
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
