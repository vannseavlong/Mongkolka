"use client";

import { useEffect, useRef, useState } from "react";

/** True once the element has scrolled near the viewport (stays true; heavy children mount only once). Without IntersectionObserver it stays false and callers show their fallback. */
export function useInView<T extends Element>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, rootMargin]);
  return { ref, seen };
}
