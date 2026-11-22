"use client";

import type { CoupleInfo, InvitationContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { ROUNDED_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { OrnateSection } from "../khmer/OrnateSection";
import { useSkinOrnaments } from "../khmer/skin-context";
import { kidsPalette } from "./art/palette";
import { buildKidsInvitation } from "./invitation-logic";
import { KidsCountdown } from "./KidsCountdown";
import { KIDS_CSS } from "./kids-styles";

export interface InvitationKidsProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: InvitationContent;
}

function Pill({ children, bg, color }: { children: string; bg: string; color: string }) {
  return (
    <span className="inline-block rounded-full px-4 py-1.5 text-[13px] font-bold" style={{ background: bg, color, fontFamily: ROUNDED_FONT, border: "2px solid #fff" }}>
      {children}
    </span>
  );
}

/**
 * The birthday invitation: a cookie badge with the child's initial, "You're invited!", the invitation
 * message, the child's name in bubble gradient, who is hosting, the date and time on pastel pills and a
 * live party countdown. Shown only once something is filled in. Reads the shared InvitationContent
 * (`groom` = the child) so the couple editor needs no new form.
 */
export function InvitationKids({ couple, theme, content }: InvitationKidsProps) {
  const { t, language } = useLanguage();
  const sk = useSkinOrnaments();
  const pal = kidsPalette(theme);
  const view = buildKidsInvitation(content, couple, language);
  if (view.isEmpty) return null;

  return (
    <OrnateSection theme={theme} id="invitation">
      <style href="mk-kids-css" precedence="mk-kids">
        {KIDS_CSS}
      </style>
      <div className="kh-float mx-auto mb-6 w-fit">
        <sk.Crest color={pal.berry} ground={pal.ground} label={view.monogram} size={112} />
      </div>
      <h2 className="m-0 text-2xl sm:text-3xl" style={sk.heading(theme, language)}>
        {t("kids.invite.heading")}
      </h2>
      <div className="my-5">
        <sk.Divider color={pal.berry} />
      </div>
      <p className="m-0 mx-auto max-w-sm whitespace-pre-line text-[15px] leading-relaxed">{view.greeting || t("kids.invite.intro")}</p>

      {view.name && (
        <div className="mt-5">
          <p className="m-0 break-words font-bold leading-tight" style={{ ...sk.heading(theme, language), fontSize: "clamp(2.1rem, 10vw, 2.9rem)" }}>
            {view.name}
          </p>
          {view.otherName && (
            <p className="m-0 mt-1 text-sm opacity-75" lang={language === "kh" ? "en" : "km"}>
              {view.otherName}
            </p>
          )}
        </div>
      )}

      {view.hosts.length > 0 && (
        <div className="mt-6">
          <p className="m-0 text-xs font-semibold opacity-70">{t("kids.invite.from")}</p>
          {view.hosts.map((h) => (
            <p key={h} className="m-0 mt-1 break-words text-[15px] font-semibold">
              {h}
            </p>
          ))}
        </div>
      )}

      {(view.englishDate || view.solarKh || view.lunar || view.time) && (
        <div className="mt-7 flex flex-col items-center gap-2.5">
          {view.englishDate && language === "en" && <Pill bg={pal.peach} color={pal.berry}>{view.englishDate}</Pill>}
          {view.solarKh && language === "kh" && <Pill bg={pal.peach} color={pal.berry}>{view.solarKh}</Pill>}
          {view.lunar && (
            <p className="m-0 text-sm" lang="km" style={{ ...sk.heading(theme, "kh"), fontSize: "0.95rem" }}>
              {view.lunar}
            </p>
          )}
          {view.time && <Pill bg={pal.mint} color={pal.berry}>{view.time}</Pill>}
          {view.englishDate && language === "kh" && <p className="m-0 text-xs opacity-70" style={{ color: withAlpha(theme.text_color, 0.8) }}>{view.englishDate}</p>}
          {view.solarKh && language === "en" && <p className="m-0 text-xs opacity-70" lang="km">{view.solarKh}</p>}
        </div>
      )}

      {view.startsAt && <KidsCountdown startsAt={view.startsAt} theme={theme} />}
    </OrnateSection>
  );
}
