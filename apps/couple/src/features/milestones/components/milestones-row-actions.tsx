"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import type { Milestone } from "../data/schema";
import { useMilestones } from "./milestones-provider";

export function MilestonesRowActions({ milestone }: { milestone: Milestone }) {
  const { setOpen, setCurrentRow } = useMilestones();

  return (
    <div className="flex gap-1">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          setCurrentRow(milestone);
          setOpen("edit");
        }}
      >
        <Pencil className="size-4" />
        <span className="sr-only">Edit</span>
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          setCurrentRow(milestone);
          setOpen("delete");
        }}
      >
        <Trash2 className="size-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
