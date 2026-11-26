export interface Theme {
  bg_color: string;
  text_color: string;
  accent_color: string;
  font_style: string;
}

export type PartialTheme = Partial<Theme>;

export const SECTION_KEYS = [
  "cover",
  "opening",
  "hero",
  "invitation",
  "verse",
  "story",
  "agenda",
  "gallery",
  "video",
  "details",
  "rsvp",
  "registry",
  "timeline",
  "music",
  "guestbook",
  "letters",
  "note",
  "map",
  "footer",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export interface CoupleInfo {
  partner1Name: string;
  partner2Name?: string;
  /** Khmer spelling of each name, for templates that show names in the viewer's language (Covenant). Falls back to partner1Name / partner2Name. */
  partner1NameKh?: string;
  partner2NameKh?: string;
  weddingDate?: string;
}

export interface HeroContent {
  /**
   * The photo to show. SiteRenderer resolves it for the viewer's screen from the portrait and landscape
   * banners below (falling back to the profile cover photo), so every hero just reads this.
   */
  coverPhotoUrl?: string;
  /** Banner for tall screens (phones). */
  portraitUrl?: string;
  /** Banner for wide screens (desktop, tablet on its side). */
  landscapeUrl?: string;
}

export interface StoryContent {
  /** The story in English. Falls back to the couple's profile story. */
  loveStory?: string;
  /** The story in Khmer. */
  loveStoryKh?: string;
}

export interface VerseContent {
  text?: string;
  reference?: string;
  textKh?: string;
  /** Khmer spelling of the reference, e.g. "កូរិនថូសទី១ ១៣:៤-៧". */
  referenceKh?: string;
  /** Optional one-line meaning shown under the reference by templates that support it (Covenant). */
  meaning?: string;
  meaningKh?: string;
}

export interface FooterContent {
  message?: string;
  hashtag?: string;
}

/** One side of a formal Khmer invitation (groom, bride, or the honoured child). Every field is optional. */
export interface InvitationParty {
  nameKh?: string;
  nameEn?: string;
  fatherKh?: string;
  fatherEn?: string;
  motherKh?: string;
  motherEn?: string;
}

/**
 * `invitation` section: formal family invitation, Khmer lunar + solar date and the
 * countdown target. Birthday and house-blessing templates may fill only `groom`
 * (as the honoured person) or neither. Stored in `website_sections.content`.
 */
export interface InvitationContent {
  groom?: InvitationParty;
  bride?: InvitationParty;
  /** Crest text, e.g. "C&C" (max 8 characters). */
  monogram?: string;
  /** Typed by the couple, e.g. "ថ្ងៃពុធ ៣កើត ខែភទ្របទ ឆ្នាំរោង ឆស័ក ព.ស. ២៥៦៨". Never computed. */
  lunarKh?: string;
  /** e.g. "ត្រូវនឹងថ្ងៃទី២៩ ខែឧសភា ឆ្នាំ២០២៦". */
  solarKh?: string;
  /** Countdown target: ISO 8601 with an offset ("2026-05-29T17:00:00+07:00"). Render in Asia/Phnom_Penh. */
  startsAt?: string;
  greetingKh?: string;
  greetingEn?: string;
}

/** Ritual/party icons the agenda can show. A fixed list so templates can ship one line-icon each. */
export const AGENDA_ICONS = [
  "monk",
  "procession",
  "scissors",
  "thread",
  "ring",
  "tea",
  "dinner",
  "party",
  "cake",
] as const;

export type AgendaIcon = (typeof AGENDA_ICONS)[number];

export interface AgendaItem {
  /** Free text as printed on the card, e.g. "07:00" or "ម៉ោង ៧:០០ ព្រឹក" (max 20 characters). */
  time: string;
  titleKh?: string;
  titleEn?: string;
  icon?: AgendaIcon;
}

export interface AgendaDay {
  /** Calendar day, "YYYY-MM-DD". Days are shown in the order stored. */
  date: string;
  items: AgendaItem[];
}

/** `agenda` section: vertical timeline grouped by day (up to 7 days of 20 items). */
export interface AgendaContent {
  days: AgendaDay[];
}

/** `letters` section: the gratitude and apology notes, each in Khmer and English. */
export interface LettersContent {
  gratitudeKh?: string;
  gratitudeEn?: string;
  apologyKh?: string;
  apologyEn?: string;
}

/** `video` section: one YouTube link. Only the 11-character id is ever used, so any youtube.com / youtu.be form works. */
export interface VideoContent {
  url?: string;
  /** Optional caption under the player. */
  title?: string;
}

/** `map` section: the couple's own drawn map picture and an optional caption. The directions button uses the details map link. */
export interface MapContent {
  imageUrl?: string;
  captionKh?: string;
  captionEn?: string;
}

/** `note` section: a short message to guests (for example "no alcohol at this wedding"). Empty fields use the built-in note. */
export interface NoteContent {
  titleKh?: string;
  titleEn?: string;
  bodyKh?: string;
  bodyEn?: string;
}

/** One layout in a stacked gallery: it shows `count` photos (the last block takes the rest). */
export interface GalleryStackBlock {
  layout: string;
  count?: number;
}

export interface GalleryContent {
  photos: string[];
  /** Layouts stacked top to bottom, each with its slice of the photos. Empty or missing: the section's single layout. */
  stack?: GalleryStackBlock[];
  /** How many photos the invitation page shows before "show all" (Covenant galleries; 3 to 24). Empty uses the template's own number. */
  maxPhotos?: number;
}

export interface DetailsContent {
  ceremonyTime?: string;
  ceremonyVenue?: string;
  ceremonyAddress?: string;
  receptionTime?: string;
  receptionVenue?: string;
  receptionAddress?: string;
  dressCode?: string;
  /** https map link for the "view location" button (couple_profile.map_url). */
  mapUrl?: string;
  /** https venue photo (couple_profile.venue_image_url). */
  venueImageUrl?: string;
}

export interface RsvpContent {
  customMessage?: string;
  deadline?: string;
}

export interface RegistryContent {
  links: { label: string; url: string }[];
  /** Gift (KHQR) block, display only: no amounts, nothing is collected. */
  khqrImageUrl?: string;
  /** Where tapping the QR goes: the bank's payment deep link (e.g. an ABA https link). https only. */
  khqrLinkUrl?: string;
  bank?: string;
  accountName?: string;
  /** Digits, spaces and hyphens only (validated server-side). */
  accountNumber?: string;
}

export interface TimelineContent {
  chapters: { title: string; text: string; year: string }[];
}

export interface MusicContent {
  playlistUrl?: string;
}

/** The cover's own wording. Empty or missing fields use the template's built-in text. */
export interface CoverContent {
  taglineKh?: string;
  taglineEn?: string;
}

export interface CoverProps {
  couple: CoupleInfo;
  theme: Theme;
  guestGreeting?: string;
  /** Fires once when the cover starts fading away; the renderer mounts the opening gate beneath at that moment. */
  onReveal: () => void;
  /** Fires once when the cover is fully gone and can be removed. */
  onDone: () => void;
  /** Thumbnail mode (builder style picker): keep playing the scene, never reveal or finish. */
  preview?: boolean;
  /** Couple-written wording (builder form). */
  content?: CoverContent;
}

/**
 * The opening's own wording and event details. Empty or missing fields use the template's built-in text,
 * or (names, date, time, venue) the couple's profile. The cover reads the same names and date.
 */
export interface OpeningContent {
  name1Kh?: string;
  name1En?: string;
  name2Kh?: string;
  name2En?: string;
  /** YYYY-MM-DD */
  date?: string;
  time?: string;
  venue?: string;
  blessingKh?: string;
  blessingEn?: string;
  inviteKh?: string;
  inviteEn?: string;
  titleKh?: string;
  titleEn?: string;
  openKh?: string;
  openEn?: string;
}

export interface OpeningProps {
  couple: CoupleInfo;
  theme: Theme;
  guestGreeting?: string;
  /** Venue and time for openings that print them on the cover (the couple's details content). */
  details?: DetailsContent;
  /** Couple-written wording (builder form); only some openings (Covenant) use it. */
  content?: OpeningContent;
  onOpen: () => void;
}

export interface GuestbookPhoto {
  photo_id: string;
  url: string;
  uploader_name: string | null;
}

export interface GuestbookWish {
  wish_id: string;
  name: string;
  message: string | null;
  photo_id: string | null;
}

export interface GuestbookData {
  photos: GuestbookPhoto[];
  wishes: GuestbookWish[];
}

export interface GuestbookSubmission {
  name: string;
  message?: string;
  /** The picked image; the consuming app resizes/uploads it (packages/templates never calls fetch). */
  photo?: File;
  /** Guest-reported gift — never authoritative, the couple confirms it. */
  gift?: { amount: number; currency: "USD" | "KHR" };
}

export interface GuestbookResult {
  /** `pending` = the couple reviews it first; `approved` = it's on the wall already. */
  status: "pending" | "approved";
}

/** Facts the guestbook's "meaningful actions" (directions, calendar, share) are built from. */
export interface GuestbookActions {
  mapsUrl?: string;
  calendar?: { title: string; start: string; location?: string; description?: string };
  shareUrl?: string;
}
