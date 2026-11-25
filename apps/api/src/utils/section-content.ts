// Server-side shape + limit checks for the Khmer section contents (invitation, agenda,
// letters) and for the new details profile URLs. The client is never trusted: the couple
// editor mirrors these limits for UX only. Shapes mirror InvitationContent, AgendaContent
// and LettersContent in packages/templates/src/types.ts (the API does not import the
// React package; tests/khmer-section-content.test.ts guards the icon list).

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

export const LIMITS = {
  name: 120,
  monogram: 8,
  dateLine: 200,
  greeting: 600,
  letter: 3000,
  agendaDays: 7,
  agendaItemsPerDay: 20,
  agendaTime: 20,
  agendaTitle: 120,
  url: 2000,
  bank: 80,
  accountName: 120,
  accountNumber: 34,
  registryLinks: 20,
  linkLabel: 80,
  videoTitle: 120,
  coverTagline: 120,
  storyText: 5000,
  verseText: 600,
  verseReference: 60,
  verseMeaning: 200,
  openingBlessing: 200,
  openingTime: 40,
  openingVenue: 160,
  openingLine: 120,
  openingTitle: 60,
  openingButton: 60,
  mapCaption: 200,
  noteTitle: 80,
  noteBody: 600,
} as const;

type Obj = Record<string, unknown>;

function asObject(value: unknown, path: string): Obj {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
  return value as Obj;
}

/** Optional trimmed string; empty/undefined/null drop the field. */
function optString(source: Obj, key: string, max: number, path: string): string | undefined {
  const value = source[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") throw new Error(`${path}.${key} must be a string`);
  const trimmed = value.trim();
  if (trimmed.length > max) throw new Error(`${path}.${key} must be at most ${max} characters`);
  return trimmed === "" ? undefined : trimmed;
}

function compact<T extends Obj>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

/** https URL only (blocks javascript:, data:, http:). Returns the trimmed URL or undefined when empty. */
export function validateHttpsUrl(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") throw new Error(`${field} must be a string`);
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  if (trimmed.length > LIMITS.url) throw new Error(`${field} must be at most ${LIMITS.url} characters`);
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error(`${field} must be a valid https URL`);
  }
  if (url.protocol !== "https:") throw new Error(`${field} must start with https://`);
  if (url.username !== "" || url.password !== "") throw new Error(`${field} must not contain credentials`);
  // url.href is the normalised form: control characters and odd spellings do not survive.
  return url.href;
}

const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

/** ISO 8601 date-time that carries an offset ("...+07:00" or "Z"), so the countdown is timezone-safe. */
export function validateStartsAt(value: unknown, path: string): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") throw new Error(`${path} must be a string`);
  const trimmed = value.trim();
  if (!ISO_WITH_OFFSET.test(trimmed) || Number.isNaN(Date.parse(trimmed)) || !isRealDateTime(trimmed)) {
    throw new Error(`${path} must be an ISO 8601 date-time with an offset, e.g. 2026-05-29T17:00:00+07:00`);
  }
  return trimmed;
}

/** Date.parse rolls 2026-02-31 over to March and accepts T24:00, so check each part by hand. */
function isRealDateTime(iso: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d{1,3})?(?:Z|[+-](\d{2}):(\d{2}))$/.exec(iso);
  if (!m) return false;
  const [y, mo, d, h, mi] = [m[1], m[2], m[3], m[4], m[5]].map(Number) as [number, number, number, number, number];
  const sec = m[6] === undefined ? 0 : Number(m[6]);
  const day = new Date(Date.UTC(y, mo - 1, d));
  if (day.getUTCFullYear() !== y || day.getUTCMonth() !== mo - 1 || day.getUTCDate() !== d) return false;
  if (h > 23 || mi > 59 || sec > 59) return false;
  if (m[7] !== undefined && (Number(m[7]) > 23 || Number(m[8]) > 59)) return false;
  return true;
}

function validateDay(value: string, path: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`${path} must be YYYY-MM-DD`);
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`${path} is not a real calendar date`);
  }
  return value;
}

function cleanParty(value: unknown, path: string): Obj | undefined {
  if (value === undefined || value === null) return undefined;
  const party = asObject(value, path);
  const out = compact({
    nameKh: optString(party, "nameKh", LIMITS.name, path),
    nameEn: optString(party, "nameEn", LIMITS.name, path),
    fatherKh: optString(party, "fatherKh", LIMITS.name, path),
    fatherEn: optString(party, "fatherEn", LIMITS.name, path),
    motherKh: optString(party, "motherKh", LIMITS.name, path),
    motherEn: optString(party, "motherEn", LIMITS.name, path),
  });
  return Object.keys(out).length > 0 ? out : undefined;
}

