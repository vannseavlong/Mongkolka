/**
 * Font stacks for the Khmer e-invitation skins. The CSS variables are set by `next/font/google`
 * in apps/web and apps/couple (preload off, so a page only downloads a face it actually uses);
 * the named fallbacks keep text readable if a face has not arrived. Every `var()` carries its own fallback: a bare
 * `var(--font-x)` whose variable is not defined (the builder app defines fewer than the public site) makes the whole
 * `font-family` invalid and the text falls back to the system font.
 */
export const MOUL_FONT = 'var(--font-moul, "Moul"), "Moul", var(--font-khmer, "Noto Serif Khmer"), "Noto Serif Khmer", serif';
export const KHMER_BODY_FONT = 'var(--font-battambang, "Battambang"), "Battambang", var(--font-khmer, "Noto Serif Khmer"), "Noto Serif Khmer", serif';
export const CINZEL_FONT = 'var(--font-cinzel, "Cinzel"), "Cinzel", "Cormorant Garamond", Georgia, serif';
export const ROUNDED_FONT = 'var(--font-rounded, "Fredoka"), "Fredoka", var(--font-battambang, "Battambang"), "Battambang", system-ui, sans-serif';
