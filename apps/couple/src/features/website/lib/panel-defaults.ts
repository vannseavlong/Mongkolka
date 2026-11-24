/** The tab a section panel opens on: Content (where Edit lives) when the section has it, else the first. */
export function defaultTabId(tabIds: readonly string[]): string | undefined {
  return tabIds.includes("content") ? "content" : tabIds[0];
}
