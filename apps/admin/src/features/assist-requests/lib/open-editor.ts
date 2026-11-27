import { isSafeEditorUrl } from "./assist-rules";

/** The part of a browser tab this needs, so the flow can be tested without a browser. */
export interface EditorTab {
  opener: unknown;
  location: { replace(url: string): void };
  close(): void;
}

export type OpenOutcome = "opened" | "blocked" | "unsafe";

/**
 * The tab is opened first, inside the click, because browsers block a tab opened after a network call. If it is
 * blocked, no session is requested, so the couple's activity never shows a visit that did not happen.
 */
export async function openInNewTab(
  openBlank: () => EditorTab | null,
  fetchUrl: () => Promise<string>,
): Promise<OpenOutcome> {
  const tab = openBlank();
  if (!tab) return "blocked";
  try {
    // The couple app must not be able to reach back into the admin app.
    tab.opener = null;
    const url = await fetchUrl();
    if (!isSafeEditorUrl(url)) {
      tab.close();
      return "unsafe";
    }
    tab.location.replace(url);
    return "opened";
  } catch (error) {
    tab.close();
    throw error;
  }
}
