"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { cn } from "@mongkolka/ui/utils";
import { sectionLabel } from "./section-labels";
import { SectionPanel } from "./section-panel";
import type { SectionPanelContext } from "./panel-tabs/types";

/** Bottom dock: how the selected section looks (style, images, its own colors). Can fold down to a bar. */
export function SectionDock({
  context,
  collapsed,
  onToggleCollapsed,
}: {
  context: SectionPanelContext;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-2">
        <span className="text-sm font-medium">{sectionLabel(context.section.section_key)} · look</span>
        <Button size="sm" variant="ghost" className="max-xl:hidden" onClick={onToggleCollapsed} aria-expanded={!collapsed}>
          {collapsed ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          {collapsed ? "Show" : "Hide"}
        </Button>
      </div>
      <div className={cn("min-h-0 flex-1 overflow-y-auto p-4", collapsed && "xl:hidden")}>
        {/* Remount per section so tab-local state never leaks between sections. */}
        <SectionPanel key={context.section.section_id} context={context} />
      </div>
    </div>
  );
}
