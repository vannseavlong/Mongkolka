"use client";

import { Main } from "@mongkolka/ui/layout/main";
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
      <Main>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Stats</h1>
            <p className="text-muted-foreground">
              The stat cards shown on the public About page — order controls left-to-right position.
            </p>
          </div>
          <StatsPrimaryButtons />
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <StatsTable data={data?.stats ?? []} />
      </Main>
      <StatsDialogs />
    </StatsProvider>
  );
}
