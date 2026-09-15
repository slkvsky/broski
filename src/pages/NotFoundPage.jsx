import { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "Broski Detailing — Seite nicht gefunden";
    return () => {
      document.title = "Broski Detailing — Wuppertal";
    };
  }, []);

  return (
    <div className="pt-16 md:pt-[73px]">
      <section className="bg-bg px-6 py-24 text-center md:px-10">
        <div className="mx-auto max-w-md">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft">404</p>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Seite nicht gefunden</h1>
          <p className="mx-auto mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
            Die aufgerufene Seite existiert nicht oder wurde verschoben.
          </p>
          <Button as={Link} to="/" variant="primary" className="mx-auto mt-8 w-fit">
            Zur Startseite
          </Button>
        </div>
      </section>
    </div>
  );
}
