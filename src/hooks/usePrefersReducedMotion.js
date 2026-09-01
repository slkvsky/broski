import { useEffect, useState } from "react";

/**
 * GSAP tweens run outside React and ignore the site's global
 * prefers-reduced-motion CSS rule (that rule only mutes CSS
 * transitions/animations), so anything JS-driven needs its own check.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event) => setReduced(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}
