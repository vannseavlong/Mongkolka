"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import { SectionComponentsDialogs } from "./components/section-components-dialogs";
import { SectionComponentsPrimaryButtons } from "./components/section-components-primary-buttons";
import { SectionComponentsProvider } from "./components/section-components-provider";
import { SectionComponentsTable } from "./components/section-components-table";
import type { SectionComponent } from "./data/schema";

export function SectionComponents() {
  const { data, error } = useApiQuery<{ components: SectionComponent[] }>("/admin/api/section-components");

  return (
    <SectionComponentsProvider>
      <Main>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Section Components</h1>
            <p className="text-muted-foreground">
              The interchangeable variants each website section can render, e.g. the four
              &ldquo;opening&rdquo; entrance animations.
            </p>
          </div>
          <SectionComponentsPrimaryButtons />
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <SectionComponentsTable data={data?.components ?? []} />
      </Main>
      <SectionComponentsDialogs />
    </SectionComponentsProvider>
  );
}
