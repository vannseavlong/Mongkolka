export const SITE_LANGUAGES = ["en", "kh"] as const;
export type SiteLanguage = (typeof SITE_LANGUAGES)[number];

/** Khmer is the default: most guests read Khmer, and a couple can switch to English in the builder. */
export const DEFAULT_SITE_LANGUAGE: SiteLanguage = "kh";

/** Strict check for the couple's choice. Throws with a message the controller maps to a 400. */
export function validateSiteLanguage(value: unknown): SiteLanguage {
  if (value === "en" || value === "kh") return value;
  throw new Error("language must be 'en' or 'kh'");
}

/** The language a site opens in: the stored choice, or Khmer when unset or unusable. */
export function resolveSiteLanguage(stored: unknown): SiteLanguage {
  return stored === "en" || stored === "kh" ? stored : DEFAULT_SITE_LANGUAGE;
}
