"use client";

import { Plus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { useMilestones } from "./milestones-provider";

export function MilestonesPrimaryButtons() {
  const { setOpen } = useMilestones();
  return (
    <Button onClick={() => setOpen("create")}>
      <Plus className="size-4" /> Add milestone
    </Button>
  );
}
