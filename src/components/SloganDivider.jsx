// Small breathing-room section between the Vorher/Nachher scroll-video and
// Kalkulator — no content of its own, just blends the two dark sections
// apart with a bit of space instead of a hard cut.
export default function SloganDivider() {
  return (
    <section className="relative overflow-hidden bg-bg py-10 md:py-14">
      {/* Faded in from the top instead of switched on at full strength at
          y=0 — a flat, textureless tail (ScrollVideoScrub's own blend-to-
          dark-bg layer) meeting instant grain read as a seam even though
          the underlying color already matches exactly. Taper matches the
          18% stop ScrollVideoScrub's own ambient layer already uses. */}
      <div
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04]"
        aria-hidden="true"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
        }}
      />
    </section>
  );
}
