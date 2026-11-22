"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { KHMER_BODY_FONT } from "../../chrome/fonts";
import { mixHex, withAlpha } from "../../chrome/gold";
import { isDarkColor } from "./foil";
import { KHMER_CSS } from "./khmer-styles";
import { useSkinOrnaments } from "./skin-context";

const CORNER = 54;

const cornerPos: Array<{ key: string; style: CSSProperties }> = [
  { key: "tl", style: { top: 6, left: 6 } },
  { key: "tr", style: { top: 6, right: 6, transform: "scaleX(-1)" } },
  { key: "bl", style: { bottom: 6, left: 6, transform: "scaleY(-1)" } },
  { key: "br", style: { bottom: 6, right: 6, transform: "scale(-1,-1)" } },
];

export interface OrnateSectionProps {
  theme: Theme;
  id?: string;
  heading?: string;
  children: ReactNode;
}

/**
 * The shared frame of every Khmer section: themed ground, a skin-styled card with pin-stripe and
 * corner ornaments, a foil heading and the skin's divider. All of the look comes from the active
 * skin's ornaments, so a skin changes it without touching a section.
 */
export function OrnateSection({ theme, id, heading, children }: OrnateSectionProps) {
  const { language } = useLanguage();
  const sk = useSkinOrnaments();
  const dark = isDarkColor(theme.bg_color);
  const glow = withAlpha(theme.accent_color, dark ? 0.16 : 0.1);
  return (
    <section
      id={id}
      data-mk-lang={language}
      className={sk.Backdrop ? "relative overflow-hidden px-4 py-14 text-center sm:px-6" : "px-4 py-14 text-center sm:px-6"}
      style={{
        color: theme.text_color,
        fontFamily: KHMER_BODY_FONT,
        backgroundColor: theme.bg_color,
        backgroundImage: `radial-gradient(120% 60% at 50% 0%, ${glow}, transparent 70%), radial-gradient(100% 50% at 50% 100%, ${withAlpha(mixHex(theme.accent_color, theme.bg_color, 50), dark ? 0.12 : 0.08)}, transparent 70%)`,
        ...sk.sectionBackground?.(theme),
      }}
    >
      <style href="mk-khmer-css" precedence="mk-khmer">
        {KHMER_CSS}
      </style>
      {sk.Backdrop && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <sk.Backdrop color={theme.accent_color} ground={theme.bg_color} />
        </div>
      )}
      <div className="relative mx-auto w-full max-w-xl px-6 py-14 sm:px-12" style={{ borderRadius: sk.radius, ...sk.surface(theme) }}>
        {sk.inset > 0 && (
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              inset: sk.inset,
              borderRadius: Math.max(0, sk.radius - sk.inset),
              border: `1px solid ${withAlpha(theme.accent_color, 0.3)}`,
            }}
          />
        )}
        {sk.corners &&
          cornerPos.map((c) => (
            <div key={c.key} aria-hidden className="pointer-events-none absolute" style={c.style}>
              <sk.Corner color={theme.accent_color} size={CORNER} />
            </div>
          ))}
        <div className="relative">
          {heading && (
            <>
              <h2 className="m-0 text-xl sm:text-2xl" style={sk.heading(theme, language)}>
                {heading}
              </h2>
              <div className="mb-8 mt-3">
                <sk.Divider color={theme.accent_color} />
              </div>
            </>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
