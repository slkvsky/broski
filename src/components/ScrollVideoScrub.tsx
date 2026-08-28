import { useEffect, useRef, useState } from "react";

interface ScrollVideoScrubProps {
  videoSrc: string;
  eyebrow?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

// GSAP/JS-driven scroll effects ignore the site's global prefers-reduced-motion
// CSS rule (that rule only mutes CSS transitions/animations), so scroll-linked
// motion needs its own check — same pattern as WarumBroski.jsx's usePrefersReducedMotion.
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}

export default function ScrollVideoScrub({
  videoSrc,
  eyebrow = "Vorher / Nachher",
  beforeLabel = "Vorher",
  afterLabel = "Nachher",
}: ScrollVideoScrubProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const tickingRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  // Metadata (and therefore video.duration) isn't available until the
  // browser has parsed the file header, so scrubbing is gated on that
  // rather than assumed to be ready on mount.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setReady(false);
    video.preload = "auto";

    const handleLoadedMetadata = () => setReady(true);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Metadata may already be parsed (e.g. a cached video) before this
    // listener is attached, in which case the event never fires.
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      setReady(true);
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [videoSrc]);

  useEffect(() => {
    if (!ready || reducedMotion) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || !Number.isFinite(video.duration)) return;

    const updateScrub = () => {
      tickingRef.current = false;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const progress = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1);
      const targetTime = progress * video.duration;
      if (Number.isFinite(targetTime)) {
        video.currentTime = targetTime;
      }
      setProgress(progress);
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      rafRef.current = requestAnimationFrame(updateScrub);
    };

    // Sync immediately so the video reflects the current scroll position
    // without waiting for the first scroll event.
    updateScrub();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, reducedMotion]);

  // When scroll-scrubbing is disabled for reduced motion, still show the
  // before/after transformation — just decoupled from scroll input. Progress
  // (and therefore the Vorher/Nachher label + progress bar) now tracks the
  // video's own playback time instead of scroll position.
  useEffect(() => {
    if (!ready || !reducedMotion) return;

    const video = videoRef.current;
    if (!video) return;

    video.loop = true;
    video.play().catch(() => {});

    const handleTimeUpdate = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        setProgress(video.currentTime / video.duration);
      }
    };
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [ready, reducedMotion]);

  const isAfter = progress > 0.5;

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-dark-bg">
      <div className="sticky top-0 flex h-dvh w-full items-center justify-center overflow-hidden px-6 py-16 md:px-10">
        {/* Image (+ its darkening overlay) stays fully visible throughout;
            only the top/bottom edges fade into the flat section color so the
            pin boundary reads as a soft vignette instead of a hard cut. The
            mask covers both layers so the edge settles on the section's own
            bg-dark-bg (#0b0b0c) rather than a darker black. */}
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/premium-auto-dark-background-16x9.png)" }}
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl ring-1 ring-dark-ink/10">
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />

          {/* Keeps the eyebrow/label row and heading legible over any frame
              of the clip without dimming the footage itself. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/50" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 md:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-dark-ink-soft">
              {eyebrow}
            </p>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em]">
              <span className={isAfter ? "text-dark-ink-soft" : "text-accent"}>
                {beforeLabel}
              </span>
              <span className="text-dark-ink-soft/40">/</span>
              <span className={isAfter ? "text-accent" : "text-dark-ink-soft"}>
                {afterLabel}
              </span>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-dark-ink sm:text-3xl">
              {isAfter ? afterLabel : beforeLabel}
            </h2>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-dark-ink/10">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
