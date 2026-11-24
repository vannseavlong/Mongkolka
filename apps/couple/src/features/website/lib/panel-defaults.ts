/** The tab the section dock opens on: Style when the section has it, else the first. */
export function defaultTabId(tabIds: readonly string[]): string | undefined {
  return tabIds.includes("style") ? "style" : tabIds[0];
}
