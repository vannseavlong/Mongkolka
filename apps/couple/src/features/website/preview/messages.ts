import type { PartialTheme, SiteRendererTemplate } from "@mongkolka/templates";
import type { WebsiteSection } from "../data/schema";
import type { PreviewProfile } from "../lib/build-content";

/** "section" shows only the selected section; "page" the whole site. */
export type PreviewMode = "section" | "page";

/** Everything the preview frame needs to draw the site. Plain data only (it crosses postMessage). */
export interface PreviewState {
  template: SiteRendererTemplate;
  sections: WebsiteSection[];
  themeOverride: PartialTheme | null;
  profile: PreviewProfile;
  selectedId: string | null;
  mode: PreviewMode;
  /** Language the preview is shown in (the couple can flip it to check both). */
  language: "en" | "kh";
  /** Bumped by "Replay opening" to restart the gate. */
  replay: number;
}

export const HOST_SOURCE = "mk-preview-host";
export const FRAME_SOURCE = "mk-preview-frame";

export type HostMessage = { source: typeof HOST_SOURCE; state: PreviewState };

export type FrameMessage =
  | { source: typeof FRAME_SOURCE; type: "ready" }
  | { source: typeof FRAME_SOURCE; type: "select"; sectionId: string };

export const PREVIEW_FRAME_PATH = "/preview-frame";
