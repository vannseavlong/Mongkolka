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
import { RegistryKhqr } from "./sections/registry/KhqrGift";
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
import { SkinGallery } from "./sections/skinned/GallerySkin";
import { SkinGuestbook } from "./sections/skinned/GuestbookSkin";
import { StorySkin, DetailsSkin, RsvpSkin, FooterSkin } from "./sections/skinned";
import { KbachGate } from "./sections/kbach/Gate";
import { HeroKbach } from "./sections/kbach/Hero";
import { StoryKbach } from "./sections/kbach/Story";
import { HeroCinematic } from "./sections/hero/Cinematic";
import { HeroEditorial } from "./sections/hero/Editorial";
import { HeroFramed } from "./sections/hero/Framed";
import { HeroGiftBox } from "./sections/hero/GiftBox";
import { HeroEnvelope } from "./sections/hero/Envelope";
import { HeroBook } from "./sections/hero/Book";
import { DetailsKbach } from "./sections/kbach/Details";
import { InvitationKhmer, AgendaKhmer, LettersKhmer, DetailsKhmer } from "./sections/khmer";
import { EmeraldOpening, EmeraldHero } from "./sections/emerald";
import { GardenOpening, GardenHero } from "./sections/garden";
import { CreamOpening, CreamHero } from "./sections/cream";
import { SakuraOpening, SakuraHero } from "./sections/sakura";
import { FairytaleOpening, FairytaleHero, FairytaleGallery } from "./sections/fairytale";
import { CovenantButterflyCover, CovenantGardenCover, CovenantCardOpening, CovenantOpening, CovenantHero, CovenantVerse, CovenantVideo, CovenantMemories, CovenantGallery } from "./sections/covenant";
import { KidsOpening, KidsHero, InvitationKids, AgendaKids, DetailsKids } from "./sections/kids";

// Each section's components take a different, section-specific props shape (see
// sections/*/*.tsx), so this lookup map is necessarily `ComponentType<any>` at the
// registry boundary — the loss of type safety is confined to here; every individual
// component file stays fully typed against its own props interface.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

export const sectionRegistry: Record<SectionKey, Record<string, AnyComponent>> = {
  cover: {
    cover_covenant_butterflies: CovenantButterflyCover,
    cover_covenant_garden: CovenantGardenCover,
  },
  opening: {
    opening_curtain: Curtain,
    opening_door: Door,
    opening_book: Book,
    opening_envelope: Envelope,
    opening_seal: Seal,
    opening_kbach: KbachGate,
    opening_grace: GraceOpening,
    opening_emerald: EmeraldOpening,
    opening_garden: GardenOpening,
    opening_cream: CreamOpening,
    opening_sakura: SakuraOpening,
    opening_fairytale: FairytaleOpening,
    opening_kids: KidsOpening,
    opening_covenant: CovenantOpening,
    opening_card_covenant: CovenantCardOpening,
  },
  hero: {
    hero_classic: HeroClassic,
    hero_polaroid: HeroPolaroid,
    hero_fullbleed: HeroFullbleed,
    hero_cinematic: HeroCinematic,
    hero_editorial: HeroEditorial,
    hero_framed: HeroFramed,
    hero_giftbox: HeroGiftBox,
    hero_envelope: HeroEnvelope,
    hero_book: HeroBook,
    hero_folio: HeroFolio,
    hero_kbach: HeroKbach,
    hero_grace: GraceHero,
    hero_emerald: EmeraldHero,
    hero_garden: GardenHero,
    hero_cream: CreamHero,
    hero_sakura: SakuraHero,
    hero_fairytale: FairytaleHero,
    hero_kids: KidsHero,
    hero_covenant: CovenantHero,
  },
  // Reserved keys: components are registered by the Web-khmer-skeleton task. Until then
  // resolveComponent() finds nothing and SiteRenderer renders nothing for these sections.
  invitation: {
    invitation_khmer: InvitationKhmer,
    invitation_kids: InvitationKids,
  },
  verse: {
    verse_classic: VerseClassic,
    verse_grace: GraceVerse,
    verse_covenant: CovenantVerse,
  },
  story: {
    story_classic: StoryClassic,
    story_letter: StoryLetter,
    story_split: StorySplit,
    story_manuscript: StoryManuscript,
    story_kbach: StoryKbach,
    story_grace: GraceStory,
    story_skin: StorySkin,
  },
  agenda: {
    agenda_khmer: AgendaKhmer,
    agenda_kids: AgendaKids,
  },
  gallery: {
    gallery_fairytale: FairytaleGallery,
    gallery_grid: GalleryGrid,
    gallery_masonry: GalleryMasonry,
    gallery_carousel: GalleryCarousel,
    gallery_plates: GalleryPlates,
    gallery_grace: GraceGallery,
    gallery_skin: SkinGallery,
    gallery_covenant: CovenantGallery,
  },
  video: {
    video_skin: CovenantVideo,
  },
  details: {
    details_classic: DetailsClassic,
    details_split: DetailsSplit,
    details_cards: DetailsCards,
    details_programme: DetailsProgramme,
    details_kbach: DetailsKbach,
    details_grace: GraceDetails,
    details_skin: DetailsSkin,
    details_khmer: DetailsKhmer,
    details_kids: DetailsKids,
  },
  rsvp: {
    rsvp_classic: RsvpClassic,
    rsvp_card: RsvpCard,
    rsvp_minimal: RsvpMinimal,
    rsvp_reply: RsvpReply,
    rsvp_grace: GraceRsvp,
    rsvp_skin: RsvpSkin,
  },
  registry: {
    registry_classic: RegistryClassic,
    registry_cards: RegistryCards,
    registry_list: RegistryList,
    registry_ledger: RegistryLedger,
    registry_khqr: RegistryKhqr,
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
    guestbook_skin: SkinGuestbook,
    guestbook_covenant: CovenantMemories,
  },
  letters: {
    letters_khmer: LettersKhmer,
  },
  footer: {
    footer_classic: FooterClassic,
    footer_grace: GraceFooter,
    footer_skin: FooterSkin,
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
