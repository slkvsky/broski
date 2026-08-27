import { useEffect } from "react";

export default function DatenschutzPage() {
  useEffect(() => {
    document.title = "Broski Detailing — Datenschutz";
    return () => {
      document.title = "Broski Detailing — Wuppertal";
    };
  }, []);

  return (
    <div className="pt-16 md:pt-[73px]">
      <section className="bg-bg px-6 py-24 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-soft">Rechtliches</p>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Datenschutzerklärung</h1>

          <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-dashed border-line text-sm text-ink-soft">
            Platzhalter-Inhalt — folgt
          </div>
        </div>
      </section>
    </div>
  );
}
