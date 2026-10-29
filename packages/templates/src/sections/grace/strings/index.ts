import { strings as opening } from "./opening";
import { strings as hero } from "./hero";
import { strings as verse } from "./verse";
import { strings as story } from "./story";
import { strings as gallery } from "./gallery";
import { strings as details } from "./details";
import { strings as guestbook } from "./guestbook";
import { strings as rsvp } from "./rsvp";
import { strings as footer } from "./footer";

declare const process: { env: { NODE_ENV?: string } };

const ALL = [opening, hero, verse, story, gallery, details, guestbook, rsvp, footer];

/** Merged Grace strings per language. Keys must be unique across section files (prefix with the section). */
function merge(parts: Record<string, string>[], label: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of parts) {
    for (const [k, v] of Object.entries(part)) {
      if (process.env.NODE_ENV !== "production" && k in out) console.warn(`[grace strings] duplicate ${label} key: ${k}`);
      out[k] = v;
    }
  }
  return out;
}

export const GRACE_EN = merge(ALL.map((s) => s.en), "en");
export const GRACE_KH = merge(ALL.map((s) => s.kh), "kh");
