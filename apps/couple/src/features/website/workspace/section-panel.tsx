"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mongkolka/ui/tabs";
import { sectionPanelTabs } from "./panel-tabs/registry";
import type { SectionPanelContext } from "./panel-tabs/types";

/** Tabbed editor for the selected section; tabs come from panel-tabs/registry.ts. */
export function SectionPanel({ context }: { context: SectionPanelContext }) {
  const tabs = sectionPanelTabs.filter((t) => t.appliesTo?.(context.section) ?? true);
  const [active, setActive] = useState(tabs[0]?.id);
  const value = tabs.some((t) => t.id === active) ? active : tabs[0]?.id;

  return (
    <section aria-label={`${context.section.section_key} settings`} className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold capitalize">{context.section.section_key}</h2>
      <Tabs value={value} onValueChange={setActive}>
        <TabsList className="flex-wrap">
          {tabs.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
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
    </section>
  );
}
