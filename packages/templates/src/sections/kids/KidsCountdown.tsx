"use client";

import type { Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { ROUNDED_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { chromeText } from "../../chrome/strings";
import { formatCountdownUnit } from "../../chrome/countdown";
import { useCountdown } from "../../chrome/use-countdown";
import { kidsPalette } from "./art/palette";

/** Party countdown: four chunky pastel tiles; "Party day!" on the day, "The party has started!" once it begins, nothing after. */
export function KidsCountdown({ startsAt, theme }: { startsAt: string; theme: Theme }) {
  const { t, language } = useLanguage();
  const pal = kidsPalette(theme);
  const cd = useCountdown(startsAt);
  if (cd && (cd.status === "ended" || cd.status === "invalid")) return null;

  const tiles = [
    { key: "countdown.days", value: cd?.days, bg: pal.peach },
    { key: "countdown.hours", value: cd?.hours, bg: pal.mint },
    { key: "countdown.minutes", value: cd?.minutes, bg: pal.lavender },
    { key: "countdown.seconds", value: cd?.seconds, bg: withAlpha(pal.rose, 0.35) },
  ] as const;
  const showTiles = !cd || cd.status === "upcoming" || cd.status === "day";
  const badge = cd?.status === "day" ? t("kids.countdown.today") : cd?.status === "started" ? t("kids.countdown.started") : "";

  return (
    <div className="mt-8" role="timer" aria-label={t("kids.countdown.heading")}>
      <p className="m-0 mb-4 text-sm font-bold" style={{ color: pal.berry, fontFamily: ROUNDED_FONT }}>
        {t("kids.countdown.heading")}
      </p>
      {badge && (
        <p className="kd-pulse m-0 mb-4 text-xl font-bold" style={{ color: pal.berry, fontFamily: ROUNDED_FONT }}>
          {badge}
        </p>
      )}
      {showTiles && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {tiles.map((tile) => (
            <div key={tile.key} className="rounded-3xl px-1 py-3" style={{ background: tile.bg, border: "2.5px solid #fff", boxShadow: `0 5px 0 -1px ${withAlpha(pal.berry, 0.18)}` }}>
              <div className="text-2xl font-bold leading-none sm:text-3xl" style={{ fontFamily: ROUNDED_FONT, color: pal.berry, fontVariantNumeric: "tabular-nums" }}>
                {tile.value === undefined ? "––" : formatCountdownUnit(tile.value, language)}
              </div>
              <div className="mt-2 text-[11px] font-semibold leading-tight" style={{ color: theme.text_color }}>
                {chromeText(language, tile.key)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
