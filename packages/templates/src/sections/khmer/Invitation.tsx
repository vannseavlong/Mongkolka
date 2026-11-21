"use client";

import type { CoupleInfo, InvitationContent, InvitationParty, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { pickLang } from "./skin-logic";
import { GoldRule, StubSection, useHeadingFont } from "./stub-parts";

export interface InvitationKhmerProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: InvitationContent;
}

function Family({ party, side, theme }: { party?: InvitationParty; side: "groom" | "bride"; theme: Theme }) {
  const { t, language } = useLanguage();
  const headingFont = useHeadingFont();
  if (!party) return null;
  const father = pickLang(language, party.fatherKh, party.fatherEn);
  const mother = pickLang(language, party.motherKh, party.motherEn);
  const name = pickLang(language, party.nameKh, party.nameEn);
  return (
    <div className="flex-1 space-y-1 text-sm leading-relaxed">
      {father && <p className="m-0">{father}</p>}
      {mother && <p className="m-0">{mother}</p>}
      {name && (
        <>
          <p className="m-0 pt-2 opacity-70">{t(side === "groom" ? "khmer.invitation.son" : "khmer.invitation.daughter")}</p>
          <p className="m-0 text-lg" style={{ fontFamily: headingFont, color: theme.accent_color }}>
            {name}
          </p>
        </>
      )}
    </div>
  );
}

/**
 * PLACEHOLDER (Web-khmer-core-sections builds the real one): groom's family left, bride's right, lunar and
 * solar date below. Returns nothing when the couple has not filled it in. No countdown yet.
 */
export function InvitationKhmer({ theme, content }: InvitationKhmerProps) {
  const { t, language } = useLanguage();
  if (!content) return null;
  const { groom, bride } = content;
  const greeting = pickLang(language, content.greetingKh, content.greetingEn);
  const hasPeople = Boolean(groom || bride);
  if (!hasPeople && !content.lunarKh && !content.solarKh && !greeting) return null;

  return (
    <StubSection theme={theme} id="invitation" heading={t("khmer.invitation.heading")}>
      {greeting && <p className="m-0 mb-6 text-sm leading-relaxed">{greeting}</p>}
      {hasPeople && (
        <div className="flex items-start gap-4">
          <Family party={groom} side="groom" theme={theme} />
          {content.monogram && (
            <div aria-hidden className="self-center text-xl" style={{ color: theme.accent_color }}>
              {content.monogram}
            </div>
          )}
          <Family party={bride} side="bride" theme={theme} />
        </div>
      )}
      {(content.lunarKh || content.solarKh) && (
        <>
          <GoldRule accent={theme.accent_color} />
          {content.lunarKh && <p className="m-0 text-sm leading-relaxed">{content.lunarKh}</p>}
          {content.solarKh && <p className="m-0 text-sm leading-relaxed">{content.solarKh}</p>}
        </>
      )}
    </StubSection>
  );
}
