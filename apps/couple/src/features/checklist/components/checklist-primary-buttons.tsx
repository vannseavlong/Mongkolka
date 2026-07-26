"use client";

import { Plus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { useChecklist } from "./checklist-provider";

export function ChecklistPrimaryButtons() {
  const { setOpen } = useChecklist();
  return (
    <Button onClick={() => setOpen("create")}>
      <Plus className="size-4" /> Add task
    </Button>
  );
}
