import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Tweens the displayed digits from the previous value to the next one
// instead of snapping — driven by GSAP (already a project dependency)
// rather than a CSS transition, since text content can't be interpolated
// with CSS alone.
export default function AnimatedNumber({ value, duration = 0.3, reducedMotion = false }) {
  const [display, setDisplay] = useState(value);
  const proxyRef = useRef({ value });

  useEffect(() => {
    if (reducedMotion) {
      proxyRef.current.value = value;
      return;
    }

    const proxy = proxyRef.current;
    const tween = gsap.to(proxy, {
      value,
      duration,
      ease: "power2.out",
      onUpdate: () => setDisplay(Math.round(proxy.value)),
    });

    return () => tween.kill();
  }, [value, duration, reducedMotion]);

  return <span className="tabular-nums">{reducedMotion ? value : display}</span>;
}
