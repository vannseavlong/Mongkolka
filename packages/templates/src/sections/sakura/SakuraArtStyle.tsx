"use client";

import { artVarsCss, SAKURA_CSS } from "./art/art-css";
import { paletteKey } from "./palette";

/**
 * Puts the Sakura art and motion CSS on the page. React hoists and de-duplicates `<style href>`, so
 * every component that needs it can render one: the card art is defined once per accent however many
 * cards are on the page.
 */
export function SakuraArtStyle({ accent }: { accent: string }) {
  return (
    <>
      <style href="mk-sakura-css" precedence="mk-sakura">
        {SAKURA_CSS}
      </style>
      <style href={`mk-sakura-art-${paletteKey(accent)}`} precedence="mk-sakura">
        {artVarsCss(accent)}
      </style>
    </>
  );
}
