"use client";

import type { ReactNode } from "react";
import type { CoupleInfo, NoteContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { goldStops, withAlpha } from "../../chrome/gold";
import { COVENANT_CSS } from "./covenant-styles";
import { hasKhmer } from "./intro-logic";
import { PINK } from "./palette";
import { noteView, type NoteView } from "./text-logic";

export interface CovenantNoteProps {
  couple?: CoupleInfo;
  theme: Theme;
  content?: NoteContent;
}

/** A wine glass crossed out: the built-in "no alcohol" note's icon. Original line art. */
function NoAlcohol({ color, size = 30 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      <path d="M10 4h12l-.8 7.2a5.2 5.2 0 0 1-10.4 0L10 4Z" />
      <path d="M16 16.4V26M11.5 26h9" />
      <circle cx="16" cy="16" r="13.2" />
      <path d="M6.6 25.4 25.4 6.6" />
    </svg>
  );
}

/** A small heart for custom notes (their text is not about alcohol, so the glass would mislead). */
function Heart({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      <path d="M16 27S4.5 20 4.5 12.2A6.2 6.2 0 0 1 16 8.6a6.2 6.2 0 0 1 11.5 3.6C27.5 20 16 27 16 27Z" />
    </svg>
  );
}

function useNote(content?: NoteContent): { view: NoteView; language: "en" | "kh" } {
  const { t, language } = useLanguage();
  return { view: noteView(content, language, { title: t("covenant.note.defaultTitle"), body: t("covenant.note.defaultBody") }), language };
}

function Shell({ theme, children, tight }: { theme: Theme; children: ReactNode; tight?: boolean }) {
  return (
    <section id="note" className={`px-4 sm:px-6 ${tight ? "py-8" : "py-14"}`} style={{ backgroundColor: theme.bg_color, color: theme.text_color, fontFamily: KHMER_BODY_FONT }}>
      <style href="mk-covenant-css" precedence="mk-covenant">
        {COVENANT_CSS}
      </style>
      {children}
    </section>
  );
}

const Body = ({ view }: { view: NoteView }) => (
  <>
    {view.body.map((p, i) => (
      <p key={i} className="m-0 mb-2 whitespace-pre-line break-words last:mb-0" style={{ overflowWrap: "anywhere" }}>
        {p}
      </p>
    ))}
  </>
);

const Title = ({ view, color, size = "1.15rem" }: { view: NoteView; color: string; size?: string }) =>
  view.title ? (
    <h2 className="m-0 mb-2 font-semibold" style={{ color, fontSize: size, fontFamily: hasKhmer(view.title) ? MOUL_FONT : undefined, lineHeight: hasKhmer(view.title) ? 1.9 : 1.35 }}>
      {view.title}
    </h2>
  ) : null;

/** Card: a white card with a gold hairline, a round icon seal on top, the title and the words centred. */
export function CovenantNoteCard({ theme, content }: CovenantNoteProps) {
  const { view } = useNote(content);
  const g = goldStops(theme.accent_color);
  const Icon = view.builtIn ? NoAlcohol : Heart;
  return (
    <Shell theme={theme}>
      <div className="relative mx-auto max-w-md rounded-3xl px-6 pb-7 pt-10 text-center text-[15px] leading-relaxed" style={{ backgroundColor: "#fff", color: "#3d2a31", border: `1px solid ${withAlpha(theme.accent_color, 0.4)}`, boxShadow: "0 22px 36px -26px rgba(90,40,60,.6)" }}>
        <span className="absolute left-1/2 top-0 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full" style={{ background: "#fff", boxShadow: `0 0 0 2px ${g.mid}, 0 8px 16px -8px rgba(90,40,60,.5)` }}>
          <Icon color={g.lo} />
        </span>
        <Title view={view} color={theme.accent_color} />
        <Body view={view} />
      </div>
    </Shell>
  );
}

/** Banner: a slim blush band with the icon beside the words. Quiet, for a note that should be seen but not shout. */
export function CovenantNoteBanner({ theme, content }: CovenantNoteProps) {
  const { view } = useNote(content);
  const Icon = view.builtIn ? NoAlcohol : Heart;
  return (
    <Shell theme={theme} tight>
      <div className="mx-auto flex max-w-2xl items-center gap-4 rounded-2xl px-5 py-4 text-left text-[15px] leading-relaxed" style={{ backgroundColor: withAlpha(PINK.petal, 0.35), color: theme.text_color, border: `1px dashed ${withAlpha(theme.accent_color, 0.6)}` }}>
        <span className="grid size-12 shrink-0 place-items-center rounded-full" style={{ backgroundColor: "#fff", boxShadow: `0 0 0 1px ${withAlpha(theme.accent_color, 0.5)}` }}>
          <Icon color={theme.accent_color} />
        </span>
        <div className="min-w-0">
          <Title view={view} color={theme.accent_color} size="1rem" />
          <Body view={view} />
        </div>
      </div>
    </Shell>
  );
}

/** Ribbon: a gold ribbon carries the title across the top of a blush card; the words sit below it. */
export function CovenantNoteRibbon({ theme, content }: CovenantNoteProps) {
  const { view } = useNote(content);
  const g = goldStops(theme.accent_color);
  const Icon = view.builtIn ? NoAlcohol : Heart;
  return (
    <Shell theme={theme}>
      <div className="mx-auto max-w-lg">
        <div className="relative mx-auto -mb-5 w-fit max-w-full px-8 py-2 text-center" style={{ background: `linear-gradient(135deg, ${g.hi}, ${g.mid} 55%, ${g.lo})`, color: "#fff", clipPath: "polygon(0 0,100% 0,96% 50%,100% 100%,0 100%,4% 50%)", filter: "drop-shadow(0 6px 8px rgba(90,40,60,.3))", zIndex: 1 }}>
          <span className="flex items-center justify-center gap-2" style={{ fontFamily: hasKhmer(view.title) ? MOUL_FONT : undefined, fontSize: "1rem", lineHeight: 1.9 }}>
            <Icon color="#fff" size={22} />
            {view.title || " "}
          </span>
        </div>
        <div className="rounded-3xl px-6 pb-7 pt-10 text-center text-[15px] leading-relaxed" style={{ backgroundColor: withAlpha(PINK.blush, 0.9), color: "#3d2a31", border: `1px solid ${withAlpha(theme.accent_color, 0.35)}` }}>
          <Body view={view} />
        </div>
      </div>
    </Shell>
  );
}
