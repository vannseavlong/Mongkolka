"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mongkolka/ui/tabs";
import { ACTIVE_TAB } from "./tab-style";

export type InspectorTab = "content" | "colors";

/**
 * Fixed right-hand panel: the selected section's content form, and the
 * site-wide colors and palettes. Colors stay mounted while hidden so an
 * unsaved palette preview is not dropped when the couple switches tabs.
 * Below xl the builder's own switcher picks the tab, so the tab bar is hidden.
 */
export function Inspector({
  tab,
  onTabChange,
  content,
  colors,
}: {
  tab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
  content: ReactNode;
  colors: ReactNode;
}) {
  return (
    <Tabs value={tab} onValueChange={(v) => onTabChange(v as InspectorTab)} className="flex h-full min-h-0 flex-col gap-0">
      <div className="shrink-0 border-b p-3 max-xl:hidden">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content" className={ACTIVE_TAB}>
            Content
          </TabsTrigger>
          <TabsTrigger value="colors" className={ACTIVE_TAB}>
            Colors &amp; palette
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <TabsContent value="content" className="mt-0">
          {content}
        </TabsContent>
        <TabsContent value="colors" forceMount className="mt-0 data-[state=inactive]:hidden">
          {colors}
        </TabsContent>
      </div>
    </Tabs>
  );
}
