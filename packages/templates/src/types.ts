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
