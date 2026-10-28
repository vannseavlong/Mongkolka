import type { SectionPanelTab } from "./types";

/**
 * Section panel tab registry. HOW TO ADD A TAB (Assets, Colors, Apply, ...)
 * without editing any shared file:
 *
 *   1. Create `panel-tabs/<name>.tab.tsx` in this folder.
 *   2. Export `tab` (or `tabs`) from it, typed `SectionPanelTab`:
 *        export const tab: SectionPanelTab = { id: "assets", label: "Assets", order: 30, Component };
 *      `Component` receives `{ context }` (see SectionPanelContext in types.ts:
 *      the section, catalog, template, theme, profile, patchSection, ...).
 *   3. Done. Every `*.tab.tsx` here is picked up by the bundler glob below.
 *
 * Order: Style 10, Content 20; take 30+ for new tabs. If the glob is ever
 * unavailable (non-webpack bundler), list the files here by hand instead.
 */
const modules = (
  require as unknown as {
    context: (dir: string, deep: boolean, filter: RegExp) => { keys(): string[]; (key: string): unknown };
  }
).context("./", false, /\.tab\.tsx$/);

type TabModule = { tab?: SectionPanelTab; tabs?: SectionPanelTab[] };

export const sectionPanelTabs: SectionPanelTab[] = modules
  .keys()
  .flatMap((key) => {
    const mod = modules(key) as TabModule;
    return mod.tabs ?? (mod.tab ? [mod.tab] : []);
  })
  .sort((a, b) => a.order - b.order);
