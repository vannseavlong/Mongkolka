"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { Theme, VideoContent } from "../../types";
import { useLanguage } from "../../i18n";
import { KHMER_BODY_FONT } from "../../chrome/fonts";
import { COVENANT_CSS } from "./covenant-styles";
import { covenantPalette } from "./palette";
import { youtubeEmbedUrl, youtubeId, youtubeThumbUrl } from "./video-logic";

export interface CovenantVideoProps {
  theme: Theme;
  content?: VideoContent;
}

/**
 * The couple's YouTube video. Nothing is embedded until the guest taps play (the page stays light, and the player's
 * third-party cookies are only set on purpose): a thumbnail with a gold play button, then the privacy-enhanced
 * (youtube-nocookie) player. Only the video id is taken from the link. Just the video under a heading: no card, no
 * caption, no outside link. Returns nothing without a valid link.
 */
export function CovenantVideo({ theme, content }: CovenantVideoProps) {
  const { t } = useLanguage();
  const p = covenantPalette(theme);
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(content?.url);
  if (!id) return null;
  const title = content?.title?.trim();
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
        {playing ? (
          <iframe
            src={youtubeEmbedUrl(id)}
            title={title || heading}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={youtubeThumbUrl(id)} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
            <span aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(60,20,36,.1), rgba(60,20,36,.45))" }} />
            <button type="button" className="cv-play" onClick={() => setPlaying(true)} aria-label={t("covenant.video.play")}>
              <span className="cv-play-btn">
                <Play className="size-8" fill="#ffffff" color="#ffffff" aria-hidden style={{ marginLeft: 4 }} />
              </span>
            </button>
          </>
        )}
      </div>
    </section>
  );
}
