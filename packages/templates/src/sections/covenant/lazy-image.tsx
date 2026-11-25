"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { withAlpha } from "../../chrome/gold";

export interface LazyImageProps {
  src: string;
  alt: string;
  /** Accent colour for the soft placeholder shimmer. */
  tint: string;
  /** CSS aspect-ratio of the box ("4 / 5"). The box keeps its size while the photo loads, so nothing jumps. */
  ratio?: string;
  /** Fill the parent box (which must be positioned) instead of keeping an aspect ratio. */
  fill?: boolean;
  /** Load now (the first screen) instead of when it nears the viewport. */
  eager?: boolean;
  onFail?: () => void;
  className?: string;
}

/**
 * A photo that arrives smoothly: a shimmering tinted box of the final size, then the photo fades and un-blurs in once
 * it has decoded. Native `loading="lazy"` + `decoding="async"` do the lazy part (no library needed); the fade is a
 * CSS transition on opacity/transform/filter only. Photos already in the cache show at once, without the fade.
 */
export function LazyImage({ src, alt, tint, ratio, fill, eager, onFail, className }: LazyImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  useEffect(() => {
    const el = ref.current;
    if (el?.complete) {
      if (el.naturalWidth > 0) setReady(true);
      else onFail?.();
    }
  }, [src, onFail]);
  const style = { ...(fill ? {} : { aspectRatio: ratio ?? "1 / 1" }), ["--cv-tint" as string]: withAlpha(tint, 0.14), ["--cv-tint-hi" as string]: withAlpha("#ffffff", 0.7) } as CSSProperties;
  return (
    <span className={`cv-lazy ${fill ? "cv-lazy-fill" : ""} ${className ?? ""}`} data-ready={ready ? "" : undefined} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element -- user photos on arbitrary hosts */}
      <img ref={ref} src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" referrerPolicy="no-referrer" onLoad={done} onError={onFail} />
    </span>
  );
}

/** Photo shapes that repeat down a masonry column, so the columns look woven without knowing each photo's size. */
export const MASONRY_RATIOS = ["4 / 5", "1 / 1", "3 / 4", "5 / 6", "4 / 3", "4 / 5"] as const;
export const masonryRatio = (i: number): string => MASONRY_RATIOS[i % MASONRY_RATIOS.length]!;
