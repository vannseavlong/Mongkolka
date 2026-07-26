"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import { SiteTemplatesDialogs } from "./components/site-templates-dialogs";
import { SiteTemplatesPrimaryButtons } from "./components/site-templates-primary-buttons";
import { SiteTemplatesProvider } from "./components/site-templates-provider";
import { SiteTemplatesTable } from "./components/site-templates-table";
import type { SiteTemplate } from "./data/schema";

export function SiteTemplates() {
  const { data, error } = useApiQuery<{ templates: SiteTemplate[] }>("/admin/api/site-templates");

  return (
    <SiteTemplatesProvider>
      <Main>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Site Templates</h1>
            <p className="text-muted-foreground">
              Design packs a couple can pick — sets a default component + color theme for every
              section, all freely overridable per couple.
            </p>
          </div>
          <SiteTemplatesPrimaryButtons />
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <SiteTemplatesTable data={data?.templates ?? []} />
      </Main>
      <SiteTemplatesDialogs />
    </SiteTemplatesProvider>
  );
}
