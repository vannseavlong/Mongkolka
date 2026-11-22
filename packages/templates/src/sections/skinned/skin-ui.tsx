import type { CSSProperties } from "react";
import type { Theme } from "../../types";
import type { SkinId } from "../skins";
import { CINZEL_FONT, ROUNDED_FONT } from "../../chrome/fonts";
import { mixHex, withAlpha } from "../../chrome/gold";
import { isDarkColor } from "../khmer/foil";
import type { SkinUi } from "./skin-ui-types";
import { BlossomMark, HydrangeaMark, LozengeMark, PeonyMark, RoseMark, StarHeartMark } from "./marks";
import { baseField, foilButton, onColor, roundStepper } from "./ui-shared";

/**
 * Form controls and the signature mark for each skin. A skin that is not listed here gets DEFAULT_UI
 * (a soft foil pill), so a new skin never breaks the skinned sections.
 */

const soft = "0 10px 22px -12px rgba(0,0,0,0.45)";

function chipFace(theme: Theme, selected: boolean, invalid: boolean, o: { radius: number; border: string; idle: string; on?: string }): CSSProperties {
  const a = theme.accent_color;
  return {
    borderRadius: o.radius,
    border: `1px solid ${invalid && !selected ? "#c0392b" : o.border}`,
    backgroundColor: selected ? (o.on ?? a) : o.idle,
    color: selected ? onColor(o.on ?? a) : theme.text_color,
  };
}

const lightIdle = (t: Theme) => withAlpha("#ffffff", isDarkColor(t.bg_color) ? 0.06 : 0.85);

export const DEFAULT_UI: SkinUi = {
  id: "default",
  button: (t) => foilButton(t, { radius: 999, shadow: soft }),
  field: (t, bad) => baseField(t, bad, { radius: 12, background: lightIdle(t), border: withAlpha(t.accent_color, 0.6) }),
  chip: (t, on, bad) => chipFace(t, on, bad, { radius: 999, border: withAlpha(t.accent_color, 0.7), idle: lightIdle(t) }),
  stepper: (t) => roundStepper(t, t.accent_color, "transparent"),
  Mark: LozengeMark,
  labelColor: (t) => t.text_color,
};

const EMERALD_UI: SkinUi = {
  id: "emerald",
  // Art-Deco: squared, capitals, a pin-stripe inside the button.
  button: (t) =>
    foilButton(t, {
      radius: 3,
      shadow: "0 12px 26px -14px rgba(0,0,0,0.9)",
      font: CINZEL_FONT,
      extra: { letterSpacing: "0.14em", textTransform: "uppercase", outline: `1px solid ${withAlpha(mixHex(t.accent_color, "#ffffff", 50), 0.55)}`, outlineOffset: -4 },
    }),
  field: (t, bad) => baseField(t, bad, { radius: 3, background: withAlpha("#000000", 0.28), border: withAlpha(t.accent_color, 0.55) }),
  chip: (t, on, bad) => chipFace(t, on, bad, { radius: 3, border: withAlpha(t.accent_color, 0.65), idle: withAlpha("#000000", 0.22) }),
  stepper: (t) => ({ ...roundStepper(t, t.accent_color, withAlpha("#000000", 0.25)), borderRadius: 3 }),
  Mark: LozengeMark,
  labelColor: (t) => mixHex(t.accent_color, t.text_color, 45),
};

const GARDEN_UI: SkinUi = {
  id: "garden",
  button: (t) => foilButton(t, { radius: 999, shadow: "0 10px 24px -12px rgba(120,90,30,0.55)" }),
  field: (t, bad) => baseField(t, bad, { radius: 14, background: "#ffffff", border: mixHex(t.accent_color, "#9cb088", 45) }),
  chip: (t, on, bad) => chipFace(t, on, bad, { radius: 999, border: mixHex(t.accent_color, "#9cb088", 45), idle: "#ffffff" }),
  stepper: (t) => roundStepper(t, t.accent_color, "#ffffff"),
  Mark: RoseMark,
  labelColor: (t) => t.text_color,
};

