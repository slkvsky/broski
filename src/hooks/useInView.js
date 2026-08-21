import { useEffect, useRef, useState } from "react";

/**
 * Lazily observes an element and flips to `true` once it nears the viewport.
 * Each section owns one IntersectionObserver instance created on mount of
 * that section, not a single global one initialized eagerly for the whole
 * page — keeps below-the-fold sections from paying any cost before they're
 * scrolled near.
 */
export function useInView({ rootMargin = "0px 0px -10% 0px", once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  return [ref, inView];
}
