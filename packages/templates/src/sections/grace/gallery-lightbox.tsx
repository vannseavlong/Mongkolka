"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Theme } from "../../types";
import { gracePalette, DISPLAY_FONT } from "./shared";

/** Replace {n} / {total} placeholders (pure). */
export function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

const FOCUSABLE = "button:not([disabled])";
const SWIPE_PX = 50;

export interface GraceLightboxProps {
  theme: Theme;
  photos: string[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  labels: { viewer: string; close: string; prev: string; next: string; alt: (n: number, total: number) => string };
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

/** Modal photo viewer: dialog semantics, Esc, arrows, swipe, focus trap, scroll lock. Rendered in a portal. */
export function GraceLightbox({ theme, photos, index, onIndex, onClose, labels }: GraceLightboxProps) {
  const p = gracePalette(theme);
  const total = photos.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => {
      if (total < 2) return;
      onIndex((index + delta + total) % total);
    },
    [index, total, onIndex],
  );

  // Scroll lock, restored on close; focus moves in.
  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    closeRef.current?.focus();
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "Tab") {
        const nodes = Array.from(rootRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (!first || !last) return;
        const active = document.activeElement;
        if (!rootRef.current?.contains(active)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const btn =
    "flex h-12 w-12 items-center justify-center rounded-full border outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-white hover:bg-white/25";
  const btnStyle = { color: "#ffffff", backgroundColor: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.45)" };

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={labels.viewer}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-3 py-16 sm:px-20"
      style={{
        backgroundColor: "rgba(28, 14, 19, 0.94)",
        backgroundImage: `linear-gradient(rgba(28,14,19,0.94), rgba(28,14,19,0.94))`,
        fontFamily: DISPLAY_FONT,
        touchAction: "pan-y",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches.length === 1 ? (e.touches[0]?.clientX ?? null) : null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        touchX.current = null;
        if (start == null) return;
        const dx = (e.changedTouches[0]?.clientX ?? start) - start;
        if (Math.abs(dx) >= SWIPE_PX) go(dx < 0 ? 1 : -1);
      }}
    >
      <style>{"@media (prefers-reduced-motion:no-preference){.grace-lb-img{animation:grace-lb-in .35s ease-out}}@keyframes grace-lb-in{from{opacity:0}to{opacity:1}}"}</style>
      <button ref={closeRef} type="button" onClick={onClose} aria-label={labels.close} className={`${btn} absolute right-3 top-3 sm:right-5 sm:top-5`} style={btnStyle}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {/* key = photo, so the fade replays on change */}
      <img
        key={photos[index]}
        src={photos[index]}
        alt={labels.alt(index + 1, total)}
        decoding="async"
        draggable={false}
        className="grace-lb-img max-h-full max-w-full select-none object-contain"
        style={{ border: `1px solid ${p.foilLight}`, padding: 4, backgroundColor: "rgba(255,255,255,0.06)" }}
      />

      {total > 1 && (
        <>
          <button type="button" onClick={() => go(-1)} aria-label={labels.prev} className={`${btn} absolute left-2 top-1/2 -translate-y-1/2 sm:left-5`} style={btnStyle}>
            <Chevron dir="left" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={labels.next} className={`${btn} absolute right-2 top-1/2 -translate-y-1/2 sm:right-5`} style={btnStyle}>
            <Chevron dir="right" />
          </button>
        </>
      )}

      <p aria-live="polite" className="absolute inset-x-0 bottom-5 text-center text-sm tabular-nums" style={{ color: "rgba(255,255,255,0.9)" }}>
        {index + 1} / {total}
      </p>
    </div>,
    document.body,
  );
}
