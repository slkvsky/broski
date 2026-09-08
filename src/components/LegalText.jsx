// Shared building block for the Impressum / Datenschutz pages, kept in one
// place so both stay visually consistent and easy to extend.

export function LegalSection({ title, children }) {
  return (
    <section className="border-t border-line pt-8">
      <h2 className="font-display text-lg font-semibold text-ink sm:text-xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-soft sm:text-base">{children}</div>
    </section>
  );
}
