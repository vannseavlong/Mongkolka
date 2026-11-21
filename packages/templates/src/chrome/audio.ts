/** Pure pieces of the background-music feature: URL check, source priority, play-state machine. */

const AUDIO_EXT = /\.(mp3|m4a|aac|ogg|oga|opus|wav|weba)$/i;

/**
 * True only for a direct link to an audio FILE the browser can play in an <audio> element
 * (https or site-relative). Spotify, YouTube and other page links are not playable that way and
 * stay as links in the music section.
 */
export function isDirectAudioUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  const trimmed = url.trim();
  if (!/^(https:\/\/|\/(?!\/))/i.test(trimmed)) return false;
  const path = trimmed.split(/[?#]/)[0] ?? "";
  return AUDIO_EXT.test(path);
}

/** Priority: explicit prop > the couple's own direct-audio link in the music section > template default. */
export function resolveMusicSrc(input: {
  override?: string | null;
  musicSectionUrl?: string | null;
  templateDefault?: string | null;
}): string | undefined {
  for (const candidate of [input.override, input.musicSectionUrl, input.templateDefault]) {
    if (isDirectAudioUrl(candidate)) return candidate.trim();
  }
  return undefined;
}

/**
 * idle: never started. playing / paused: user-visible states. blocked: the browser refused
 * play() (autoplay policy), so the toggle should invite a tap.
 */
export type MusicStatus = "idle" | "playing" | "paused" | "blocked";
export type MusicEvent = "started" | "blocked" | "paused" | "reset";

export function musicReducer(state: MusicStatus, event: MusicEvent): MusicStatus {
  switch (event) {
    case "started":
      return "playing";
    case "paused":
      return "paused";
    case "reset":
      // The audio element was discarded (new source): nothing is playing any more.
      return "idle";
    case "blocked":
      // A refusal after the user already paused must not flip the toggle back to a "hint" state.
      return state === "paused" ? state : "blocked";
  }
}

/** What a tap on the toggle should do next. */
export function toggleIntent(status: MusicStatus): "play" | "pause" {
  return status === "playing" ? "pause" : "play";
}

interface ClosestTarget {
  closest?: (selector: string) => ClosestTarget | null;
}

/**
 * Whether a tap inside the opening gate should start the music. Openings that mark their primary
 * action with `data-mk-open` prime only from it; otherwise any button or link counts, except ones
 * marked `data-mk-no-music` (a language switch, a help link). Pure so it is testable without a DOM.
 */
export function shouldPrimeMusic(target: ClosestTarget | null | undefined): boolean {
  const closest = target?.closest?.bind(target);
  if (!closest) return false;
  if (closest("[data-mk-no-music]")) return false;
  return Boolean(closest("[data-mk-open]") ?? closest('button, a, [role="button"]'));
}
