"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import { MilestonesDialogs } from "./components/milestones-dialogs";
import { MilestonesPrimaryButtons } from "./components/milestones-primary-buttons";
import { MilestonesProvider } from "./components/milestones-provider";
import { MilestonesTimeline } from "./components/milestones-timeline";
import type { Milestone } from "./data/schema";

export function Milestones() {
  const { data, error } = useApiQuery<{ milestones: Milestone[] }>("/couple/api/milestones");
  const milestones = data?.milestones ?? [];
  const done = milestones.filter((m) => m.completed).length;

  return (
    <MilestonesProvider>
      <Main>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Milestones</h1>
            <p className="text-muted-foreground">
              {done} of {milestones.length} done
            </p>
          </div>
          <MilestonesPrimaryButtons />
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <MilestonesTimeline data={milestones} />
      </Main>
      <MilestonesDialogs />
    </MilestonesProvider>
  );
}
