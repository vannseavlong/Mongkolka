/** Scroll-spy decision logic, pure: which section is "current" for the dock highlight. */

export interface SectionBox {
  id: string;
  /** Viewport-relative top/bottom in px (getBoundingClientRect). */
  top: number;
  bottom: number;
}

/**
 * The active section is the last non-empty one whose top has crossed the probe line (a point
 * `probe` of the way down the viewport). Near the very bottom of the page the last section wins,
 * so short final sections can still be reached. Returns null above the first section.
 */
export function pickActiveId(
  boxes: readonly SectionBox[],
  viewportHeight: number,
  options: { probe?: number; atBottom?: boolean } = {},
): string | null {
  const probeY = viewportHeight * (options.probe ?? 0.4);
  const visible = boxes.filter((b) => b.bottom > b.top);
  if (visible.length === 0) return null;
  if (options.atBottom) return visible[visible.length - 1]!.id;
  let active: string | null = null;
  for (const b of visible) {
    if (b.top <= probeY) active = b.id;
  }
  return active;
}

/** True when the page is scrolled to (within a few px of) its end. */
export function isAtBottom(scrollY: number, viewportHeight: number, documentHeight: number, slack = 4): boolean {
  return scrollY + viewportHeight >= documentHeight - slack;
}
