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
import { VerseClassic } from "./sections/verse/Classic";
import { FooterClassic } from "./sections/footer/Classic";
import { Seal } from "./sections/ink/Seal";
import { HeroFolio } from "./sections/ink/Folio";
import { StoryManuscript } from "./sections/ink/Manuscript";
import { GalleryPlates } from "./sections/ink/Plates";
import { DetailsProgramme } from "./sections/ink/Programme";
import { RsvpReply } from "./sections/ink/Reply";
import { RegistryLedger } from "./sections/ink/Ledger";
import { TimelineChapters } from "./sections/ink/Chapters";
import { MusicVinyl } from "./sections/ink/Vinyl";
import { GuestbookWall } from "./sections/ink/Guestbook";
import { GraceOpening } from "./sections/grace/Opening";
import { GraceHero } from "./sections/grace/Hero";
import { GraceVerse } from "./sections/grace/Verse";
import { GraceStory } from "./sections/grace/Story";
import { GraceGallery } from "./sections/grace/Gallery";
import { GraceDetails } from "./sections/grace/Details";
import { GraceRsvp } from "./sections/grace/Rsvp";
import { GraceGuestbook } from "./sections/grace/Guestbook";
import { GraceFooter } from "./sections/grace/Footer";
import { KbachGate } from "./sections/kbach/Gate";
import { HeroKbach } from "./sections/kbach/Hero";
import { StoryKbach } from "./sections/kbach/Story";
import { DetailsKbach } from "./sections/kbach/Details";

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
    opening_seal: Seal,
    opening_kbach: KbachGate,
    opening_grace: GraceOpening,
  },
  hero: {
    hero_classic: HeroClassic,
    hero_polaroid: HeroPolaroid,
    hero_fullbleed: HeroFullbleed,
    hero_folio: HeroFolio,
    hero_kbach: HeroKbach,
    hero_grace: GraceHero,
  },
  verse: {
    verse_classic: VerseClassic,
    verse_grace: GraceVerse,
  },
  story: {
    story_classic: StoryClassic,
    story_letter: StoryLetter,
    story_split: StorySplit,
    story_manuscript: StoryManuscript,
    story_kbach: StoryKbach,
    story_grace: GraceStory,
  },
  gallery: {
    gallery_grid: GalleryGrid,
    gallery_masonry: GalleryMasonry,
    gallery_carousel: GalleryCarousel,
    gallery_plates: GalleryPlates,
    gallery_grace: GraceGallery,
  },
  details: {
    details_classic: DetailsClassic,
    details_split: DetailsSplit,
    details_cards: DetailsCards,
    details_programme: DetailsProgramme,
    details_kbach: DetailsKbach,
    details_grace: GraceDetails,
  },
  rsvp: {
    rsvp_classic: RsvpClassic,
    rsvp_card: RsvpCard,
    rsvp_minimal: RsvpMinimal,
    rsvp_reply: RsvpReply,
    rsvp_grace: GraceRsvp,
  },
  registry: {
    registry_classic: RegistryClassic,
    registry_cards: RegistryCards,
    registry_list: RegistryList,
    registry_ledger: RegistryLedger,
  },
  timeline: {
    timeline_classic: TimelineClassic,
    timeline_vertical_line: TimelineVerticalLine,
    timeline_horizontal: TimelineHorizontal,
    timeline_chapters: TimelineChapters,
  },
  music: {
    music_classic: MusicClassic,
    music_playerbar: MusicPlayerbar,
    music_minimal: MusicMinimal,
    music_vinyl: MusicVinyl,
  },
  guestbook: {
    guestbook_wall: GuestbookWall,
    guestbook_grace: GraceGuestbook,
  },
  footer: {
    footer_classic: FooterClassic,
    footer_grace: GraceFooter,
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
