import type { PartialTheme, Theme } from "./types";

/**
 * Color cascade: section override -> couple's whole-site override -> template default.
 * Each override is partial (only the keys the couple actually changed), merged
 * shallowly so overriding one color doesn't clobber the rest. Used identically by
 * the couple-portal builder preview and the public site renderer — never
 * reimplement this elsewhere.
 */
export function resolveTheme(
  templateDefault: Theme,
  coupleOverride?: PartialTheme | null,
  sectionOverride?: PartialTheme | null,
): Theme {
  return {
    ...templateDefault,
    ...(coupleOverride ?? {}),
    ...(sectionOverride ?? {}),
  };
}
