import type { Language } from "../i18n";

/**
 * The chrome's own labels. Kept local (not in i18n.tsx) so this task does not edit a shared file;
 * the skeleton task may fold these into the main dictionary later. Khmer wording needs a
 * native-speaker review before a template using it is activated.
 */
const STRINGS = {
  en: {
    "dock.label": "Jump to a section",
    "dock.invitation": "Invitation",
    "dock.story": "Story",
    "dock.agenda": "Agenda",
    "dock.map": "Location",
    "dock.gallery": "Gallery",
    "dock.gift": "Gift",
    "dock.wishes": "Wishes",
    "dock.rsvp": "RSVP",
    "music.play": "Play music",
    "music.pause": "Pause music",
    "countdown.days": "Days",
    "countdown.hours": "Hours",
    "countdown.minutes": "Minutes",
    "countdown.seconds": "Seconds",
  },
  kh: {
    "dock.label": "រំកិលទៅផ្នែកផ្សេងៗ",
    "dock.invitation": "សំបុត្រ",
    "dock.story": "រឿង",
    "dock.agenda": "កម្មវិធី",
    "dock.map": "ទីតាំង",
    "dock.gallery": "រូបភាព",
    "dock.gift": "អំណោយ",
    "dock.wishes": "ជូនពរ",
    "dock.rsvp": "ឆ្លើយតប",
    "music.play": "បើកតន្ត្រី",
    "music.pause": "បិទតន្ត្រី",
    "countdown.days": "ថ្ងៃ",
    "countdown.hours": "ម៉ោង",
    "countdown.minutes": "នាទី",
    "countdown.seconds": "វិនាទី",
  },
} as const satisfies Record<Language, Record<string, string>>;

export type ChromeStringKey = keyof (typeof STRINGS)["en"];

export function chromeText(language: Language, key: ChromeStringKey): string {
  return STRINGS[language][key];
}
