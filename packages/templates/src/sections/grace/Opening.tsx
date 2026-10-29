"use client";

// STUB: replaced by Web-grace-opening
import { GraceSection, Cross, gracePalette } from "./shared";
import { useLanguage } from "../../i18n";
import type { OpeningProps } from "../../types";
import { formatCoupleNames } from "../../format";

export function GraceOpening({ couple, theme, guestGreeting, onOpen }: OpeningProps) {
  const { t } = useLanguage();
  const p = gracePalette(theme);
  return (
    <GraceSection theme={theme} id="opening" className="text-center">
      <Cross stroke={p.accent} className="mx-auto h-10 w-auto" />
      <h2 className="mt-4 text-2xl" style={{ color: p.accent }}>{t("grace.opening.stub")}</h2>
      <p className="mt-3 break-words">{guestGreeting ?? formatCoupleNames(couple)}</p>
      <button type="button" onClick={onOpen} className="mt-6 rounded-full border px-6 py-2" style={{ borderColor: p.accent, color: p.accent }}>
        {t("opening.tapToOpen")}
      </button>
    </GraceSection>
  );
}
