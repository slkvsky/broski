import { useEffect, useRef, useState } from "react";

interface ScrollVideoScrubProps {
  videoSrc: string;
  eyebrow?: string;
  beforeLabel?: string;
  afterLabel?: string;
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
    if (!ready) return;

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
  }, [ready]);

  const isAfter = progress > 0.5;

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-dark-bg">
      <div className="sticky top-0 flex h-dvh w-full items-center justify-center overflow-hidden px-6 py-16 md:px-10">
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
