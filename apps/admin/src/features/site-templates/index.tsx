"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
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
      <PageHeader
        title="Site Templates"
        description="Design packs a couple can pick — sets a default component + color theme for every section, all freely overridable per couple."
        actions={<SiteTemplatesPrimaryButtons />}
      />
      <Main fluid>
        {error && <p className="text-destructive">{error}</p>}
        <SiteTemplatesTable data={data?.templates ?? []} />
      </Main>
      <SiteTemplatesDialogs />
    </SiteTemplatesProvider>
  );
}
