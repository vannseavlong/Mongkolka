"use client";

import { memo, useEffect, useRef, useState } from "react";
import { LanguageProvider, SAMPLE_CONTENT, SAMPLE_COUPLE, SiteRenderer } from "@mongkolka/templates";
import type { SiteTemplate } from "../data/schema";

// Same containment trick as SectionPreview: render at a fixed design width and
// scale the box down to the measured container width. Uses the template's own
// default theme and default hero component with shared sample content (never a
// couple's data), so each card shows what that template looks like out of the box.
const DESIGN_WIDTH = 1200;
const ASPECT = 10 / 16;

export const TemplateThumbnail = memo(function TemplateThumbnail({ template }: { template: SiteTemplate }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const content = SAMPLE_CONTENT.hero;
  const hero = {
    section_id: `thumb-${template.template_id}`,
    section_key: "hero" as const,
    component_id: null,
    color_override: null,
    display_order: 0,
    enabled: true,
    content,
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative w-full overflow-hidden rounded-md border bg-muted"
      style={{ height: width * ASPECT || undefined, aspectRatio: width ? undefined : "16 / 10" }}
    >
      {width > 0 && (
        <div
          className="pointer-events-none absolute left-0 top-0 origin-top-left overflow-hidden"
          style={{ width: DESIGN_WIDTH, height: DESIGN_WIDTH * ASPECT, transform: `scale(${width / DESIGN_WIDTH})` }}
        >
          <LanguageProvider>
            <SiteRenderer
              template={template}
              sections={[hero]}
              themeOverride={null}
              couple={SAMPLE_COUPLE}
              buildContent={() => content}
              guestGreeting="Guest"
            />
          </LanguageProvider>
        </div>
      )}
    </div>
  );
});
