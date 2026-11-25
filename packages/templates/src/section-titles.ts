import { defaultText, type Language, type TextOverrides } from "./i18n";
import type { SectionKey } from "./types";

/** A section's own heading, per language, as the couple typed it. */
export interface SectionTitle {
  kh?: string | null;
  en?: string | null;
}

/**
 * The dictionary keys each section's heading comes from, across every template and skin. A couple's title replaces
 * all of them, so it shows whichever template the section is drawn by. Sections without a heading are absent.
 */
export const SECTION_TITLE_KEYS: Partial<Record<SectionKey, readonly string[]>> = {
  story: ["section.story.heading", "grace.story.title"],
  gallery: ["section.gallery.heading", "covenant.gallery.heading", "grace.gallery.heading"],
  details: ["section.details.heading", "grace.details.heading", "khmer.details.heading"],
  rsvp: ["section.rsvp.heading", "grace.rsvp.heading"],
  registry: ["section.registry.heading"],
  timeline: ["section.timeline.heading"],
  music: ["section.music.heading"],
  guestbook: ["guestbook.heading", "grace.guestbook.heading", "covenant.memories.heading"],
  video: ["covenant.video.heading"],
  invitation: ["khmer.invitation.heading"],
  agenda: ["khmer.agenda.heading"],
};

/** True for sections whose heading the couple can change. */
export const hasSectionTitle = (key: SectionKey): boolean => key in SECTION_TITLE_KEYS;

const clean = (v: string | null | undefined): string | undefined => (typeof v === "string" && v.trim() ? v.trim() : undefined);

/** Text overrides for every enabled section that has its own title. */
export function titleOverrides(sections: readonly { section_key: SectionKey; enabled: boolean; title?: SectionTitle | null }[]): TextOverrides {
  const out: TextOverrides = {};
  for (const section of sections) {
    const keys = SECTION_TITLE_KEYS[section.section_key];
    const kh = clean(section.title?.kh);
    const en = clean(section.title?.en);
    if (!keys || !section.enabled || (!kh && !en)) continue;
    for (const key of keys) out[key] = { ...(kh && { kh }), ...(en && { en }) };
  }
  return out;
}

/** The template's own heading for a section in a language (what an empty title falls back to), or "" when unknown. */
export function defaultSectionTitle(key: SectionKey, language: Language): string {
  for (const k of SECTION_TITLE_KEYS[key] ?? []) {
    const text = defaultText(k, language);
    if (text) return text;
  }
  return "";
}