function cleanInvitation(content: Obj): Obj {
  return compact({
    groom: cleanParty(content.groom, "groom"),
    bride: cleanParty(content.bride, "bride"),
    monogram: optString(content, "monogram", LIMITS.monogram, "content"),
    lunarKh: optString(content, "lunarKh", LIMITS.dateLine, "content"),
    solarKh: optString(content, "solarKh", LIMITS.dateLine, "content"),
    startsAt: validateStartsAt(content.startsAt, "startsAt"),
    greetingKh: optString(content, "greetingKh", LIMITS.greeting, "content"),
    greetingEn: optString(content, "greetingEn", LIMITS.greeting, "content"),
  });
}

function cleanAgenda(content: Obj): Obj {
  const days = content.days ?? [];
  if (!Array.isArray(days)) throw new Error("days must be an array");
  if (days.length > LIMITS.agendaDays) throw new Error(`days must have at most ${LIMITS.agendaDays} entries`);
  const seenDates = new Set<string>();
  return {
    days: days.map((rawDay, d) => {
      const dayPath = `days[${d}]`;
      const day = asObject(rawDay, dayPath);
      if (typeof day.date !== "string") throw new Error(`${dayPath}.date must be a string`);
      const items = day.items ?? [];
      if (!Array.isArray(items)) throw new Error(`${dayPath}.items must be an array`);
      if (items.length > LIMITS.agendaItemsPerDay) {
        throw new Error(`${dayPath}.items must have at most ${LIMITS.agendaItemsPerDay} entries`);
      }
      const date = validateDay(day.date.trim(), `${dayPath}.date`);
      // One entry per date: the page keys days by date, and two blocks for one day make no sense.
      if (seenDates.has(date)) throw new Error(`${dayPath}.date ${date} is listed twice`);
      seenDates.add(date);
      return {
        date,
        items: items.map((rawItem, i) => {
          const itemPath = `${dayPath}.items[${i}]`;
          const item = asObject(rawItem, itemPath);
          const time = optString(item, "time", LIMITS.agendaTime, itemPath);
          if (!time) throw new Error(`${itemPath}.time is required`);
          const icon = item.icon;
          if (icon !== undefined && icon !== null && icon !== "") {
            if (typeof icon !== "string" || !(AGENDA_ICONS as readonly string[]).includes(icon)) {
              throw new Error(`${itemPath}.icon must be one of ${AGENDA_ICONS.join(", ")}`);
            }
          }
          return compact({
            time,
            titleKh: optString(item, "titleKh", LIMITS.agendaTitle, itemPath),
            titleEn: optString(item, "titleEn", LIMITS.agendaTitle, itemPath),
            icon: typeof icon === "string" && icon !== "" ? icon : undefined,
          });
        }),
      };
    }),
  };
}

function cleanLetters(content: Obj): Obj {
  return compact({
    gratitudeKh: optString(content, "gratitudeKh", LIMITS.letter, "content"),
    gratitudeEn: optString(content, "gratitudeEn", LIMITS.letter, "content"),
    apologyKh: optString(content, "apologyKh", LIMITS.letter, "content"),
    apologyEn: optString(content, "apologyEn", LIMITS.letter, "content"),
  });
}

/** Account numbers: digits, spaces and hyphens only (covers IBAN-free Cambodian bank numbers and phone-style wallets). */
const ACCOUNT_NUMBER = /^[0-9][0-9 -]*$/;

/** Registry links: {label, url}; https only, capped. Entries with neither a label nor a url are dropped. */
function cleanLinks(value: unknown): Obj[] | undefined {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value)) throw new Error("links must be an array");
  if (value.length > LIMITS.registryLinks) throw new Error(`links must have at most ${LIMITS.registryLinks} entries`);
  return value.flatMap((raw, i) => {
    const path = `links[${i}]`;
    const link = asObject(raw, path);
    const label = optString(link, "label", LIMITS.linkLabel, path);
    const url = validateHttpsUrl(link.url, `${path}.url`);
    if (!label && !url) return [];
    if (!url) throw new Error(`${path}.url is required`);
    return [{ label: label ?? url, url }];
  });
}

