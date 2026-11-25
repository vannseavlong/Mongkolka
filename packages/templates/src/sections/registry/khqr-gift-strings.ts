import type { Language } from "../../i18n";

/**
 * Local to this component so it edits no shared dictionary (the skeleton task may fold these in).
 * Khmer wording needs a native-speaker review before a template using it is activated.
 */
const STRINGS = {
  en: {
    heading: "Wedding Gift",
    scan: "Scan to send your gift",
    tapToPay: "Tap the QR to open your bank app",
    bank: "Bank",
    accountName: "Account name",
    accountNumber: "Account number",
    copy: "Copy account number",
    copied: "Copied",
    copiedToast: "Account number copied",
    failedToast: "Could not copy. Please copy it by hand.",
    qrAlt: "KHQR code for the gift",
  },
  kh: {
    heading: "អំណោយចំណងដៃ",
    scan: "ស្កេនដើម្បីផ្ញើអំណោយ",
    tapToPay: "ចុចលើ QR ដើម្បីបើកកម្មវិធីធនាគារ",
    bank: "ធនាគារ",
    accountName: "ឈ្មោះគណនី",
    accountNumber: "លេខគណនី",
    copy: "ចុចដើម្បីចម្លងលេខកុង",
    copied: "បានចម្លង",
    copiedToast: "បានចម្លងលេខគណនី",
    failedToast: "មិនអាចចម្លងបានទេ សូមចម្លងដោយដៃ",
    qrAlt: "កូដ KHQR សម្រាប់អំណោយ",
  },
} as const;

export type GiftStringKey = keyof (typeof STRINGS)["en"];

export function giftText(lang: Language, key: GiftStringKey): string {
  return STRINGS[lang][key];
}
