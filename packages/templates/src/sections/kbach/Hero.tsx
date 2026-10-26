"use client";

import { motion } from "motion/react";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { useGuest } from "../../guest-context";
import { Eyebrow, InkSection, LABEL_FONT, splitDate } from "../ink/shared";
import { ArchFrame, FoilText, KbachCorner, KbachStrip } from "./shared";

export interface HeroKbachProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

/** Ruby ground, a photo in a pointed arch, foil names and a framed date. */
export function HeroKbach({ couple, theme, content }: HeroKbachProps) {
  const { t } = useLanguage();
  const { name: guestName } = useGuest();
  const date = splitDate(couple.weddingDate);
  const foil = theme.accent_color;

  return (
    <InkSection theme={theme} inverted className="min-h-[100svh]">
      <div className="absolute inset-x-0 top-3 sm:top-5">
        <KbachStrip color={foil} />
      </div>
      <div className="absolute inset-x-0 bottom-3 sm:bottom-5">
        <KbachStrip color={foil} flip />
      </div>
      <KbachCorner color={foil} className="absolute left-2 top-10 size-14 sm:size-24" />
      <KbachCorner color={foil} className="absolute right-2 top-10 size-14 -scale-x-100 sm:size-24" />

      <div className="mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center gap-7 px-6 pb-20 pt-24 text-center">
        {guestName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm italic opacity-80"
          >
            {t("ink.invitedGuest")} {guestName}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-[min(70vw,300px)]"
        >
          <ArchFrame src={content?.coverPhotoUrl} alt={couple.partner1Name} foil={foil} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Eyebrow color={foil} className="!tracking-[0.3em]">
            {t("kbach.honour")}
          </Eyebrow>
          <h1 className="text-[clamp(2.6rem,11vw,5.2rem)] font-light italic leading-[1]">
            <FoilText accent={foil}>{couple.partner1Name}</FoilText>
            {couple.partner2Name && (
              <>
                <span className="mx-3 text-[0.55em]" style={{ color: foil }}>
                  &amp;
                </span>
                <FoilText accent={foil}>{couple.partner2Name}</FoilText>
              </>
            )}
          </h1>
          {date && (
            <p
              className="border-y px-6 py-2 text-xs uppercase tracking-[0.35em]"
              style={{ borderColor: foil, fontFamily: LABEL_FONT }}
            >
              {date.weekday} · {date.day} {date.month} {date.year}
            </p>
          )}
        </motion.div>
      </div>
    </InkSection>
  );
}