/**
 * Registry content: the gift fields (KHQR image, bank, account name, account number) and `links`
 * are validated. Display data only: no amounts, nothing is collected or processed.
 */
function cleanRegistry(content: Obj): Obj {
  const accountNumber = optString(content, "accountNumber", LIMITS.accountNumber, "content");
  if (accountNumber !== undefined && !ACCOUNT_NUMBER.test(accountNumber)) {
    throw new Error("content.accountNumber may contain only digits, spaces and hyphens");
  }
  return compact({
    links: cleanLinks(content.links),
    khqrImageUrl: validateImageUrl(content.khqrImageUrl, "khqrImageUrl"),
    khqrLinkUrl: validateHttpsUrl(content.khqrLinkUrl, "khqrLinkUrl"),
    bank: optString(content, "bank", LIMITS.bank, "content"),
    accountName: optString(content, "accountName", LIMITS.accountName, "content"),
    accountNumber,
  });
}

const YOUTUBE_HOSTS = new Set(["youtube.com", "m.youtube.com", "music.youtube.com", "youtube-nocookie.com", "youtu.be"]);
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** True for a youtube.com / youtu.be link that carries an 11-character video id (mirrors youtubeId in the templates package). */
export function isYoutubeUrl(value: string): boolean {
  let u: URL;
  try {
    u = new URL(value);
  } catch {
    return false;
  }
  if (u.protocol !== "https:") return false;
  const host = u.hostname.toLowerCase().replace(/^www\./, "");
  if (!YOUTUBE_HOSTS.has(host)) return false;
  const parts = u.pathname.split("/").filter(Boolean);
  const id = host === "youtu.be" ? parts[0] : parts[0] === "watch" ? u.searchParams.get("v") : ["embed", "shorts", "live", "v"].includes(parts[0] ?? "") ? parts[1] : undefined;
  return !!id && YOUTUBE_ID.test(id);
}

/** `video` section: one YouTube link (https, YouTube hosts only, with a real video id) and an optional caption. */
function cleanVideo(content: Obj): Obj {
  const url = optString(content, "url", LIMITS.url, "content");
  if (url !== undefined && !isYoutubeUrl(url)) throw new Error("content.url must be a YouTube video link (https)");
  return compact({ url, title: optString(content, "title", LIMITS.videoTitle, "content") });
}

/** The opening's wording and event details. Empty fields fall back to the template's text or the profile. */
/** A calendar date as YYYY-MM-DD, or undefined when empty. Rejects impossible dates such as 2027-02-31. */
function optDate(source: Obj, key: string, path: string): string | undefined {
  const value = optString(source, key, 10, path);
  if (value === undefined) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = match ? new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))) : null;
  if (!match || !date || date.getUTCFullYear() !== Number(match[1]) || date.getUTCMonth() !== Number(match[2]) - 1 || date.getUTCDate() !== Number(match[3])) {
    throw new Error(`${path}.${key} must be a date as YYYY-MM-DD`);
  }
  return value;
}

function cleanOpening(content: Obj): Obj {
  return compact({
    name1Kh: optString(content, "name1Kh", LIMITS.name, "content"),
    name1En: optString(content, "name1En", LIMITS.name, "content"),
    name2Kh: optString(content, "name2Kh", LIMITS.name, "content"),
    name2En: optString(content, "name2En", LIMITS.name, "content"),
    date: optDate(content, "date", "content"),
    time: optString(content, "time", LIMITS.openingTime, "content"),
    venue: optString(content, "venue", LIMITS.openingVenue, "content"),
    blessingKh: optString(content, "blessingKh", LIMITS.openingBlessing, "content"),
    blessingEn: optString(content, "blessingEn", LIMITS.openingBlessing, "content"),
    inviteKh: optString(content, "inviteKh", LIMITS.openingLine, "content"),
    inviteEn: optString(content, "inviteEn", LIMITS.openingLine, "content"),
    titleKh: optString(content, "titleKh", LIMITS.openingTitle, "content"),
    titleEn: optString(content, "titleEn", LIMITS.openingTitle, "content"),
    openKh: optString(content, "openKh", LIMITS.openingButton, "content"),
    openEn: optString(content, "openEn", LIMITS.openingButton, "content"),
  });
}

