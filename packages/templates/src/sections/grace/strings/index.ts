import { strings as opening } from "./opening";
import { strings as hero } from "./hero";
import { strings as verse } from "./verse";
import { strings as story } from "./story";
import { strings as gallery } from "./gallery";
import { strings as details } from "./details";
import { strings as guestbook } from "./guestbook";
import { strings as rsvp } from "./rsvp";
import { strings as footer } from "./footer";

const ALL = [opening, hero, verse, story, gallery, details, guestbook, rsvp, footer];

/** Merged Grace strings per language. Keys must be unique across section files (prefix with the section). */
export const GRACE_EN: Record<string, string> = Object.assign({}, ...ALL.map((s) => s.en));
export const GRACE_KH: Record<string, string> = Object.assign({}, ...ALL.map((s) => s.kh));
