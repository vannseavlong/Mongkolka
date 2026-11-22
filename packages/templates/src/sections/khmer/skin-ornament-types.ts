import type { ComponentType, CSSProperties, ReactNode } from "react";
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
  /** The section id, so a backdrop can vary from section to section (optional). */
  id?: string;
}

export interface MediaFrameProps {
  theme: Theme;
  /** Stable tile index: frames vary tint, sticker and corner from it. */
  index: number;
  /** `gallery` tiles are larger; `wall` photos sit inside a guest note; `preview` is the chosen-photo thumbnail. */
  variant: "gallery" | "wall" | "preview";
  /** Aspect-ratio class for the photo box (a wall photo gets a per-item aspect); defaults to the skin's `media.aspect`. */
  aspect?: string;
  /** The `<img>`, already absolutely positioned to fill the photo box. */
  children: ReactNode;
}

/**
 * How a skin frames photos and styles the guest form. Used by the skin-aware gallery and guestbook
 * (`gallery_skin`, `guestbook_skin`). Optional: a skin without `media` gets a neutral gold frame.
 */
export interface SkinMedia {
  /** Draws the whole decorative frame (mat, ornaments, stickers) around the photo box. */
  Frame: ComponentType<MediaFrameProps>;
  /** Default photo aspect class, e.g. "aspect-[4/5]". */
  aspect: string;
  /** Body font for labels, notes and fields (defaults to the Khmer-friendly body stack). */
  fontFamily?: string;
  /** Extra top/bottom padding (px) inside the form card for skins whose card art hangs into it (blossom branches, a flower bed). */
  cardPad?: { top?: number; bottom?: number };
  /** Rotation in degrees for a tile (polaroid and sticker skins); omitted = upright. */
  tilt?: (index: number) => number;
  /** A guest wish note on the wall. */
  note: (theme: Theme) => CSSProperties;
  /** Text input and textarea. */
  field: (theme: Theme, invalid?: boolean) => CSSProperties;
  /** The primary (submit) button. */
  button: (theme: Theme) => CSSProperties;
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
  /** Optional layered backdrop painted behind each section's card (lattice, glow). Merged over the default glow. */
  sectionBackground?: (theme: Theme) => CSSProperties;
  /** Stroke width of the line icons. */
  iconStroke: number;
  motion: MotionFlavour;
  /** Photo frames and form styling for the skin-aware gallery and guestbook. */
  media?: SkinMedia;
}
