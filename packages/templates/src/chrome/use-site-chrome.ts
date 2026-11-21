"use client";

import { useCallback, useMemo, type MouseEvent } from "react";
import { resolveMusicSrc } from "./audio";
import { resolveChrome, type ChromeConfig, type ResolvedChrome } from "./config";
import { useBackgroundMusic, type BackgroundMusic } from "./use-background-music";

export interface UseSiteChromeInput {
  /** The template's chrome config; pass null/undefined to switch everything off. */
  config: ChromeConfig | null | undefined;
  /** Explicit audio URL from the consumer (wins over everything else). */
  musicSrc?: string | null;
  /** The couple's music-section link; only used when it is a direct audio file. */
  musicSectionUrl?: string | null;
}

export interface SiteChromeState {
  resolved: ResolvedChrome | null;
  music: BackgroundMusic;
  /**
   * Put on the opening gate's wrapper as `onClickCapture`. The first tap on a button or link inside
   * the gate starts the music right there, inside the user's tap, which is the only moment mobile
   * browsers allow it (the gate's own open animation runs later, on a timer).
   */
  primeMusicOnTap: (event: MouseEvent) => void;
}

/** Logic for the chrome: normalises the config, picks the music source, owns the music player. No JSX. */
export function useSiteChrome({ config, musicSrc, musicSectionUrl }: UseSiteChromeInput): SiteChromeState {
  const resolved = useMemo(() => resolveChrome(config), [config]);
  const src = useMemo(
    () =>
      resolved?.music
        ? resolveMusicSrc({ override: musicSrc, musicSectionUrl, templateDefault: resolved.music.src })
        : undefined,
    [resolved, musicSrc, musicSectionUrl],
  );
  const music = useBackgroundMusic(src);
  const { play } = music;

  const primeMusicOnTap = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest?.('button, a, [role="button"]')) play();
    },
    [play],
  );

  return { resolved, music, primeMusicOnTap };
}
