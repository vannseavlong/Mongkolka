"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import type { VideoContent } from "../../types";
import { useLanguage } from "../../i18n";
import { AUTOPLAY_RATIO, YOUTUBE_PLAYER_ORIGIN, scrollAction, youtubeCommand, youtubeEmbedUrl, youtubeId, youtubeThumbUrl } from "./video-logic";

type Mode = "poster" | "muted" | "sound";

/**
 * Playback state for one video. Scrolling to it starts it muted; tapping the poster first starts it with sound.
 * It never starts by itself inside an `inert` preview (builder and gallery thumbnails) or with reduced motion.
 */
export function useVideo(content?: VideoContent) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>("poster");
  const [box, setBox] = useState<HTMLElement | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const started = useRef(false);
  const pausedByScroll = useRef(false);
  const id = youtubeId(content?.url);
  const caption = content?.title?.trim() ?? "";

  const send = (func: "playVideo" | "pauseVideo") => frame.current?.contentWindow?.postMessage(youtubeCommand(func), YOUTUBE_PLAYER_ORIGIN);

  useEffect(() => {
    if (!box || typeof IntersectionObserver === "undefined") return;
    if (box.closest("[inert]") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const action = scrollAction(entry.isIntersecting ? entry.intersectionRatio : 0, started.current, pausedByScroll.current);
        if (action === "start") {
          started.current = true;
          setMode((m) => (m === "poster" ? "muted" : m));
        } else if (action) {
          pausedByScroll.current = action === "pause";
          send(action === "pause" ? "pauseVideo" : "playVideo");
        }
      },
      { threshold: [0, AUTOPLAY_RATIO] },
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, [box]);

  return {
    id,
    caption,
    title: caption || t("covenant.video.heading"),
    mode,
    playing: mode !== "poster",
    setBox,
    frame,
    play: () => {
      started.current = true;
      setMode("sound");
    },
    /** The guest may have scrolled away before the player finished loading. */
    onLoad: () => pausedByScroll.current && send("pauseVideo"),
  };
}

/** The poster with the gold play button, then the privacy-enhanced (youtube-nocookie) player. Fills its parent. */
export function Player({ video, shade = true, poster = "cv-poster" }: { video: ReturnType<typeof useVideo>; shade?: boolean; poster?: string }) {
  const { t } = useLanguage();
  if (!video.id) return null;
  return (
    <div ref={video.setBox} className="absolute inset-0">
      {video.playing ? (
        <iframe
          ref={video.frame}
          onLoad={video.onLoad}
          src={youtubeEmbedUrl(video.id, video.mode === "muted")}
          title={video.title}
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={youtubeThumbUrl(video.id)} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className={`${poster} absolute inset-0 h-full w-full object-cover`} />
          {shade && <span aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(60,20,36,.05), rgba(60,20,36,.5))" }} />}
          <button type="button" className="cv-play" onClick={video.play} aria-label={t("covenant.video.play")}>
            <span className="cv-play-btn">
              <Play className="size-5" fill="#ffffff" color="#ffffff" aria-hidden style={{ marginLeft: 3 }} />
            </span>
          </button>
        </>
      )}
    </div>
  );
}
