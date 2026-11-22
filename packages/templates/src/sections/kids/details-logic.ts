import type { DetailsContent } from "../../types";
import { safeHttpsUrl } from "../khmer/skin-logic";

/** Pure view-model for the kids location card. The party is the `ceremony*` fields, else `reception*`; both show when both are filled. */

export interface PartyPlace {
  key: "party" | "after";
  time: string;
  venue: string;
  address: string;
}

export interface KidsDetailsView {
  places: PartyPlace[];
  map: string | null;
  image: string | null;
  dress: string;
  isEmpty: boolean;
}

const t = (v?: string) => v?.trim() ?? "";

export function buildKidsDetails(content: DetailsContent | undefined): KidsDetailsView {
  const c = content ?? {};
  const first = { time: t(c.ceremonyTime), venue: t(c.ceremonyVenue), address: t(c.ceremonyAddress) };
  const second = { time: t(c.receptionTime), venue: t(c.receptionVenue), address: t(c.receptionAddress) };
  const has = (p: { time: string; venue: string; address: string }) => Boolean(p.time || p.venue || p.address);
  const places: PartyPlace[] = [];
  if (has(first)) places.push({ key: "party", ...first });
  if (has(second)) places.push({ key: places.length === 0 ? "party" : "after", ...second });
  const map = safeHttpsUrl(c.mapUrl);
  const image = safeHttpsUrl(c.venueImageUrl);
  const dress = t(c.dressCode);
  return { places, map, image, dress, isEmpty: places.length === 0 && !map && !image && !dress };
}
