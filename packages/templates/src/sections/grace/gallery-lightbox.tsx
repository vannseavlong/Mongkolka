"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  /** Index into `photos` (the caller derives it from the current URL). */
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  /** Called when a photo fails to load in the viewer (lets the grid hide its tile). */
  onBroken?: (src: string) => void;
  labels: {
    viewer: string;
    close: string;
    prev: string;
    next: string;
    unavailable: string;
    alt: (n: number, total: number) => string;
  };
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

/** Modal photo viewer: dialog semantics, Esc, arrows, swipe, focus trap, scroll lock. Rendered in a portal. */
export function GraceLightbox({ theme, photos, index, onIndex, onClose, onBroken, labels }: GraceLightboxProps) {
  const p = gracePalette(theme);
  const total = photos.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [status, setStatus] = useState<Record<string, "ok" | "error">>({});
  const src = photos[index] ?? "";
  const state = status[src];
  const mark = useCallback((u: string, v: "ok" | "error") => setStatus((prev) => (prev[u] === v ? prev : { ...prev, [u]: v })), []);

  // Cached images can finish before onLoad/onError attach.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && src) mark(src, el.naturalWidth > 0 ? "ok" : "error");
  }, [src, mark]);

  useEffect(() => {
    if (state === "error" && src) onBroken?.(src);
  }, [state, src, onBroken]);

  // Preload the neighbours.
  const prevSrc = total > 1 ? photos[(index - 1 + total) % total] : undefined;
  const nextSrc = total > 1 ? photos[(index + 1) % total] : undefined;
  useEffect(() => {
    for (const u of [prevSrc, nextSrc]) if (u && u !== src) new Image().src = u;
  }, [prevSrc, nextSrc, src]);

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
        e.stopPropagation();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
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
    // Capture phase: one Esc closes only the viewer, not anything listening further up.
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
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
        touchAction: "pinch-zoom pan-y",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => {
        const t0 = e.touches[0];
        touch.current = e.touches.length === 1 && t0 ? { x: t0.clientX, y: t0.clientY } : null;
      }}
      onTouchCancel={() => {
        touch.current = null;
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        const end = e.changedTouches[0];
        if (!start || !end) return;
        const dx = end.clientX - start.x;
        const dy = end.clientY - start.y;
        if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > 1.5 * Math.abs(dy)) go(dx < 0 ? 1 : -1);
      }}
    >
      <style>{"@media (prefers-reduced-motion:no-preference){.grace-lb-img{animation:grace-lb-in .35s ease-out}}@keyframes grace-lb-in{from{opacity:0}to{opacity:1}}"}</style>
      <button ref={closeRef} type="button" onClick={onClose} aria-label={labels.close} className={`${btn} absolute right-3 top-3 sm:right-5 sm:top-5`} style={btnStyle}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {/* key = photo, so the fade and loading state reset on change */}
      {state === "error" ? (
        <div
          role="img"
          aria-label={labels.alt(index + 1, total)}
          className="flex aspect-[3/4] w-64 max-w-full flex-col items-center justify-center gap-3 px-6 text-center text-sm"
          style={{ border: `1px solid ${p.foilLight}`, color: "rgba(255,255,255,0.9)", backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 16l5-5 4 4 3-3 6 6M4 4l16 16" />
          </svg>
          {labels.unavailable}
        </div>
      ) : (
        <img
          ref={imgRef}
          key={src}
          src={src}
          alt={labels.alt(index + 1, total)}
          decoding="async"
          draggable={false}
          onLoad={() => mark(src, "ok")}
          onError={() => mark(src, "error")}
          className="grace-lb-img max-h-full max-w-full select-none object-contain"
          style={{
            border: `1px solid ${p.foilLight}`,
            padding: 4,
            backgroundColor: state === "ok" ? "rgba(255,255,255,0.06)" : p.blush,
            minHeight: state === "ok" ? undefined : "12rem",
            minWidth: state === "ok" ? undefined : "12rem",
          }}
        />
      )}

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
        <span className="sr-only">{labels.alt(index + 1, total)}</span>
        <span aria-hidden>
          {index + 1} / {total}
        </span>
      </p>
    </div>,
    document.body,
  );
}
