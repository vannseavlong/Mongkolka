"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { musicReducer, toggleIntent, type MusicStatus } from "./audio";

export interface BackgroundMusic {
  /** There is a playable source, so the toggle should be shown. */
  available: boolean;
  status: MusicStatus;
  /** Starts playback. Call it directly inside a tap handler: mobile browsers refuse it otherwise. */
  play: () => void;
  toggle: () => void;
}

const TARGET_VOLUME = 0.7;
const FADE_MS = 1400;

function fadeIn(audio: HTMLAudioElement) {
  const start = performance.now();
  const step = (now: number) => {
    if (audio.paused) return;
    const t = Math.min(1, (now - start) / FADE_MS);
    audio.volume = TARGET_VOLUME * t;
    if (t < 1) requestAnimationFrame(step);
  };
  audio.volume = 0;
  requestAnimationFrame(step);
}

/**
 * Looping background music that only ever starts from a user tap (autoplay is blocked on mobile).
 * No network request happens before the first tap. Pauses while the tab is hidden and resumes after.
 */
export function useBackgroundMusic(src: string | undefined): BackgroundMusic {
  const [status, dispatch] = useReducer(musicReducer, "idle" as MusicStatus);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resumeAfterHidden = useRef(false);

  const play = useCallback(() => {
    if (!src) return;
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(src);
      audio.loop = true;
      audio.preload = "auto";
      audioRef.current = audio;
    }
    if (!audio.paused) return;
    audio
      .play()
      .then(() => {
        fadeIn(audio);
        dispatch("started");
      })
      .catch(() => dispatch("blocked"));
  }, [src]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    dispatch("paused");
  }, []);

  const toggle = useCallback(() => {
    if (toggleIntent(status) === "pause") pause();
    else play();
  }, [status, play, pause]);

  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.visibilityState === "hidden") {
        if (!audio.paused) {
          resumeAfterHidden.current = true;
          audio.pause();
        }
      } else if (resumeAfterHidden.current) {
        resumeAfterHidden.current = false;
        audio.play().catch(() => dispatch("blocked"));
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // A new source (or unmount) discards the old element so nothing keeps playing in the background.
  useEffect(
    () => () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
      audioRef.current = null;
    },
    [src],
  );

  return { available: Boolean(src), status, play, toggle };
}
