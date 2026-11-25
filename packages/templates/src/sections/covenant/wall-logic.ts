import type { GuestbookData, GuestbookPhoto } from "../../types";
import { wishesWithWords } from "./memories-logic";

export type WallTab = "wishes" | "photos";

/** The letter shown in a guest's seal: the first character of the name (whole code point), upper-cased; "♥" when empty. */
export function guestInitial(name: string | undefined | null): string {
  const ch = Array.from((name ?? "").trim())[0];
  return ch ? ch.toLocaleUpperCase() : "♥";
}

export interface WallCounts {
  wishes: number;
  photos: number;
}

/** The photos that can be shown (they have a link). */
export function wallPhotos(data: GuestbookData | undefined): GuestbookPhoto[] {
  return (data?.photos ?? []).filter((p) => !!p.url);
}

export function wallCounts(data: GuestbookData | undefined): WallCounts {
  return { wishes: wishesWithWords(data).length, photos: wallPhotos(data).length };
}

/** `?tab=` is not used: the tab is the route (`/wishes` or `/photos`), so each opens on its own tab. */
export function tabFor(page: string | undefined): WallTab {
  return page === "photos" ? "photos" : "wishes";
}
