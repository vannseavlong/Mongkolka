import type { CSSProperties } from "react";
import type { Theme } from "../../types";
import { mixHex, withAlpha } from "../../chrome/gold";
import { isDarkColor } from "../khmer/foil";

export const ERROR_COLOR = "#c0392b";
export const ERROR_COLOR_ON_DARK = "#ff8a80";

/** Error text colour that stays readable on the section ground. */
export function errorColorFor(theme: Theme): string {
  return isDarkColor(theme.bg_color) ? ERROR_COLOR_ON_DARK : ERROR_COLOR;
}

/** Black or white, whichever reads better on `bg`. */
export function onColor(bg: string): string {
  return isDarkColor(bg) ? "#ffffff" : "#1b1408";
}

export interface FieldOpts {
  radius: number;
  background: string;
  border: string;
  borderWidth?: number;
  color?: string;
}

export function baseField(theme: Theme, invalid: boolean, o: FieldOpts): CSSProperties {
  return {
    backgroundColor: o.background,
    color: o.color ?? theme.text_color,
    border: `${o.borderWidth ?? 1}px solid ${invalid ? errorColorFor(theme) : o.border}`,
    borderRadius: o.radius,
    minHeight: 48,
    width: "100%",
    padding: "10px 14px",
    fontSize: 17,
  };
}

/**
 * A foil button derived from the accent: accent down to a slightly deeper shade, with a catch-light on top.
 * The text colour is chosen against the accent itself, and the gradient stays close to it, so contrast holds.
 */
export function foilButton(theme: Theme, o: { radius: number; shadow: string; font?: string; extra?: CSSProperties }): CSSProperties {
  const a = theme.accent_color;
  return {
    backgroundImage: `linear-gradient(160deg, ${mixHex(a, "#ffffff", 88)} 0%, ${a} 45%, ${mixHex(a, "#3a2400", 88)} 100%)`,
    color: onColor(a),
    borderRadius: o.radius,
    minHeight: 48,
    boxShadow: `${o.shadow}, inset 0 1px 0 ${withAlpha("#ffffff", 0.35)}`,
    fontFamily: o.font,
    ...o.extra,
  };
}

export function roundStepper(theme: Theme, color: string, bg: string): CSSProperties {
  return { border: `1px solid ${withAlpha(color, 0.7)}`, color, backgroundColor: bg };
}
