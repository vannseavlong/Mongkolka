/** Pure YouTube link handling. Only an 11-character video id ever reaches an iframe or image URL. */

const ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * The video id from a YouTube link, or null. Accepts watch?v=, youtu.be/, /embed/, /shorts/, /live/ and /v/ links
 * on youtube.com, m.youtube.com, music.youtube.com, youtube-nocookie.com and youtu.be; anything else is rejected.
 */
export function youtubeId(url: string | undefined | null): string | null {
  const raw = (url ?? "").trim();
  if (!raw) return null;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  const host = u.hostname.toLowerCase().replace(/^www\./, "");
  let id: string | null = null;
  if (host === "youtu.be") {
    id = u.pathname.split("/")[1] ?? null;
  } else if (["youtube.com", "m.youtube.com", "music.youtube.com", "youtube-nocookie.com"].includes(host)) {
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts[0] === "watch") id = u.searchParams.get("v");
    else if (["embed", "shorts", "live", "v"].includes(parts[0] ?? "")) id = parts[1] ?? null;
  }
  return id && ID.test(id) ? id : null;
}

export const YOUTUBE_PLAYER_ORIGIN = "https://www.youtube-nocookie.com";
/** `muted` is required for a video that starts by itself: browsers refuse to autoplay with sound. */
export const youtubeEmbedUrl = (id: string, muted = false): string => `${YOUTUBE_PLAYER_ORIGIN}/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1${muted ? "&mute=1" : ""}`;
/** The postMessage body the embedded player understands (needs enablejsapi=1). */
export const youtubeCommand = (func: "playVideo" | "pauseVideo"): string => JSON.stringify({ event: "command", func, args: [] });

/** Share of the player that must be on screen before it starts. */
export const AUTOPLAY_RATIO = 0.6;
export type ScrollAction = "start" | "pause" | "resume" | null;

/**
 * What scrolling does to the player. It starts once, pauses when fully off screen, and resumes only what scrolling
 * itself paused, so a video the guest paused by hand stays paused.
 */
export function scrollAction(ratio: number, started: boolean, pausedByScroll: boolean): ScrollAction {
  if (ratio >= AUTOPLAY_RATIO) return !started ? "start" : pausedByScroll ? "resume" : null;
  return ratio <= 0 && started && !pausedByScroll ? "pause" : null;
}
export const youtubeThumbUrl = (id: string): string => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const youtubeWatchUrl = (id: string): string => `https://www.youtube.com/watch?v=${id}`;
