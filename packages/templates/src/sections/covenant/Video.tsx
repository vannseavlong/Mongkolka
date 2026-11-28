"use client";

import type { Theme, VideoContent } from "../../types";
import { useLanguage } from "../../i18n";
import { KHMER_BODY_FONT } from "../../chrome/fonts";
import { COVENANT_CSS } from "./covenant-styles";
import { covenantPalette } from "./palette";
import { Player, useVideo } from "./video-player";

export interface CovenantVideoProps {
  theme: Theme;
  content?: VideoContent;
}

/**
 * The couple's YouTube video: a thumbnail with a gold play button until the guest scrolls to it, then the
 * privacy-enhanced player, muted (see useVideo). Only the video id is taken from the link. Just the video under a
 * heading: no card, no caption, no outside link. Returns nothing without a valid link.
 */
export function CovenantVideo({ theme, content }: CovenantVideoProps) {
  const { t } = useLanguage();
  const p = covenantPalette(theme);
  const video = useVideo(content);
  if (!video.id) return null;
  const heading = t("covenant.video.heading");

  return (
    <section id="video" className="px-4 py-14 text-center sm:px-6" style={{ backgroundColor: theme.bg_color, color: theme.text_color, fontFamily: KHMER_BODY_FONT }}>
      <h2 className="m-0 mb-6 text-2xl font-semibold" style={{ color: theme.accent_color }}>
        {heading}
      </h2>
      <style href="mk-covenant-css" precedence="mk-covenant">
        {COVENANT_CSS}
      </style>
      <div
        className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden"
        style={{ borderRadius: 14, boxShadow: "0 18px 34px -18px rgba(90,40,60,.45)", backgroundColor: "#2a1520", ["--cv-hi" as string]: p.gold.hi, ["--cv-mid" as string]: p.gold.mid, ["--cv-lo" as string]: p.gold.lo }}
      >
        <Player video={video} poster="" />
      </div>
    </section>
  );
}
