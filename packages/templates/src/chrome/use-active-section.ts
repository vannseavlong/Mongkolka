"use client";

import { useEffect, useState } from "react";
import { sectionAnchorId } from "./dock-items";
import { isAtBottom, pickActiveId, type SectionBox } from "./scroll-spy";

export interface ActiveSectionState {
  /** Section key currently under the probe line, or null. */
  activeKey: string | null;
  /** Keys whose section actually rendered something (a section that returns null has no height). */
  presentKeys: string[];
}

/** Nearest ancestor that actually scrolls (the framed template preview scrolls inside a div, not the window). */
function findScrollParent(el: HTMLElement): HTMLElement | null {
  for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
    const overflowY = getComputedStyle(node).overflowY;
    if ((overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight) return node;
  }
  return null;
}

/**
 * Watches the section wrappers (see ChromeSection) while the page scrolls. rAF-throttled, only a
 * handful of getBoundingClientRect reads per frame, and state is set only when it changed.
 */
export function useActiveSection(keys: string[], enabled: boolean): ActiveSectionState {
  const [state, setState] = useState<ActiveSectionState>({ activeKey: null, presentKeys: [] });
  const keyList = keys.join("|");

  useEffect(() => {
    if (!enabled) return;
    const list = keyList ? keyList.split("|") : [];
    let frame = 0;

    const measure = () => {
      frame = 0;
      const els = list.map((key) => ({ key, el: document.getElementById(sectionAnchorId(key)) }));
      const first = els.find((e) => e.el)?.el;
      if (!first) return;
      const scroller = findScrollParent(first);
      const viewTop = scroller ? scroller.getBoundingClientRect().top : 0;
      const viewHeight = scroller ? scroller.clientHeight : window.innerHeight;
      const boxes: (SectionBox & { key: string })[] = [];
      for (const { key, el } of els) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        boxes.push({ id: key, key, top: r.top - viewTop, bottom: r.bottom - viewTop });
      }
      const atBottom = scroller
        ? isAtBottom(scroller.scrollTop, scroller.clientHeight, scroller.scrollHeight)
        : isAtBottom(window.scrollY, window.innerHeight, document.documentElement.scrollHeight);
      const activeKey = pickActiveId(boxes, viewHeight, { atBottom });
      const presentKeys = boxes.filter((b) => b.bottom > b.top).map((b) => b.key);
      setState((prev) =>
        prev.activeKey === activeKey && prev.presentKeys.join("|") === presentKeys.join("|")
          ? prev
          : { activeKey, presentKeys },
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    // Sections fetch data and load images after mount: measure again once the page has settled.
    const settle = setTimeout(measure, 700);
    // Capture phase: scroll events do not bubble, so this also hears a scrolling container inside the page.
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    return () => {
      clearTimeout(settle);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, [keyList, enabled]);

  return state;
}

/** Smooth-scrolls to a section wrapper (instant under reduced motion). */
export function scrollToSection(sectionKey: string): void {
  const el = document.getElementById(sectionAnchorId(sectionKey));
  if (!el) return;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
