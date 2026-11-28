"use client";

import type { CoupleInfo, InvitationContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { CINZEL_FONT, MOUL_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { Countdown } from "./Countdown";
import { OrnateSection } from "./OrnateSection";
import { buildInvitationView, type InvitationBlock } from "./invitation-logic";
import type { FamilyView } from "./lineage";
import { useSkinOrnaments } from "./skin-context";
import { textFor } from "./strings";

export interface InvitationKhmerProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: InvitationContent;
}

const SCRIPT = 'var(--font-script), "Great Vibes", cursive';

function Family({ family, lang, theme }: { family: FamilyView | null; lang: "en" | "kh"; theme: Theme }) {
  const sk = useSkinOrnaments();
  if (!family) return <div className="row-span-2" />;
  const label = textFor(lang, family.side === "groom" ? "khmer.invitation.son" : "khmer.invitation.daughter");
  return (
    // Two rows shared with the other family (subgrid), so both names line up however many parents each side has.
    <div className="row-span-2 grid min-w-0 grid-rows-subgrid text-[13px] leading-relaxed sm:text-sm">
      <div className="space-y-1.5 self-center">
        {family.parents.map((line) => (
          <p key={line} className="m-0 break-words">
            {line}
          </p>
        ))}
      </div>
      {family.name && (
        <div className="space-y-1.5 self-start">
          <p className="m-0 pt-3 text-xs opacity-75">{label}</p>
          <p
            className="m-0 break-words"
            style={{
              ...sk.heading(theme, lang),
              fontFamily: lang === "kh" ? MOUL_FONT : SCRIPT,
              fontSize: lang === "kh" ? "1.05rem" : "1.7rem",
              letterSpacing: "normal",
              textTransform: "none",
              lineHeight: lang === "kh" ? 1.9 : 1.25,
            }}
          >
            {family.name}
          </p>
        </div>
      )}
    </div>
  );
}

function Block({ block, theme }: { block: InvitationBlock; theme: Theme }) {
  return (
    <div lang={block.lang === "kh" ? "km" : "en"}>
      <p className="m-0 mb-6 text-sm italic leading-loose opacity-90">{block.greeting}</p>
      <div className="grid gap-x-3 gap-y-1.5" style={{ gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)" }}>
        <Family family={block.groom} lang={block.lang} theme={theme} />
        <div aria-hidden className="row-span-2 mx-auto h-full w-px self-stretch" style={{ minHeight: 64, backgroundImage: `linear-gradient(180deg, transparent, ${withAlpha(theme.accent_color, 0.75)}, transparent)` }} />
        <Family family={block.bride} lang={block.lang} theme={theme} />
      </div>
    </div>
  );
}

/**
 * The formal invitation: crest, then one block per language (yours first) with the groom's family
 * on the left and the bride's on the right, the Khmer lunar and solar date, and a live countdown.
 * Returns nothing until the couple has filled something in.
 */
export function InvitationKhmer({ couple, theme, content }: InvitationKhmerProps) {
  const { t, language } = useLanguage();
  const sk = useSkinOrnaments();
  const view = buildInvitationView(
    content,
    couple,
    language,
    (lang) => textFor(lang, "khmer.invitation.formal"),
    // Only Covenant (the Christian template) says it by default; elsewhere the couple writes it.
    (lang) => (sk.id === "covenant" ? textFor(lang, "khmer.invitation.notice") : ""),
  );
  if (view.isEmpty) return null;

  const dateLine = { fontFamily: CINZEL_FONT, letterSpacing: "0.16em" } as const;

  return (
    <OrnateSection theme={theme} id="invitation">
      <div className={`mx-auto mb-8 w-fit ${sk.motion === "float" ? "kh-float" : ""} ${sk.motion === "shimmer" ? "kh-sweep rounded-full" : ""}`}>
        <sk.Crest color={theme.accent_color} ground={theme.bg_color} label={view.monogram} size={116} />
      </div>
      <h2 className="m-0 mb-2 text-xl sm:text-2xl" style={sk.heading(theme, language)}>
        {t("khmer.invitation.heading")}
      </h2>
      <div className="mb-8">
        <sk.Divider color={theme.accent_color} />
      </div>

      {view.looseGreeting && <p className="m-0 mb-6 whitespace-pre-line text-sm leading-loose">{view.looseGreeting}</p>}
      {view.blocks.map((block, i) => (
        <div key={block.lang}>
          {i > 0 && (
            <div aria-hidden className="mx-auto my-8 h-px w-24" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${withAlpha(theme.accent_color, 0.75)}, transparent)` }} />
          )}
          <Block block={block} theme={theme} />
        </div>
      ))}

      {(view.lunar || view.solarKh || view.englishDate) && (
        <div className="mt-10">
          <div aria-hidden className="mx-auto h-px w-24" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${withAlpha(theme.accent_color, 0.75)}, transparent)` }} />
          <div className="mt-6 space-y-4">
            {view.lunar && (
              <p className="m-0 px-1" style={{ ...sk.heading(theme, "kh"), fontSize: "1.05rem", lineHeight: 2.3, wordSpacing: "0.15em", textWrap: "balance" }} lang="km">
                {view.lunar}
              </p>
            )}
            {view.solarKh && (
              <p className="m-0 text-[15px] leading-loose" lang="km">
                {view.solarKh}
              </p>
            )}
            {view.englishDate && (
              <p className="m-0 pt-2 text-[13px] font-semibold sm:text-sm" style={{ ...dateLine, color: theme.accent_color }}>
                {view.englishDate}
              </p>
            )}
            {(view.timeEn || view.timeKh) && (
              <p className="m-0 text-[15px] leading-loose">{language === "kh" ? view.timeKh : view.timeEn}</p>
            )}
            {view.notice && (
              <p className="m-0 break-words text-[15px] font-semibold leading-loose" style={{ color: theme.accent_color }} lang={language === "kh" ? "km" : "en"}>
                {view.notice}
              </p>
            )}
          </div>
        </div>
      )}

      {view.startsAt && <Countdown startsAt={view.startsAt} theme={theme} />}
    </OrnateSection>
  );
}
