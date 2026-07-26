"use client";

import type { Milestone } from "../data/schema";
import { MilestonesCompletedCell } from "./milestones-completed-cell";
import { MilestonesRowActions } from "./milestones-row-actions";

export function MilestonesTimeline({ data }: { data: Milestone[] }) {
  if (data.length === 0) {
    return <p className="text-muted-foreground">No milestones yet.</p>;
  }

  return (
    <ol className="flex flex-col gap-3">
      {data.map((milestone) => (
        <li
          key={milestone.milestone_id}
          className="flex items-start gap-3 rounded-lg border p-4"
        >
          <MilestonesCompletedCell milestone={milestone} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={milestone.completed ? "line-through text-muted-foreground" : "font-medium"}>
                {milestone.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {milestone.months_before} {milestone.months_before === 1 ? "month" : "months"} before
              </span>
            </div>
            {milestone.task && <p className="text-sm text-muted-foreground">{milestone.task}</p>}
          </div>
          <MilestonesRowActions milestone={milestone} />
        </li>
      ))}
    </ol>
  );
}
