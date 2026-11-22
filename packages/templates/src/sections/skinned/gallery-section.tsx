"use client";

import type { ReactNode } from "react";
import type { Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { KHMER_BODY_FONT } from "../../chrome/fonts";
import { mixHex, withAlpha } from "../../chrome/gold";
import { isDarkColor } from "../khmer/foil";
import { useSkinOrnaments } from "../khmer/skin-context";
import { mediaFor } from "./gallery-media";

/** Focus ring, hover lift and reduced motion for the skin-aware gallery and guestbook. */
const MEDIA_CSS = `
.sk-field:focus-visible,.sk-btn:focus-visible,.sk-tile:focus-visible,.sk-link:focus-visible{outline:2px solid var(--sk-accent);outline-offset:3px}
.sk-field::placeholder{opacity:.6}
.sk-tile{transition:transform .3s ease}
@media (hover:hover){.sk-tile:hover{transform:translateY(-4px) rotate(0deg) !important}}
.sk-btn{transition:transform .18s ease,filter .18s ease}
.sk-btn:active{transform:translateY(2px)}
.sk-btn:disabled{opacity:.6}
@media (prefers-reduced-motion:reduce){.sk-tile,.sk-btn{transition:none}.sk-tile:hover{transform:none !important}}
`;

export interface MediaSectionProps {
  theme: Theme;
  id: string;
  heading: string;
  /** Intro line under the divider (the guestbook uses one). */
  intro?: string;
  children: ReactNode;
}

/**
 * Section shell for the skin-aware gallery and guestbook: the skin's ground, glow, backdrop scene,
 * foil heading and divider. No big card: the photos and the form card carry their own frames.
 */
export function MediaSection({ theme, id, heading, intro, children }: MediaSectionProps) {
  const { language } = useLanguage();
  const sk = useSkinOrnaments();
  const dark = isDarkColor(theme.bg_color);
  const glow = withAlpha(theme.accent_color, dark ? 0.16 : 0.1);
  return (
    <section
      id={id}
      data-mk-lang={language}
      className="relative overflow-hidden px-4 py-16 text-center sm:px-6"
      style={{
        color: theme.text_color,
        fontFamily: mediaFor(sk).fontFamily ?? KHMER_BODY_FONT,
        backgroundColor: theme.bg_color,
        backgroundImage: `radial-gradient(120% 60% at 50% 0%, ${glow}, transparent 70%), radial-gradient(100% 50% at 50% 100%, ${withAlpha(mixHex(theme.accent_color, theme.bg_color, 50), dark ? 0.12 : 0.08)}, transparent 70%)`,
        ...sk.sectionBackground?.(theme),
        ["--sk-accent" as string]: theme.accent_color,
      }}
    >
      <style href="mk-skinned-media-css" precedence="mk-skinned-media">
        {MEDIA_CSS}
      </style>
      {sk.Backdrop && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <sk.Backdrop color={theme.accent_color} ground={theme.bg_color} id={id} />
        </div>
      )}
      <div className="relative">
        <h2 className="m-0 text-xl sm:text-2xl" style={sk.heading(theme, language)}>
          {heading}
        </h2>
        <div className="mb-8 mt-3">
          <sk.Divider color={theme.accent_color} />
        </div>
        {intro && (
          <p className="mx-auto -mt-3 mb-8 max-w-md text-base leading-relaxed" style={{ opacity: 0.9 }}>
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
