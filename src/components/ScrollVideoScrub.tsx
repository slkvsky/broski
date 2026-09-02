import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

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
  const ambientCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const tickingRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  // Ambient background: paints the video's current frame into a canvas
  // that's rendered heavily blurred and scaled up behind the card (see the
  // background layer in the markup below). Reuses the frame already
  // decoded for the visible <video> — no second network fetch.
  function drawAmbientFrame(video: HTMLVideoElement) {
    const canvas = ambientCanvasRef.current;
    if (!canvas || !video.videoWidth || !video.videoHeight) return;
    if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
    if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
  }

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
      drawAmbientFrame(video);
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      rafRef.current = requestAnimationFrame(updateScrub);
    };

    // iOS Safari won't paint any frame from a currentTime assignment alone —
    // the decoder has to have actually played at least once, or the video
    // stays a black rectangle no matter what currentTime is set to. Muted
    // playback is allowed to autoplay without a user gesture, so kick it off
    // and immediately pause to "prime" a frame before the first scroll-driven
    // seek. Sync immediately after so the video reflects the current scroll
    // position without waiting for the first scroll event.
    video
      .play()
      .then(() => video.pause())
      .catch(() => {})
      .finally(updateScrub);

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
      drawAmbientFrame(video);
    };
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [ready, reducedMotion]);

  const isAfter = progress > 0.5;
  // Holds fully visible through the first 4% of scroll (so a light nudge
  // doesn't instantly wipe it away), then fades out gradually through 18% —
  // a nudge for the "start scrolling" hint, not shown once reduced motion
  // is on (there's no meaningful "before you scroll" moment then, since
  // the card isn't scroll-scrubbed in that mode).
  const HINT_HOLD = 0.04;
  const HINT_FADE_END = 0.18;
  const hintOpacity =
    progress <= HINT_HOLD ? 1 : Math.max(0, 1 - (progress - HINT_HOLD) / (HINT_FADE_END - HINT_HOLD));

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-dark-bg">
      <div className="sticky top-0 flex h-dvh w-full items-center justify-center overflow-hidden px-6 py-16 md:px-10">
        {/* Background: the video's own current frame, scaled up and heavily
            blurred, so the space around the card reads as an intentional
            ambient glow instead of dead black space. Kept dark/desaturated
            so the card stays the clear focal point. */}
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          }}
        >
          <canvas
            ref={ambientCanvasRef}
            aria-hidden="true"
            className="h-full w-full scale-150 object-cover blur-[50px] brightness-50 saturate-75"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Blends the section into the flat dark-bg of whatever comes next.
            The mask on the background above fades its own imagery out, but
            never guarantees a pixel-perfect match to --color-bg — this
            unmasked layer does, closing the seam at the section boundary
            regardless of scroll position or overlay strength. Reaches a
            guaranteed flat plateau (not just an asymptotic gradient end)
            well before the true edge — Tailwind's from/to gradient
            interpolates in oklab and never truly settles at the target
            color, which left a faint residual band here. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, var(--color-dark-bg) 65%, var(--color-dark-bg) 100%)",
          }}
        />
        {/* Cheap insurance: guarantees the literal last row is flat opaque
            color regardless of any gradient-rasterization edge case. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-dark-bg" />

        <div className="relative w-full max-w-5xl">
          {/* Scroll hint, anchored just above the card so it fills the empty
              space regardless of viewport height. Holds, then fades out
              gradually as the user scrolls into the section. */}
          {!reducedMotion && (
            <div
              aria-hidden="true"
              style={{ opacity: hintOpacity }}
              className="absolute inset-x-0 bottom-full mb-6 flex flex-col items-center gap-2 text-center transition-opacity duration-500 ease-out"
            >
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-dark-ink-soft">
                Scroll für die Verwandlung
              </p>
              <ChevronDown size={18} strokeWidth={1.75} className="animate-scroll-cue text-dark-ink-soft" />
            </div>
          )}

          <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-dark-ink/10">
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
      </div>
    </section>
  );
}
