"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
import { useApiQuery } from "@/lib/use-api-query";
import { StatsDialogs } from "./components/stats-dialogs";
import { StatsPrimaryButtons } from "./components/stats-primary-buttons";
import { StatsProvider } from "./components/stats-provider";
import { StatsTable } from "./components/stats-table";
import type { Stat } from "./data/schema";

export function Stats() {
  const { data, error } = useApiQuery<{ stats: Stat[] }>("/admin/api/stats");

  return (
    <StatsProvider>
      <PageHeader
        title="Stats"
        description="The stat cards shown on the public About page — order controls left-to-right position."
        actions={<StatsPrimaryButtons />}
      />
      <Main fluid>
        {error && <p className="text-destructive">{error}</p>}
        <StatsTable data={data?.stats ?? []} />
      </Main>
      <StatsDialogs />
    </StatsProvider>
  );
}
