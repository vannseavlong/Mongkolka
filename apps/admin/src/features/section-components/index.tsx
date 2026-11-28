"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
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
      <PageHeader
        title="Section Components"
        description="The interchangeable variants each website section can render, e.g. the four “opening” entrance animations."
        actions={<SectionComponentsPrimaryButtons />}
      />
      <Main fluid>
        {error && <p className="text-destructive">{error}</p>}
        <SectionComponentsTable data={data?.components ?? []} />
      </Main>
      <SectionComponentsDialogs />
    </SectionComponentsProvider>
  );
}
