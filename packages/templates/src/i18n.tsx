"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Language = "en" | "kh";

/**
 * UI chrome only — section headings, buttons, form labels. Couple-authored free
 * text (love story, details, RSVP custom message, etc.) is written once by the
 * couple and shown as-is regardless of language; building a per-field bilingual
 * content editor is a separate, much larger feature not scoped here.
 */
const dictionary = {
  en: {
    "opening.tapToOpen": "Tap to open",
    "opening.tapToEnter": "Tap to enter",
    "opening.tapToOpenStory": "Tap to open our story",
    "opening.tapTheCard": "Tap the card",
    "opening.dear": "Dear",
    "section.story.heading": "Our Story",
    "section.gallery.heading": "Gallery",
    "section.details.heading": "Event Details",
    "section.details.ceremony": "Ceremony",
    "section.details.reception": "Reception",
    "section.details.dressCode": "Dress code",
    "section.rsvp.heading": "RSVP",
    "section.rsvp.deadlinePrefix": "Please respond by",
    "section.rsvp.namePlaceholder": "Your name",
    "section.rsvp.attending": "Joyfully attending",
    "section.rsvp.declining": "Regretfully declining",
    "section.rsvp.plusOne": "Bringing a plus one",
    "section.rsvp.messagePlaceholder": "Message for the couple (optional)",
    "section.rsvp.submit": "Send RSVP",
    "section.rsvp.submitting": "Sending…",
    "section.rsvp.thankYou": "Thank you for your response!",
    "section.registry.heading": "Registry",
    "section.timeline.heading": "Our Journey",
    "section.music.heading": "Our Playlist",
    "section.music.listenAlong": "Listen along",
    "lang.toggle": "ខ្មែរ",
  },
  kh: {
    "opening.tapToOpen": "ចុចដើម្បីបើក",
    "opening.tapToEnter": "ចុចដើម្បីចូល",
    "opening.tapToOpenStory": "ចុចដើម្បីអានរឿងរបស់យើង",
    "opening.tapTheCard": "ចុចលើកាត",
    "opening.dear": "ជូនចំពោះ",
    "section.story.heading": "រឿងរបស់យើង",
    "section.gallery.heading": "វិចិត្រសាល",
    "section.details.heading": "ព័ត៌មានលម្អិត",
    "section.details.ceremony": "ពិធីមង្គលការ",
    "section.details.reception": "ពិធីជប់លៀង",
    "section.details.dressCode": "ការស្លៀកពាក់",
    "section.rsvp.heading": "បញ្ជាក់ការចូលរួម",
    "section.rsvp.deadlinePrefix": "សូមឆ្លើយតបមុនថ្ងៃ",
    "section.rsvp.namePlaceholder": "ឈ្មោះរបស់អ្នក",
    "section.rsvp.attending": "រីករាយចូលរួម",
    "section.rsvp.declining": "សូមអភ័យទោសមិនអាចចូលរួម",
    "section.rsvp.plusOne": "នាំមិត្តម្នាក់ទៀត",
    "section.rsvp.messagePlaceholder": "សារជូនចំពោះគូរស្នេហ៍ (ស្រេចចិត្ត)",
    "section.rsvp.submit": "ផ្ញើការឆ្លើយតប",
    "section.rsvp.submitting": "កំពុងផ្ញើ…",
    "section.rsvp.thankYou": "សូមអរគុណចំពោះការឆ្លើយតបរបស់អ្នក!",
    "section.registry.heading": "បញ្ជីអំណោយ",
    "section.timeline.heading": "ដំណើររបស់យើង",
    "section.music.heading": "ចម្រៀងរបស់យើង",
    "section.music.listenAlong": "ស្តាប់ជាមួយគ្នា",
    "lang.toggle": "EN",
  },
} as const satisfies Record<Language, Record<string, string>>;

export type TranslationKey = keyof (typeof dictionary)["en"];

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({
  initialLanguage = "en",
  children,
}: {
  initialLanguage?: Language;
  children: ReactNode;
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const t = (key: TranslationKey) => dictionary[language][key];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

export function LanguageToggle({ theme }: { theme?: { text_color?: string } }) {
  const { language, setLanguage, t } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => setLanguage(language === "en" ? "kh" : "en")}
      className="fixed right-4 top-4 z-[60] rounded-full border bg-white/90 px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur"
      style={{ color: theme?.text_color ?? "#111111" }}
    >
      {t("lang.toggle")}
    </button>
  );
}
