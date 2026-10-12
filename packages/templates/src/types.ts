export interface Theme {
  bg_color: string;
  text_color: string;
  accent_color: string;
  font_style: string;
}

export type PartialTheme = Partial<Theme>;

export const SECTION_KEYS = [
  "opening",
  "hero",
  "story",
  "gallery",
  "details",
  "rsvp",
  "registry",
  "timeline",
  "music",
  "guestbook",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export interface CoupleInfo {
  partner1Name: string;
  partner2Name?: string;
  weddingDate?: string;
}

export interface HeroContent {
  coverPhotoUrl?: string;
}

export interface StoryContent {
  loveStory?: string;
}

export interface GalleryContent {
  photos: string[];
}

export interface DetailsContent {
  ceremonyTime?: string;
  ceremonyVenue?: string;
  ceremonyAddress?: string;
  receptionTime?: string;
  receptionVenue?: string;
  receptionAddress?: string;
  dressCode?: string;
}

export interface RsvpContent {
  customMessage?: string;
  deadline?: string;
}

export interface RegistryContent {
  links: { label: string; url: string }[];
}

export interface TimelineContent {
  chapters: { title: string; text: string; year: string }[];
}

export interface MusicContent {
  playlistUrl?: string;
}

export interface OpeningProps {
  couple: CoupleInfo;
  theme: Theme;
  guestGreeting?: string;
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
