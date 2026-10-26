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
    "kbach.honour": "Request the honour of your presence",
    "kbach.open": "Open the invitation",
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
    "ink.breakSeal": "Break the seal",
    "ink.saveTheDate": "Save the date",
    "ink.together": "Together with their families",
    "ink.plate": "Plate",
    "ink.programme": "Order of the day",
    "ink.replyCard": "The favour of a reply",
    "ink.nowPlaying": "Now playing",
    "ink.chapter": "Chapter",
    "ink.scroll": "Scroll",
    "ink.visit": "Visit",
    "ink.invitedGuest": "A special invitation for",
    "guestbook.eyebrow": "Guestbook",
    "guestbook.heading": "Leave us a wish",
    "guestbook.subheading": "A few words, a photo, a memory — we'll keep every one.",
    "guestbook.yourName": "Your name",
    "guestbook.message": "Your wish for the couple",
    "guestbook.addPhoto": "Add a photo",
    "guestbook.changePhoto": "Change photo",
    "guestbook.removePhoto": "Remove",
    "guestbook.gift": "I'm sending a gift",
    "guestbook.giftAmount": "Amount",
    "guestbook.giftNote": "This just lets the couple know — it isn't a payment.",
    "guestbook.submit": "Send my wish",
    "guestbook.sending": "Sending…",
    "guestbook.thanksTitle": "Thank you",
    "guestbook.thanksPending": "The couple will review it before it appears on the wall.",
    "guestbook.thanksApproved": "It's on the wall now.",
    "guestbook.another": "Leave another",
    "guestbook.error": "Something went wrong — please try again.",
    "guestbook.tooBig": "That photo is too large.",
    "guestbook.wall": "Wishes & memories",
    "guestbook.empty": "Be the first to leave a wish.",
    "guestbook.actionsHeading": "Be part of the day",
    "guestbook.directions": "Get directions",
    "guestbook.calendar": "Add to calendar",
    "guestbook.share": "Share the invitation",
    "guestbook.copied": "Link copied",
    "lang.toggle": "ខ្មែរ",
  },
  kh: {
    "opening.tapToOpen": "ចុចដើម្បីបើក",
    "opening.tapToEnter": "ចុចដើម្បីចូល",
    "opening.tapToOpenStory": "ចុចដើម្បីអានរឿងរបស់យើង",
    "opening.tapTheCard": "ចុចលើកាត",
    "opening.dear": "ជូនចំពោះ",
    "kbach.honour": "សូមគោរពអញ្ជើញចូលរួមពិធីមង្គលការ",
    "kbach.open": "បើកការអញ្ជើញ",
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
    "ink.breakSeal": "បំបែកត្រាបិទ",
    "ink.saveTheDate": "រក្សាទុកថ្ងៃនេះ",
    "ink.together": "ជាមួយក្រុមគ្រួសារទាំងសងខាង",
    "ink.plate": "ផ្ទាំងទី",
    "ink.programme": "កម្មវិធីនៃថ្ងៃ",
    "ink.replyCard": "សូមមេត្តាឆ្លើយតប",
    "ink.nowPlaying": "កំពុងចាក់",
    "ink.chapter": "ជំពូកទី",
    "ink.scroll": "រំកិលចុះ",
    "ink.visit": "ចូលមើល",
    "ink.invitedGuest": "ការអញ្ជើញពិសេសសម្រាប់",
    "guestbook.eyebrow": "សៀវភៅអនុស្សាវរីយ៍",
    "guestbook.heading": "ផ្ញើពាក្យជូនពរមកយើង",
    "guestbook.subheading": "ពាក្យពីរបីម៉ាត់ រូបថតមួយសន្លឹក ការចងចាំមួយ — យើងនឹងរក្សាទុកទាំងអស់។",
    "guestbook.yourName": "ឈ្មោះរបស់អ្នក",
    "guestbook.message": "ពាក្យជូនពរសម្រាប់គូស្វាមីភរិយា",
    "guestbook.addPhoto": "បន្ថែមរូបថត",
    "guestbook.changePhoto": "ប្តូររូបថត",
    "guestbook.removePhoto": "លុប",
    "guestbook.gift": "ខ្ញុំនឹងផ្ញើជំនូន",
    "guestbook.giftAmount": "ចំនួនទឹកប្រាក់",
    "guestbook.giftNote": "នេះគ្រាន់តែជាការជូនដំណឹងដល់គូស្វាមីភរិយា — មិនមែនជាការទូទាត់ទេ។",
    "guestbook.submit": "ផ្ញើពាក្យជូនពរ",
    "guestbook.sending": "កំពុងផ្ញើ…",
    "guestbook.thanksTitle": "សូមអរគុណ",
    "guestbook.thanksPending": "គូស្វាមីភរិយានឹងពិនិត្យមុនពេលបង្ហាញលើជញ្ជាំង។",
    "guestbook.thanksApproved": "បានបង្ហាញលើជញ្ជាំងហើយ។",
    "guestbook.another": "ផ្ញើបន្ថែម",
    "guestbook.error": "មានបញ្ហា — សូមព្យាយាមម្តងទៀត។",
    "guestbook.tooBig": "រូបថតនេះធំពេក។",
    "guestbook.wall": "ពាក្យជូនពរ និងការចងចាំ",
    "guestbook.empty": "សូមក្លាយជាអ្នកដំបូងដែលផ្ញើពាក្យជូនពរ។",
    "guestbook.actionsHeading": "ចូលរួមក្នុងថ្ងៃពិសេស",
    "guestbook.directions": "មើលផ្លូវ",
    "guestbook.calendar": "បន្ថែមក្នុងប្រតិទិន",
    "guestbook.share": "ចែករំលែកធៀបការ",
    "guestbook.copied": "បានចម្លងតំណ",
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