/** An image link: http or https only (blocks javascript:, data:). http is allowed because local dev storage serves over http. */
export function validateImageUrl(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") throw new Error(`${field} must be a string`);
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  if (trimmed.length > LIMITS.url) throw new Error(`${field} must be at most ${LIMITS.url} characters`);
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error(`${field} must be a valid image URL`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error(`${field} must start with https://`);
  return trimmed;
}

/** The hero's own banners: one for tall screens, one for wide. The profile cover photo stays the fallback. */
function cleanHero(content: Obj): Obj {
  return compact({
    portraitUrl: validateImageUrl(content.portraitUrl, "content.portraitUrl"),
    landscapeUrl: validateImageUrl(content.landscapeUrl, "content.landscapeUrl"),
  });
}

/** The love story in both languages. */
function cleanStory(content: Obj): Obj {
  return compact({
    loveStory: optString(content, "loveStory", LIMITS.storyText, "content"),
    loveStoryKh: optString(content, "loveStoryKh", LIMITS.storyText, "content"),
  });
}

/** The verse in both languages: text, reference and an optional one-line meaning each. */
function cleanVerse(content: Obj): Obj {
  return compact({
    text: optString(content, "text", LIMITS.verseText, "content"),
    textKh: optString(content, "textKh", LIMITS.verseText, "content"),
    reference: optString(content, "reference", LIMITS.verseReference, "content"),
    referenceKh: optString(content, "referenceKh", LIMITS.verseReference, "content"),
    meaning: optString(content, "meaning", LIMITS.verseMeaning, "content"),
    meaningKh: optString(content, "meaningKh", LIMITS.verseMeaning, "content"),
  });
}

/** `map` section: the couple's own map picture (image URL, same rules as every uploaded image) and a short caption per language. */
function cleanMap(content: Obj): Obj {
  return compact({
    imageUrl: validateImageUrl(content.imageUrl, "content.imageUrl"),
    captionKh: optString(content, "captionKh", LIMITS.mapCaption, "content"),
    captionEn: optString(content, "captionEn", LIMITS.mapCaption, "content"),
  });
}

/** `note` section: a short message to guests (title and body per language). Empty fields fall back to the built-in note. */
function cleanNote(content: Obj): Obj {
  return compact({
    titleKh: optString(content, "titleKh", LIMITS.noteTitle, "content"),
    titleEn: optString(content, "titleEn", LIMITS.noteTitle, "content"),
    bodyKh: optString(content, "bodyKh", LIMITS.noteBody, "content"),
    bodyEn: optString(content, "bodyEn", LIMITS.noteBody, "content"),
  });
}

/** The cover's wording: one line per language. Empty fields fall back to the template's own line. */
function cleanCover(content: Obj): Obj {
  return compact({
    taglineKh: optString(content, "taglineKh", LIMITS.coverTagline, "content"),
    taglineEn: optString(content, "taglineEn", LIMITS.coverTagline, "content"),
  });
}

export const OPENING_CONTENT_SECTION = "opening";

export const KHMER_CONTENT_SECTIONS = ["invitation", "agenda", "letters", "registry", "video", "map", "note"] as const;

/**
 * Validates and cleans `website_sections.content` for the Khmer sections. Returns the
 * cleaned object (unknown keys dropped, strings trimmed). Throws `Error` with a message
 * the controller maps to a 400. Sections it does not own are returned untouched, so
 * existing sections keep their current (unvalidated) behaviour.
 */
export function validateSectionContent(sectionKey: string, content: unknown): unknown {
  if (content === null || content === undefined) return content;
  if (sectionKey === OPENING_CONTENT_SECTION) return cleanOpening(asObject(content, "content"));
  if (sectionKey === "story") return cleanStory(asObject(content, "content"));
  if (sectionKey === "verse") return cleanVerse(asObject(content, "content"));
  if (sectionKey === "cover") return cleanCover(asObject(content, "content"));
  if (sectionKey === "hero") return cleanHero(asObject(content, "content"));
  if (!(KHMER_CONTENT_SECTIONS as readonly string[]).includes(sectionKey)) return content;
  const obj = asObject(content, "content");
  if (sectionKey === "invitation") return cleanInvitation(obj);
  if (sectionKey === "agenda") return cleanAgenda(obj);
  if (sectionKey === "registry") return cleanRegistry(obj);
  if (sectionKey === "video") return cleanVideo(obj);
  if (sectionKey === "map") return cleanMap(obj);
  if (sectionKey === "note") return cleanNote(obj);
  return cleanLetters(obj);
}
