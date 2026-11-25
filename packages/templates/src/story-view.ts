import type { StoryContent } from "./types";

type Language = "en" | "kh";

const clean = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const asObject = (v: unknown): StoryContent => (v && typeof v === "object" && !Array.isArray(v) ? (v as StoryContent) : {});

/**
 * The story as the viewer reads it. The section's own text (Khmer and English) comes first and the couple's profile
 * story is the English fallback; a language left empty shows the other one. Every story style just reads `loveStory`.
 */
export function storyContentFor(derived: unknown, stored: unknown, language: Language): StoryContent {
  const merged = { ...asObject(derived), ...asObject(stored) };
  const en = clean(merged.loveStory);
  const kh = clean(merged.loveStoryKh);
  return { loveStory: (language === "kh" ? kh || en : en || kh) || undefined };
}