const CREAM_UI: SkinUi = {
  id: "cream",
  // Stationery: square-ish corners, hairline underline fields, small caps labels.
  button: (t) => foilButton(t, { radius: 6, shadow: "0 8px 18px -10px rgba(120,80,20,0.5)", font: CINZEL_FONT, extra: { letterSpacing: "0.12em" } }),
  field: (t, bad) => ({
    ...baseField(t, bad, { radius: 4, background: withAlpha("#ffffff", 0.7), border: withAlpha(t.accent_color, 0.45) }),
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomWidth: 1.5,
    borderRadius: "4px 4px 0 0",
  }),
  chip: (t, on, bad) => chipFace(t, on, bad, { radius: 6, border: withAlpha(t.accent_color, 0.6), idle: withAlpha("#ffffff", 0.7) }),
  stepper: (t) => ({ ...roundStepper(t, t.accent_color, withAlpha("#ffffff", 0.7)), borderRadius: 6 }),
  Mark: PeonyMark,
  labelColor: (t) => mixHex(t.text_color, t.accent_color, 70),
};

const SAKURA_UI: SkinUi = {
  id: "sakura",
  button: (t) => ({
    backgroundImage: `linear-gradient(135deg, ${mixHex(t.accent_color, "#ff9ec4", 55)}, ${t.accent_color} 60%, ${mixHex(t.accent_color, "#4b0a2a", 80)})`,
    color: "#ffffff",
    borderRadius: 999,
    minHeight: 48,
    boxShadow: `0 12px 26px -12px ${withAlpha(t.accent_color, 0.7)}, inset 0 1px 0 rgba(255,255,255,0.4)`,
  }),
  field: (t, bad) => baseField(t, bad, { radius: 18, background: withAlpha("#ffffff", 0.85), border: withAlpha(t.accent_color, 0.45) }),
  chip: (t, on, bad) => chipFace(t, on, bad, { radius: 999, border: withAlpha(t.accent_color, 0.55), idle: withAlpha("#ffffff", 0.85) }),
  stepper: (t) => roundStepper(t, t.accent_color, withAlpha("#ffffff", 0.85)),
  Mark: BlossomMark,
  labelColor: (t) => t.text_color,
};

const FAIRYTALE_UI: SkinUi = {
  id: "fairytale",
  button: (t) => ({
    backgroundImage: `linear-gradient(180deg, ${mixHex(t.accent_color, "#ffffff", 80)}, ${t.accent_color} 40%, ${mixHex(t.accent_color, "#0a1a44", 80)})`,
    color: "#ffffff",
    borderRadius: 999,
    minHeight: 48,
    boxShadow: `0 12px 24px -12px ${withAlpha(t.accent_color, 0.7)}, inset 0 1px 0 rgba(255,255,255,0.45)`,
  }),
  field: (t, bad) => baseField(t, bad, { radius: 16, background: "#ffffff", border: withAlpha(t.accent_color, 0.4) }),
  chip: (t, on, bad) => chipFace(t, on, bad, { radius: 999, border: withAlpha(t.accent_color, 0.5), idle: "#ffffff" }),
  stepper: (t) => roundStepper(t, t.accent_color, "#ffffff"),
  Mark: HydrangeaMark,
  labelColor: (t) => t.text_color,
};

const KIDS_UI: SkinUi = {
  id: "kids",
  // Chunky and friendly: a deeper "bottom edge" under the button, big radii, the rounded face.
  button: (t) => ({
    backgroundImage: `linear-gradient(180deg, ${mixHex(t.accent_color, "#ffffff", 80)}, ${t.accent_color})`,
    color: "#ffffff",
    borderRadius: 999,
    minHeight: 52,
    fontFamily: ROUNDED_FONT,
    fontWeight: 700,
    boxShadow: `0 5px 0 ${mixHex(t.accent_color, "#3a0a1a", 70)}, 0 14px 20px -10px ${withAlpha(t.accent_color, 0.6)}`,
  }),
  field: (t, bad) => baseField(t, bad, { radius: 22, background: "#ffffff", border: mixHex(t.accent_color, "#d9c8f0", 40), borderWidth: 2 }),
  chip: (t, on, bad) => ({ ...chipFace(t, on, bad, { radius: 999, border: mixHex(t.accent_color, "#d9c8f0", 40), idle: "#ffffff" }), borderWidth: 2, fontFamily: ROUNDED_FONT, fontWeight: 600 }),
  stepper: (t) => ({ ...roundStepper(t, t.accent_color, "#ffffff"), borderWidth: 2 }),
  Mark: StarHeartMark,
  labelColor: (t) => t.text_color,
};

export const SKIN_UI: Record<SkinId, SkinUi> = {
  emerald: EMERALD_UI,
  garden: GARDEN_UI,
  cream: CREAM_UI,
  sakura: SAKURA_UI,
  fairytale: FAIRYTALE_UI,
  kids: KIDS_UI,
};

export function uiFor(id: string | null | undefined): SkinUi {
  return (id && (SKIN_UI as Record<string, SkinUi>)[id]) || DEFAULT_UI;
}
