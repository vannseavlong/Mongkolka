import type { ComponentType } from "react";
import type { PartialTheme, SiteRendererTemplate } from "@mongkolka/templates";
import type { SectionComponent, WebsiteSection } from "../../data/schema";
import type { PreviewProfile } from "../../lib/build-content";

/** Everything a panel tab gets about the section being edited. */
export interface SectionPanelContext {
  section: WebsiteSection;
  /** All sections, in display order. */
  sections: WebsiteSection[];
  /** Section variants from /couple/api/website/catalog (all statuses). */
  components: SectionComponent[];
  catalogLoading: boolean;
  template: SiteRendererTemplate;
  /** The couple's whole-site theme override (what the canvas shows). */
  themeOverride: PartialTheme | null;
  profile: PreviewProfile;
  /** Optimistic PATCH of this section; rolls back and toasts on failure. */
  patchSection: (data: Partial<WebsiteSection>, failureMessage?: string) => Promise<boolean>;
  /** Opens the content editor dialog for this section. */
  openContentEditor: () => void;
}

export interface SectionPanelTab {
  /** Stable id, also used as the tab value. */
  id: string;
  label: string;
  /** Sort position; lower comes first. Style is 10, Content 20. */
  order: number;
  /** Hide the tab for sections it does not apply to. Default: shown for all. */
  appliesTo?: (section: WebsiteSection) => boolean;
  Component: ComponentType<{ context: SectionPanelContext }>;
}
