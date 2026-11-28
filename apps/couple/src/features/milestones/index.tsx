"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
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
      <PageHeader
        title="Milestones"
        description={`${done} of ${milestones.length} done`}
        actions={<MilestonesPrimaryButtons />}
      />
      <Main fluid>
        {error && <p className="text-destructive">{error}</p>}
        <MilestonesTimeline data={milestones} />
      </Main>
      <MilestonesDialogs />
    </MilestonesProvider>
  );
}
