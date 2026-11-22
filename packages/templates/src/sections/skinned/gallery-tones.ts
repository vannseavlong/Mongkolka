import type { CSSProperties } from "react";
import type { Theme } from "../../types";
import { goldGradient, mixHex, withAlpha } from "../../chrome/gold";
import { contrastRatio } from "../../theme-presets";
import { isDarkColor } from "../khmer/foil";

/** Pure colour and style decisions shared by every skin's photo frame and guest form. No JSX. */
export interface MediaTones {
  dark: boolean;
  ink: string;
  accent: string;
  /** Secondary text on the ground. */
  muted: string;
  /** Field and note fill. */
  card: string;
  /** Hairline borders. */
  line: string;
  error: string;
}

export function mediaTones(theme: Theme): MediaTones {
  const dark = isDarkColor(theme.bg_color);
  return {
    dark,
    ink: theme.text_color,
    accent: theme.accent_color,
    muted: mixHex(theme.text_color, theme.bg_color, 78),
    card: dark ? mixHex(theme.bg_color, "#ffffff", 90) : mixHex(theme.bg_color, "#ffffff", 40),
    line: withAlpha(theme.accent_color, 0.55),
    error: dark ? "#ff9a8f" : "#b3261e",
  };
}

/** The more readable of white and a deep brown on `bg` (by WCAG contrast). */
export function readableOn(bg: string): string {
  const light = contrastRatio(bg, "#ffffff") ?? 0;
  const deep = contrastRatio(bg, "#1b1408") ?? 0;
  return light >= deep ? "#ffffff" : "#1b1408";
}

export interface FieldOptions {
  radius?: number;
  borderWidth?: number;
  background?: string;
}

/** A text input / textarea. Focus ring comes from the `.sk-field` class (see the section shell). */
export function fieldStyle(theme: Theme, invalid = false, o: FieldOptions = {}): CSSProperties {
  const t = mediaTones(theme);
  return {
    width: "100%",
    minHeight: 48,
    padding: "0.7rem 1rem",
    fontSize: "1rem",
    lineHeight: 1.5,
    color: t.ink,
    backgroundColor: o.background ?? t.card,
    border: `${o.borderWidth ?? 1.5}px solid ${invalid ? t.error : t.line}`,
    borderRadius: o.radius ?? 12,
  };
}

export interface ButtonOptions {
  radius?: number;
  /** Override the fill (default: the gold gradient of the accent). */
  background?: string;
  /** Flat bottom edge, for chunky sticker buttons. */
  shade?: string;
}

/** The primary button: accent gradient with text picked for contrast, 48px tall at least. */
export function buttonStyle(theme: Theme, o: ButtonOptions = {}): CSSProperties {
  const bg = o.background ?? goldGradient(theme.accent_color);
  const text = readableOn(theme.accent_color);
  return {
    minHeight: 48,
    padding: "0.75rem 1.75rem",
    borderRadius: o.radius ?? 999,
    border: "none",
    color: text,
    backgroundImage: bg,
    backgroundColor: theme.accent_color,
    fontWeight: 600,
    boxShadow: o.shade
      ? `0 5px 0 -1px ${o.shade}, 0 16px 24px -12px ${withAlpha(theme.accent_color, 0.6)}`
      : `0 12px 22px -12px ${withAlpha(theme.accent_color, 0.7)}, inset 0 1px 0 rgba(255,255,255,0.45)`,
  };
}

export interface NoteOptions {
  radius?: number;
  borderWidth?: number;
  shadow?: string;
}

/** A guest wish note on the wall. */
export function noteStyle(theme: Theme, o: NoteOptions = {}): CSSProperties {
  const t = mediaTones(theme);
  return {
    color: t.ink,
    backgroundColor: t.card,
    border: `${o.borderWidth ?? 1}px solid ${t.line}`,
    borderRadius: o.radius ?? 16,
    boxShadow: o.shadow ?? (t.dark ? "0 16px 30px -22px rgba(0,0,0,0.8)" : `0 14px 28px -22px ${withAlpha(theme.accent_color, 0.55)}`),
  };
}
