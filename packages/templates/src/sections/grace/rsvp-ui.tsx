"use client";

import type { CSSProperties } from "react";
import type { Theme } from "../../types";
import { gracePalette } from "./shared";

/** Shared form styling for the Grace RSVP and guestbook cards (plain CSS so focus rings work without Tailwind variants). */
const FORM_CSS =
  ".grace-form input,.grace-form textarea{font-size:18px}" +
  ".grace-focus:focus-visible,.grace-form input:focus-visible,.grace-form textarea:focus-visible,.grace-form button:focus-visible{outline:2px solid var(--grace-accent);outline-offset:2px}" +
  ".grace-pill input:focus-visible+span{outline:2px solid var(--grace-accent);outline-offset:2px}" +
  ".grace-pill-face{border:1px solid var(--grace-accent);background-color:#fff;color:var(--grace-text)}" +
  ".grace-pill input:checked+span{background-color:var(--grace-accent);color:var(--grace-on-accent);border-color:var(--grace-accent)}" +
  "@media (prefers-reduced-motion:no-preference){.grace-form button,.grace-pill span{transition:background-color .2s,opacity .2s,transform .2s}}";

export function GraceFormStyle() {
  return <style>{FORM_CSS}</style>;
}

function luminance(hex: string): number | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1]!;
  if (h.length === 3) h = h.replace(/./g, "$&$&");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** White on the gold unless the gold is so light that dark text reads better. */
export function onAccent(theme: Theme): string {
  const l = luminance(theme.accent_color);
  return l !== null && l > 0.45 ? theme.text_color : "#ffffff";
}

export const ERROR_COLOR = "#b3261e";

export function formVars(theme: Theme): CSSProperties {
  return {
    ["--grace-accent" as string]: theme.accent_color,
    ["--grace-on-accent" as string]: onAccent(theme),
    ["--grace-text" as string]: theme.text_color,
  };
}

export function fieldStyle(theme: Theme, invalid = false): CSSProperties {
  const p = gracePalette(theme);
  return {
    backgroundColor: p.card,
    color: p.text,
    border: `1px solid ${invalid ? ERROR_COLOR : p.accent}`,
    borderRadius: 12,
    minHeight: 48,
    width: "100%",
    padding: "10px 14px",
  };
}

export function primaryButtonStyle(theme: Theme): CSSProperties {
  return {
    backgroundColor: theme.accent_color,
    color: onAccent(theme),
    borderRadius: 999,
    minHeight: 48,
    boxShadow: "0 8px 20px -10px rgba(0,0,0,0.35)",
  };
}

/** A white card with a thin gold border. */
export function cardStyle(theme: Theme): CSSProperties {
  const p = gracePalette(theme);
  return {
    backgroundColor: p.card,
    border: `1px solid ${p.foilLight}`,
    boxShadow: `0 0 0 4px ${p.card}, 0 0 0 5px ${p.foilLight}, 0 24px 50px -30px rgba(74,44,53,0.35)`,
    borderRadius: 20,
  };
}
