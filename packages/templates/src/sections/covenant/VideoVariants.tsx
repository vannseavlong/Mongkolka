"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Play } from "lucide-react";
import type { Theme, VideoContent } from "../../types";
import { useLanguage } from "../../i18n";
import { KHMER_BODY_FONT } from "../../chrome/fonts";
import { goldStops, withAlpha } from "../../chrome/gold";
import { COVENANT_CSS } from "./covenant-styles";
import { covenantPalette } from "./palette";
import { youtubeEmbedUrl, youtubeId, youtubeThumbUrl } from "./video-logic";

const SCRIPT = 'var(--font-script), "Great Vibes", cursive';
type Vars = CSSProperties & Record<`--${string}`, string | number>;

export interface VideoVariantProps {
  theme: Theme;
  content?: VideoContent;
}

/** The poster (YouTube thumbnail, fades in) with the gold play button; once tapped, the privacy-enhanced player. Fills its parent. */
function Player({ id, title, playing, onPlay, shade = true }: { id: string; title: string; playing: boolean; onPlay: () => void; shade?: boolean }) {
  const { t } = useLanguage();
  if (playing) {
    return <iframe src={youtubeEmbedUrl(id)} title={title} className="absolute inset-0 h-full w-full border-0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />;
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={youtubeThumbUrl(id)} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="cv-poster absolute inset-0 h-full w-full object-cover" />
      {shade && <span aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(60,20,36,.05), rgba(60,20,36,.5))" }} />}
      <button type="button" className="cv-play" onClick={onPlay} aria-label={t("covenant.video.play")}>
        <span className="cv-play-btn">
          <Play className="size-8" fill="#ffffff" color="#ffffff" aria-hidden style={{ marginLeft: 4 }} />
        </span>
      </button>
    </>
  );
}

/** Section shell: the page colour, the heading, and the gold variables the play button uses. */
function Shell({ theme, align = "center", children, heading = true }: { theme: Theme; align?: "center" | "left"; children: ReactNode; heading?: boolean }) {
  const { t } = useLanguage();
  const p = covenantPalette(theme);
  const style: Vars = { backgroundColor: theme.bg_color, color: theme.text_color, fontFamily: KHMER_BODY_FONT, "--cv-hi": p.gold.hi, "--cv-mid": p.gold.mid, "--cv-lo": p.gold.lo };
  return (
    <section id="video" className={`px-4 py-14 sm:px-6 ${align === "center" ? "text-center" : ""}`} style={style}>
      <style href="mk-covenant-css" precedence="mk-covenant">
        {COVENANT_CSS}
      </style>
      {heading && (
        <h2 className="m-0 mb-7 text-2xl font-semibold" style={{ color: theme.accent_color }}>
          {t("covenant.video.heading")}
        </h2>
      )}
      {children}
    </section>
  );
}

function useVideo(content?: VideoContent) {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(content?.url);
  const caption = content?.title?.trim() ?? "";
  return { id, caption, playing, play: () => setPlaying(true), title: caption || t("covenant.video.heading") };
}

/** Cinema: a dark letterboxed screen in a thin gold frame with corner brackets, the caption in script underneath. */
export function CovenantVideoCinema({ theme, content }: VideoVariantProps) {
  const v = useVideo(content);
  if (!v.id) return null;
  const g = goldStops(theme.accent_color);
  const bracket = (pos: string, rot: string) => (
    <svg aria-hidden className={`absolute size-7 ${pos}`} viewBox="0 0 24 24" fill="none" stroke={g.mid} strokeWidth="2" strokeLinecap="round" style={{ transform: rot }}>
      <path d="M3 21V6a3 3 0 0 1 3-3h15" />
    </svg>
  );
  return (
    <Shell theme={theme}>
      <div className="relative mx-auto max-w-3xl p-3 sm:p-4" style={{ background: "#1d0f16", borderRadius: 6, boxShadow: `0 0 0 1px ${g.lo}, 0 0 0 5px #1d0f16, 0 0 0 6px ${g.mid}, 0 28px 40px -22px rgba(40,10,25,.7)` }}>
        {bracket("left-1 top-1", "none")}
        {bracket("right-1 top-1", "scaleX(-1)")}
        {bracket("bottom-1 left-1", "scaleY(-1)")}
        {bracket("bottom-1 right-1", "scale(-1,-1)")}
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          <Player id={v.id} title={v.title} playing={v.playing} onPlay={v.play} />
        </div>
      </div>
      {v.caption && (
        <p className="m-0 mt-6 break-words" style={{ color: theme.accent_color, fontFamily: SCRIPT, fontSize: "1.9rem", lineHeight: 1.25 }}>
          {v.caption}
        </p>
      )}
    </Shell>
  );
}

