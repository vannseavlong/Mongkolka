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
  return trimmed;
}

const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

/** ISO 8601 date-time that carries an offset ("...+07:00" or "Z"), so the countdown is timezone-safe. */
export function validateStartsAt(value: unknown, path: string): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") throw new Error(`${path} must be a string`);
  const trimmed = value.trim();
  if (!ISO_WITH_OFFSET.test(trimmed) || Number.isNaN(Date.parse(trimmed))) {
    throw new Error(`${path} must be an ISO 8601 date-time with an offset, e.g. 2026-05-29T17:00:00+07:00`);
  }
  return trimmed;
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
      return {
        date: validateDay(day.date.trim(), `${dayPath}.date`),
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

/**
 * Registry content: the gift fields (KHQR image, bank, account name, account number) are validated;
 * `links` is carried over exactly as before so existing registries keep working. Display data only:
 * no amounts, nothing is collected or processed.
 */
function cleanRegistry(content: Obj): Obj {
  const accountNumber = optString(content, "accountNumber", LIMITS.accountNumber, "content");
  if (accountNumber !== undefined && !ACCOUNT_NUMBER.test(accountNumber)) {
    throw new Error("content.accountNumber may contain only digits, spaces and hyphens");
  }
  return compact({
    links: Array.isArray(content.links) ? content.links : undefined,
    khqrImageUrl: validateHttpsUrl(content.khqrImageUrl, "khqrImageUrl"),
    bank: optString(content, "bank", LIMITS.bank, "content"),
    accountName: optString(content, "accountName", LIMITS.accountName, "content"),
    accountNumber,
  });
}

export const KHMER_CONTENT_SECTIONS = ["invitation", "agenda", "letters", "registry"] as const;

/**
 * Validates and cleans `website_sections.content` for the Khmer sections. Returns the
 * cleaned object (unknown keys dropped, strings trimmed). Throws `Error` with a message
 * the controller maps to a 400. Sections it does not own are returned untouched, so
 * existing sections keep their current (unvalidated) behaviour.
 */
export function validateSectionContent(sectionKey: string, content: unknown): unknown {
  if (content === null || content === undefined) return content;
  if (!(KHMER_CONTENT_SECTIONS as readonly string[]).includes(sectionKey)) return content;
  const obj = asObject(content, "content");
  if (sectionKey === "invitation") return cleanInvitation(obj);
  if (sectionKey === "agenda") return cleanAgenda(obj);
  if (sectionKey === "registry") return cleanRegistry(obj);
  return cleanLetters(obj);
}
