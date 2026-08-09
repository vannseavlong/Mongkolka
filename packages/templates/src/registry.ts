import type { ComponentType } from "react";
import type { SectionKey } from "./types";

import { Curtain } from "./sections/opening/Curtain";
import { Door } from "./sections/opening/Door";
import { Book } from "./sections/opening/Book";
import { Envelope } from "./sections/opening/Envelope";
import { HeroClassic } from "./sections/hero/Classic";
import { HeroPolaroid } from "./sections/hero/Polaroid";
import { HeroFullbleed } from "./sections/hero/Fullbleed";
import { StoryClassic } from "./sections/story/Classic";
import { StoryLetter } from "./sections/story/Letter";
import { StorySplit } from "./sections/story/Split";
import { GalleryGrid } from "./sections/gallery/Grid";
import { GalleryMasonry } from "./sections/gallery/Masonry";
import { GalleryCarousel } from "./sections/gallery/Carousel";
import { DetailsClassic } from "./sections/details/Classic";
import { DetailsSplit } from "./sections/details/Split";
import { DetailsCards } from "./sections/details/Cards";
import { RsvpClassic } from "./sections/rsvp/Classic";
import { RsvpCard } from "./sections/rsvp/Card";
import { RsvpMinimal } from "./sections/rsvp/Minimal";
import { RegistryClassic } from "./sections/registry/Classic";
import { RegistryCards } from "./sections/registry/Cards";
import { RegistryList } from "./sections/registry/List";
import { TimelineClassic } from "./sections/timeline/Classic";
import { TimelineVerticalLine } from "./sections/timeline/VerticalLine";
import { TimelineHorizontal } from "./sections/timeline/Horizontal";
import { MusicClassic } from "./sections/music/Classic";
import { MusicPlayerbar } from "./sections/music/Playerbar";
import { MusicMinimal } from "./sections/music/Minimal";

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
  hero: {
    hero_classic: HeroClassic,
    hero_polaroid: HeroPolaroid,
    hero_fullbleed: HeroFullbleed,
  },
  story: {
    story_classic: StoryClassic,
    story_letter: StoryLetter,
    story_split: StorySplit,
  },
  gallery: {
    gallery_grid: GalleryGrid,
    gallery_masonry: GalleryMasonry,
    gallery_carousel: GalleryCarousel,
  },
  details: {
    details_classic: DetailsClassic,
    details_split: DetailsSplit,
    details_cards: DetailsCards,
  },
  rsvp: {
    rsvp_classic: RsvpClassic,
    rsvp_card: RsvpCard,
    rsvp_minimal: RsvpMinimal,
  },
  registry: {
    registry_classic: RegistryClassic,
    registry_cards: RegistryCards,
    registry_list: RegistryList,
  },
  timeline: {
    timeline_classic: TimelineClassic,
    timeline_vertical_line: TimelineVerticalLine,
    timeline_horizontal: TimelineHorizontal,
  },
  music: {
    music_classic: MusicClassic,
    music_playerbar: MusicPlayerbar,
    music_minimal: MusicMinimal,
  },
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
