import type { ComponentType, CSSProperties } from "react";
import type { AgendaIcon, Theme } from "../../types";

/**
 * The skin-ornament contract. The shared Khmer sections (invitation, agenda, letters, details)
 * never hard-code a look: they ask the active skin for its corner, divider, crest, icons, card
 * surface and heading foil. A skin changes how the shared sections look by registering its own
 * `SkinOrnaments` in `skin-ornaments.ts`, from a file inside its own folder.
 */

export interface OrnamentProps {
  /** The theme accent; the ornament derives its own foil from it. */
  color: string;
  size?: number;
}

export interface DividerProps {
  color: string;
  width?: number;
}

export interface CrestProps {
  color: string;
  /** The ground colour inside the crest. */
  ground: string;
  /** Monogram text, e.g. "S & D". */
  label: string;
  size?: number;
}

export interface IconProps {
  color: string;
  size?: number;
  strokeWidth?: number;
}

export type IconSet = Record<AgendaIcon, ComponentType<IconProps>>;

/** `shimmer` = a slow light sweep over crest and countdown tiles; `float` = the crest drifts; `still` = none. */
export type MotionFlavour = "shimmer" | "float" | "still";

export interface BackdropProps {
  /** The theme accent. */
  color: string;
  /** The section ground colour. */
  ground: string;
}

export interface SkinOrnaments {
  id: string;
  /** Optional scene art drawn behind the card of every shared section (clipped to the section; decorative). */
  Backdrop?: ComponentType<BackdropProps>;
  /** Drawn for the top-left corner; the frame mirrors it into the other three. */
  Corner: ComponentType<OrnamentProps>;
  Divider: ComponentType<DividerProps>;
  Crest: ComponentType<CrestProps>;
  icons: IconSet;
  /** Corner ornaments shown on the card frame. */
  corners: boolean;
  /** Distance in px of the inner pin-stripe from the card edge; 0 = no pin-stripe. */
  inset: number;
  /** Corner radius of the card in px. */
  radius: number;
  /** Background, border and shadow of an ornate card. */
  surface: (theme: Theme) => CSSProperties;
  /** Style of a section heading (foil text, font, spacing). */
  heading: (theme: Theme, language: "en" | "kh") => CSSProperties;
  /** Stroke width of the line icons. */
  iconStroke: number;
  motion: MotionFlavour;
}
