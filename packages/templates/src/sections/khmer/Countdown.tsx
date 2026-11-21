"use client";

import type { Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { CINZEL_FONT, MOUL_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { chromeText } from "../../chrome/strings";
import { formatCountdownUnit } from "../../chrome/countdown";
import { useCountdown } from "../../chrome/use-countdown";
import { useSkinOrnaments } from "./skin-context";

/** Live countdown tiles; "Wedding Day" on the day, "Event Started" once it begins, nothing after. */
export function Countdown({ startsAt, theme }: { startsAt: string; theme: Theme }) {
  const { t, language } = useLanguage();
  const sk = useSkinOrnaments();
  const cd = useCountdown(startsAt);
  if (cd && (cd.status === "ended" || cd.status === "invalid")) return null;

  const units = [
    { key: "countdown.days", value: cd?.days },
    { key: "countdown.hours", value: cd?.hours },
    { key: "countdown.minutes", value: cd?.minutes },
    { key: "countdown.seconds", value: cd?.seconds },
  ] as const;
  const showTiles = !cd || cd.status === "upcoming" || cd.status === "day";
  const badge = cd?.status === "day" ? t("khmer.countdown.today") : cd?.status === "started" ? t("khmer.countdown.started") : "";

  return (
    <div className="mt-8" role="timer" aria-label={t("khmer.countdown.heading")}>
      <p className="m-0 mb-4 text-sm" style={{ color: theme.accent_color, fontFamily: language === "kh" ? MOUL_FONT : CINZEL_FONT, letterSpacing: language === "kh" ? "normal" : "0.18em", textTransform: language === "kh" ? "none" : "uppercase", lineHeight: 1.9 }}>
        {t("khmer.countdown.heading")}
      </p>
      {badge && (
        <p className="kh-pulse m-0 mb-4 text-lg" style={{ ...sk.heading(theme, language), fontSize: "1.15rem" }}>
          {badge}
        </p>
      )}
      {showTiles && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {units.map((u) => (
            <div
              key={u.key}
              className={`${sk.motion === "shimmer" ? "kh-sweep " : ""}rounded-2xl px-1 py-3`}
              style={{ border: `1px solid ${withAlpha(theme.accent_color, 0.5)}`, background: withAlpha(theme.accent_color, 0.08) }}
            >
              <div className="text-2xl font-semibold leading-none sm:text-3xl" style={{ fontFamily: CINZEL_FONT, color: theme.accent_color, fontVariantNumeric: "tabular-nums" }}>
                {u.value === undefined ? "––" : formatCountdownUnit(u.value, language)}
              </div>
              <div className="mt-2 text-[11px] leading-tight opacity-80">{chromeText(language, u.key)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
