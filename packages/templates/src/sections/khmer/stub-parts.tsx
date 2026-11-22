"use client";

import type { ReactNode } from "react";
import type { Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { goldGradient, withAlpha } from "../../chrome/gold";

/** Shared look of every skin stub and shared Khmer section: themed ground, gold hairline, Khmer-aware type. */

export function useHeadingFont(): string {
  const { language } = useLanguage();
  return language === "kh" ? MOUL_FONT : CINZEL_FONT;
}

export function StubSection({
  theme,
  id,
  heading,
  children,
}: {
  theme: Theme;
  id?: string;
  heading?: string;
  children: ReactNode;
}) {
  const headingFont = useHeadingFont();
  return (
    <section
      id={id}
      className="px-6 py-16 text-center"
      style={{ backgroundColor: theme.bg_color, color: theme.text_color, fontFamily: KHMER_BODY_FONT }}
    >
      <div
        className="mx-auto max-w-2xl rounded-3xl px-5 py-10 sm:px-10"
        style={{ border: `1px solid ${withAlpha(theme.accent_color, 0.55)}` }}
      >
        {heading && (
          <>
            <h2 className="m-0 text-xl leading-relaxed sm:text-2xl" style={{ fontFamily: headingFont, color: theme.accent_color }}>
              {heading}
            </h2>
            <GoldRule accent={theme.accent_color} />
          </>
        )}
        {children}
      </div>
    </section>
  );
}

export function GoldRule({ accent }: { accent: string }) {
  return (
    <div
      aria-hidden
      className="mx-auto my-6 h-px w-24"
      style={{ backgroundImage: goldGradient(accent, 90) }}
    />
  );
}

export function GoldButton({
  theme,
  onClick,
  href,
  children,
}: {
  theme: Theme;
  onClick?: () => void;
  href?: string;
  children: ReactNode;
}) {
  const style = {
    backgroundImage: goldGradient(theme.accent_color),
    color: theme.bg_color,
    fontFamily: KHMER_BODY_FONT,
  };
  const cls =
    "inline-flex min-h-11 items-center justify-center rounded-full px-8 py-3 text-base font-semibold no-underline shadow-md";
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  );
}
