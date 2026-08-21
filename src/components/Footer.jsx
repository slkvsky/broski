export default function Footer() {
  return (
    <footer className="px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-ink-soft sm:flex-row">
        <span className="font-display font-semibold text-ink">
          BROSKI<span className="text-accent">.</span>
        </span>
        <span>Wuppertal, Deutschland</span>
        <span>&copy; {new Date().getFullYear()} Broski Detailing — Platzhalter</span>
      </div>
    </footer>
  );
}
