/**
 * Font stacks for the Khmer e-invitation skins. The CSS variables are set by `next/font/google`
 * in apps/web and apps/couple (preload off, so a page only downloads a face it actually uses);
 * the named fallbacks keep text readable if a face has not arrived.
 */
export const MOUL_FONT = 'var(--font-moul), "Moul", var(--font-khmer), "Noto Serif Khmer", serif';
export const KHMER_BODY_FONT = 'var(--font-battambang), "Battambang", var(--font-khmer), "Noto Serif Khmer", serif';
export const CINZEL_FONT = 'var(--font-cinzel), "Cinzel", "Cormorant Garamond", Georgia, serif';
export const ROUNDED_FONT = 'var(--font-rounded), "Fredoka", var(--font-battambang), "Battambang", system-ui, sans-serif';
