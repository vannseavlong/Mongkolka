"use client";

import { useEffect, useRef, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import {
  LanguageProvider,
  SiteRenderer,
  type CoupleInfo,
  type PartialTheme,
  type SiteRendererTemplate,
} from "@mongkolka/templates";
import { cn } from "@mongkolka/ui/utils";
import type { WebsiteSection } from "../data/schema";
import { buildPreviewContent, type PreviewProfile } from "../lib/build-content";

type Device = "desktop" | "mobile";

/**
 * Live canvas of the real site (SiteRenderer, same as the public page). Scrolls
 * to the selected section and outlines it; clicking a section selects it. The
 * opening gate would hide everything until dismissed, so it only shows while
 * the opening section itself is selected.
 */
export function SiteCanvas({
  template,
  sections,
  selectedId,
  themeOverride,
  profile,
  onSelect,
}: {
  template: SiteRendererTemplate;
  sections: WebsiteSection[];
  selectedId: string | null;
  themeOverride: PartialTheme | null;
  profile: PreviewProfile;
  onSelect: (sectionId: string) => void;
}) {
  const [device, setDevice] = useState<Device>("desktop");
  const scrollRef = useRef<HTMLDivElement>(null);
  const selected = sections.find((s) => s.section_id === selectedId) ?? null;
  const showOpening = selected?.section_key === "opening";
  const shown = sections.filter((s) => (s.section_key === "opening") === showOpening);

  // Scroll the canvas (not the page) so the selected section's top is in view.
  useEffect(() => {
    const container = scrollRef.current;
    const target = selectedId && container?.querySelector<HTMLElement>(`[data-section-id="${CSS.escape(selectedId)}"]`);
    if (!container || !target) return;
    const top = target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  }, [selectedId, device, showOpening]);

  const couple: CoupleInfo = {
    partner1Name: profile.partner1_name ?? "Partner One",
    partner2Name: profile.partner2_name ?? undefined,
    weddingDate: profile.wedding_date ?? undefined,
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">Live preview</span>
        <div className="flex gap-1 rounded-lg bg-muted p-1" role="group" aria-label="Preview size">
          {(
            [
              ["desktop", Monitor, "Desktop"],
              ["mobile", Smartphone, "Mobile"],
            ] as const
          ).map(([value, Icon, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={device === value}
              onClick={() => setDevice(value)}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                device === value ? "bg-background shadow-sm" : "text-muted-foreground",
              )}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>
      </div>
      {selected && !selected.enabled && (
        <p role="status" className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          This section is hidden, so it is not shown on your website. Turn it on in the list.
        </p>
      )}
      <div className="rounded-lg border bg-muted/40 p-0 sm:p-3">
        <div
          className={cn("relative mx-auto h-[70dvh] min-h-96 overflow-hidden rounded-lg border bg-background lg:h-160", device === "mobile" ? "max-w-sm" : "w-full")}
          style={{ transform: "translateZ(0)" }}
        >
          <div ref={scrollRef} className="h-full overflow-y-auto">
            <LanguageProvider>
              {/* key: remounts SiteRenderer when switching to/from the opening gate so its dismissed state resets */}
              <SiteRenderer
                key={showOpening ? "opening" : "page"}
                template={template}
                sections={shown}
                themeOverride={themeOverride}
                couple={couple}
                buildContent={(sectionKey) => buildPreviewContent(sectionKey, profile)}
                guestGreeting="Guest"
                extraProps={(sectionKey) => (sectionKey === "rsvp" ? { onSubmit: async () => {} } : {})}
                wrapSection={(section, node) => (
                  <div
                    data-section-id={section.section_id}
                    onClickCapture={(e) => {
                      // Selecting must not trigger the section's own links/buttons.
                      e.preventDefault();
                      e.stopPropagation();
                      onSelect(section.section_id);
                    }}
                    className={cn(
                      "cursor-pointer outline-offset-[-3px]",
                      section.section_id === selectedId && "outline-3 outline-primary",
                    )}
                  >
                    {node}
                  </div>
                )}
              />
            </LanguageProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
