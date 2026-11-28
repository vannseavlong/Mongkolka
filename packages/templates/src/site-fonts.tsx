import type { CSSProperties, ReactNode } from "react";
import type { Theme } from "./types";

/**
 * The fonts a couple can choose. Each face's `--face-<id>` variable is declared by apps/web and apps/couple. Only the
 * ids listed here ever reach CSS, so a stored value cannot inject anything; unknown ids keep the template's own font.
 */
export const FONT_ROLES = [
  {
    key: "font_kh_heading",
    label: "Khmer heading",
    sample: "សិរីមង្គល",
    options: [
      { id: "moul", name: "Moul" },
      { id: "moulpali", name: "Moulpali" },
      { id: "koulen", name: "Koulen" },
    ],
    vars: ["--font-moul"],
  },
  {
    key: "font_kh_body",
    label: "Khmer text",
    sample: "សូមគោរពអញ្ជើញ",
    options: [
      { id: "battambang", name: "Battambang" },
      { id: "siemreap", name: "Siemreap", latin: false },
      { id: "kantumruy", name: "Kantumruy Pro" },
    ],
    vars: ["--font-battambang", "--font-khmer"],
  },
  {
    key: "font_en_heading",
    label: "English heading",
    sample: "Our Wedding",
    options: [
      { id: "cinzel", name: "Cinzel" },
      { id: "cormorant", name: "Cormorant Garamond" },
      { id: "playfair", name: "Playfair Display" },
    ],
    vars: ["--font-cinzel", "--font-display", "--font-rounded"],
  },
  {
    key: "font_en_script",
    label: "English script",
    sample: "Save the Date",
    options: [
      { id: "great-vibes", name: "Great Vibes" },
      { id: "dancing", name: "Dancing Script" },
      { id: "parisienne", name: "Parisienne" },
    ],
    vars: ["--font-script"],
  },
] as const;

export type FontKey = (typeof FONT_ROLES)[number]["key"];
export const FONT_KEYS: readonly FontKey[] = FONT_ROLES.map((role) => role.key);

/** The CSS font stack for a chosen id, or null for "template default" and anything unknown. */
export function fontStack(key: FontKey, id: string | null | undefined): string | null {
  const option = FONT_ROLES.find((role) => role.key === key)?.options.find((o) => o.id === id);
  if (!option) return null;
  // A face without Latin letters is named directly: next/font's variable also carries an Arial stand-in, which would
  // draw the English text oversized instead of letting it reach the next font in the stack.
  if ("latin" in option) return `"${option.name}"`;
  return `var(--face-${option.id}, "${option.name}"), "${option.name}"`;
}

/** The CSS variables that apply a theme's font choices; empty when every role keeps the template default. */
export function siteFontVars(theme: Partial<Theme>): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const role of FONT_ROLES) {
    const stack = fontStack(role.key, theme[role.key]);
    if (stack) for (const name of role.vars) vars[name] = stack;
  }
  // Sections without a face of their own (plain serif / sans text) read --site-body.
  const body = [fontStack("font_en_heading", theme.font_en_heading), fontStack("font_kh_body", theme.font_kh_body)].filter(Boolean);
  if (body.length) vars["--site-body"] = [...body, theme.font_style === "serif" ? "serif" : "sans-serif"].join(", ");
  return vars;
}

/**
 * Applies the couple's fonts to everything inside, without adding a box to the layout. The wrapper is always there:
 * adding it only once a font is chosen would remount the whole site while the builder previews a design.
 */
export function SiteFonts({ theme, children }: { theme: Theme; children: ReactNode }) {
  const vars = siteFontVars(theme);
  return (
    <div style={{ display: "contents", fontFamily: vars["--site-body"], ...vars } as CSSProperties}>{children}</div>
  );
}
