import { useEffect, useRef, useState } from "react";

interface ScrollVideoScrubProps {
  videoSrc: string;
}

export default function ScrollVideoScrub({ videoSrc }: ScrollVideoScrubProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const tickingRef = useRef(false);
  const [ready, setReady] = useState(false);

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

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