/** Arch: the poster inside an arched window with a double gold edge; it opens into a normal wide player when played. */
export function CovenantVideoArch({ theme, content }: VideoVariantProps) {
  const v = useVideo(content);
  if (!v.id) return null;
  const g = goldStops(theme.accent_color);
  if (v.playing) {
    return (
      <Shell theme={theme}>
        <div className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden" style={{ borderRadius: 18, boxShadow: `0 0 0 2px ${g.mid}, 0 22px 36px -20px rgba(90,40,60,.55)` }}>
          <Player id={v.id} title={v.title} playing onPlay={v.play} />
        </div>
      </Shell>
    );
  }
  return (
    <Shell theme={theme}>
      <div className="mx-auto w-full max-w-xs p-[5px]" style={{ borderRadius: "999px 999px 20px 20px", background: `linear-gradient(160deg, ${g.hi}, ${g.mid} 50%, ${g.lo})`, boxShadow: "0 26px 38px -22px rgba(90,40,60,.6)" }}>
        <div className="p-[5px]" style={{ borderRadius: "999px 999px 16px 16px", backgroundColor: "#ffffff" }}>
          <div className="relative overflow-hidden" style={{ aspectRatio: "3 / 4", borderRadius: "999px 999px 12px 12px", backgroundColor: "#2a1520" }}>
            <Player id={v.id} title={v.title} playing={false} onPlay={v.play} />
          </div>
        </div>
      </div>
      {v.caption && (
        <p className="m-0 mt-6 break-words text-lg" style={{ color: theme.accent_color }}>
          {v.caption}
        </p>
      )}
    </Shell>
  );
}

/** Polaroid: a tilted white print with tape on top; the caption is written on the white strip underneath. */
export function CovenantVideoPolaroid({ theme, content }: VideoVariantProps) {
  const v = useVideo(content);
  if (!v.id) return null;
  const tape = withAlpha(theme.accent_color, 0.28);
  return (
    <Shell theme={theme}>
      <div className="relative mx-auto w-full max-w-xl" style={{ transform: v.playing ? "none" : "rotate(-1.6deg)", transition: "transform .5s ease" }}>
        <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rotate-2" style={{ background: tape, backdropFilter: "blur(1px)" }} />
        <div className="bg-white p-3 pb-5 sm:p-4 sm:pb-6" style={{ boxShadow: "0 24px 38px -20px rgba(60,30,40,.55)", outline: `1px solid ${withAlpha(theme.accent_color, 0.2)}` }}>
          <div className="relative aspect-video w-full overflow-hidden bg-black">
            <Player id={v.id} title={v.title} playing={v.playing} onPlay={v.play} shade={false} />
          </div>
          <p className="m-0 mt-4 break-words text-center" style={{ color: "#3d2a31", fontFamily: SCRIPT, fontSize: "1.7rem", lineHeight: 1.2, minHeight: "2rem" }}>
            {v.caption}
          </p>
        </div>
      </div>
    </Shell>
  );
}

/** Story: on a wide screen the words sit on the left (heading, caption, a gold rule) and the player on the right; on a phone they stack. */
export function CovenantVideoStory({ theme, content }: VideoVariantProps) {
  const { t } = useLanguage();
  const v = useVideo(content);
  if (!v.id) return null;
  const g = goldStops(theme.accent_color);
  return (
    <Shell theme={theme} heading={false}>
      <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[1fr_1.5fr] md:gap-12">
        <div className="text-center md:text-left">
          <h2 className="m-0 text-2xl font-semibold md:text-3xl" style={{ color: theme.accent_color }}>
            {t("covenant.video.heading")}
          </h2>
          <span aria-hidden className="mx-auto my-4 block h-px w-24 md:mx-0" style={{ background: `linear-gradient(90deg, ${g.lo}, ${g.hi}, transparent)` }} />
          {v.caption && (
            <p className="m-0 break-words" style={{ fontFamily: SCRIPT, fontSize: "1.9rem", lineHeight: 1.3, color: theme.text_color }}>
              {v.caption}
            </p>
          )}
        </div>
        <div className="relative aspect-video w-full overflow-hidden" style={{ borderRadius: 16, backgroundColor: "#2a1520", boxShadow: `0 0 0 2px ${g.mid}, 0 22px 36px -20px rgba(90,40,60,.55)` }}>
          <Player id={v.id} title={v.title} playing={v.playing} onPlay={v.play} />
        </div>
      </div>
    </Shell>
  );
}
