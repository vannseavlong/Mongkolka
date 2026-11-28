import type { Theme } from "./types";

/** Background patterns and the corner switch a couple can choose. Only these ids are ever drawn. */
export const PATTERN_OPTIONS = [
  { id: "none", name: "None" },
  { id: "diamond", name: "Diamond weave" },
  { id: "lotus", name: "Lotus lattice" },
  { id: "blossom", name: "Falling blossom" },
] as const;

export type PatternId = Exclude<(typeof PATTERN_OPTIONS)[number]["id"], "none">;
export const DECOR_KEYS = ["pattern", "corners"] as const;
export type DecorKey = (typeof DECOR_KEYS)[number];

export interface SiteDecor {
  pattern: PatternId | null;
  corners: boolean;
}

/** What to draw. A missing or unknown value keeps the template's own look: only Covenant is decorated by default. */
export function resolveDecor(theme: Partial<Theme>, skin: string | null | undefined): SiteDecor {
  const own = skin === "covenant";
  const chosen = PATTERN_OPTIONS.find((o) => o.id === theme.pattern)?.id;
  return {
    pattern: chosen === undefined ? (own ? "diamond" : null) : chosen === "none" ? null : chosen,
    corners: theme.corners === "on" || (theme.corners !== "off" && own),
  };
}
