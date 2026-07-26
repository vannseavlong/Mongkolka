import type { ComponentType } from "react";
import type { SectionKey } from "./types";

import { Curtain } from "./sections/opening/Curtain";
import { Door } from "./sections/opening/Door";
import { Book } from "./sections/opening/Book";
import { Envelope } from "./sections/opening/Envelope";
import { HeroClassic } from "./sections/hero/Classic";
import { StoryClassic } from "./sections/story/Classic";
import { GalleryGrid } from "./sections/gallery/Grid";
import { DetailsClassic } from "./sections/details/Classic";
import { RsvpClassic } from "./sections/rsvp/Classic";
import { RegistryClassic } from "./sections/registry/Classic";
import { TimelineClassic } from "./sections/timeline/Classic";
import { MusicClassic } from "./sections/music/Classic";

// Each section's components take a different, section-specific props shape (see
// sections/*/*.tsx), so this lookup map is necessarily `ComponentType<any>` at the
// registry boundary — the loss of type safety is confined to here; every individual
// component file stays fully typed against its own props interface.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

export const sectionRegistry: Record<SectionKey, Record<string, AnyComponent>> = {
  opening: {
    opening_curtain: Curtain,
    opening_door: Door,
    opening_book: Book,
    opening_envelope: Envelope,
  },
  hero: { hero_classic: HeroClassic },
  story: { story_classic: StoryClassic },
  gallery: { gallery_grid: GalleryGrid },
  details: { details_classic: DetailsClassic },
  rsvp: { rsvp_classic: RsvpClassic },
  registry: { registry_classic: RegistryClassic },
  timeline: { timeline_classic: TimelineClassic },
  music: { music_classic: MusicClassic },
};

/**
 * Resolves which component to render for a section: the couple's explicit pick,
 * falling back to the site template's default, falling back to whatever's first
 * registered for that section — a public wedding site should never hard-crash
 * because a catalog row was retired or a component_id was mistyped.
 */
export function resolveComponent(
  section: SectionKey,
  componentId: string | undefined | null,
  templateDefaultId: string | undefined,
): AnyComponent | undefined {
  const bySection = sectionRegistry[section];
  if (componentId && bySection[componentId]) return bySection[componentId];
  if (templateDefaultId && bySection[templateDefaultId]) return bySection[templateDefaultId];
  return Object.values(bySection)[0];
}
