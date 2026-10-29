// Mirrors SECTION_KEYS in packages/templates/src/types.ts — kept as a plain
// constant here since the API is framework-agnostic and shouldn't depend on the
// React-rendering template package. tests/section-keys.test.ts guards drift.
export const SECTION_KEYS = [
  "opening",
  "hero",
  "verse",
  "story",
  "gallery",
  "details",
  "rsvp",
  "registry",
  "timeline",
  "music",
  "guestbook",
  "footer",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export interface DefaultSection {
  section_key: SectionKey;
  enabled: boolean;
}

const KEY_SET: ReadonlySet<string> = new Set(SECTION_KEYS);

export function isSectionKey(value: unknown): value is SectionKey {
  return typeof value === "string" && KEY_SET.has(value);
}

/**
 * Strict check for admin writes. Returns the clean list, or `null` for null/undefined/[]
 * (all mean "no template default"). Throws `Error` with a message for anything else
 * invalid; the service maps it to a 400.
 */
export function validateDefaultSections(value: unknown): DefaultSection[] | null {
  if (value === null || value === undefined) return null;
  if (!Array.isArray(value)) throw new Error("default_sections must be an array");
  const seen = new Set<string>();
  const out: DefaultSection[] = [];
  value.forEach((item, i) => {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      throw new Error(`default_sections[${i}] must be an object`);
    }
    const { section_key, enabled } = item as Record<string, unknown>;
    if (!isSectionKey(section_key)) {
      throw new Error(`default_sections[${i}].section_key is not a known section`);
    }
    if (typeof enabled !== "boolean") {
      throw new Error(`default_sections[${i}].enabled must be a boolean`);
    }
    if (seen.has(section_key)) {
      throw new Error(`default_sections has a duplicate section_key: ${section_key}`);
    }
    seen.add(section_key);
    out.push({ section_key, enabled });
  });
  return out.length > 0 ? out : null;
}

/**
 * Lenient read of a stored value (sheet rows may hold stale or hand-edited data):
 * accepts a JSON string or array, drops unknown keys, malformed items and repeated
 * keys (first wins). Returns `null` when nothing usable is left.
 */
export function parseDefaultSections(value: unknown): DefaultSection[] | null {
  let raw = value;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!Array.isArray(raw)) return null;
  const seen = new Set<string>();
  const out: DefaultSection[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const { section_key, enabled } = item as Record<string, unknown>;
    if (!isSectionKey(section_key) || typeof enabled !== "boolean" || seen.has(section_key)) {
      continue;
    }
    seen.add(section_key);
    out.push({ section_key, enabled });
  }
  return out.length > 0 ? out : null;
}

/**
 * Full target layout for a template: its listed sections in order with their flags,
 * then every other known key disabled at the end in SECTION_KEYS order.
 */
export function layoutFromDefaults(defaults: DefaultSection[]): DefaultSection[] {
  const listed = new Set<string>(defaults.map((d) => d.section_key));
  return [
    ...defaults,
    ...SECTION_KEYS.filter((k) => !listed.has(k)).map((k) => ({
      section_key: k,
      enabled: false,
    })),
  ];
}
