"use client";

import { useMemo } from "react";
import { useLanguage } from "../i18n";
import type { Theme } from "../types";
import type { BackgroundMusic } from "./use-background-music";
import type { ResolvedChrome } from "./config";
import { chromeVars, defaultParticleColors } from "./chrome-theme";
import { CHROME_CSS } from "./chrome-styles";
import { buildDockItems, type DockSectionInput } from "./dock-items";
import { chromeText } from "./strings";
import { Dock } from "./Dock";
import { MusicToggle } from "./MusicToggle";
import { ParticleLayer } from "./ParticleLayer";
import { scrollToSection, useActiveSection } from "./use-active-section";
import { useMounted } from "./use-mounted";

export interface SiteChromeProps {
  resolved: ResolvedChrome;
  theme: Theme;
  sections: DockSectionInput[];
  music: BackgroundMusic;
}

/** Fixed overlay UI: ambient particles, music toggle, bottom dock. Client-only (renders nothing on the server). */
export function SiteChrome({ resolved, theme, sections, music }: SiteChromeProps) {
  const { language } = useLanguage();
  const mounted = useMounted();
  const vars = useMemo(() => chromeVars(theme), [theme]);
  const dockItems = useMemo(
    () => (resolved.dock ? buildDockItems(sections, resolved.dock.include) : []),
    [resolved.dock, sections],
  );
  const { activeKey, presentKeys } = useActiveSection(dockItems.map((i) => i.key), mounted && dockItems.length > 0);
  const visibleItems = dockItems.filter((i) => presentKeys.includes(i.key));
  const particleColors = useMemo(
    () => resolved.particles?.colors ?? defaultParticleColors(theme.accent_color),
    [resolved.particles, theme.accent_color],
  );

  if (!mounted) return null;

  return (
    <>
      <style href="mk-chrome-css" precedence="mk-chrome">
        {CHROME_CSS}
      </style>
      {resolved.particles && <ParticleLayer kinds={resolved.particles.kinds} density={resolved.particles.density} colors={particleColors} />}
      {resolved.music && music.available && (
        <MusicToggle
          status={music.status}
          icon={resolved.music.icon}
          corner={resolved.music.corner}
          label={chromeText(language, music.status === "playing" ? "music.pause" : "music.play")}
          vars={vars}
          lang={language}
          onToggle={music.toggle}
        />
      )}
      {resolved.dock && visibleItems.length > 0 && (
        <Dock
          items={visibleItems.map((i) => ({ key: i.key, icon: i.icon, label: chromeText(language, i.labelKey) }))}
          activeKey={activeKey}
          navLabel={chromeText(language, "dock.label")}
          vars={vars}
          lang={language}
          onSelect={scrollToSection}
        />
      )}
    </>
  );
}
