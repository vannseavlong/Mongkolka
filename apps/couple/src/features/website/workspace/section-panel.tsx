"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mongkolka/ui/tabs";
import { defaultTabId } from "../lib/panel-defaults";
import { ACTIVE_TAB } from "./tab-style";
import { sectionPanelTabs } from "./panel-tabs/registry";
import type { SectionPanelContext } from "./panel-tabs/types";

/** Tabbed editor for the selected section; tabs come from panel-tabs/registry.ts. */
export function SectionPanel({ context }: { context: SectionPanelContext }) {
  const tabs = sectionPanelTabs.filter((t) => t.appliesTo?.(context.section) ?? true);
  const [active, setActive] = useState(() => defaultTabId(tabs.map((t) => t.id)));
  const value = tabs.some((t) => t.id === active) ? active : defaultTabId(tabs.map((t) => t.id));

  return (
    <div className="flex flex-col gap-3">
      <Tabs value={value} onValueChange={setActive}>
        <TabsList className="flex-wrap">
          {tabs.map((t) => (
            <TabsTrigger key={t.id} value={t.id} className={ACTIVE_TAB}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t.id} value={t.id} className="pt-2">
            <t.Component context={context} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
