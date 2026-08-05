"use client";

import { Plus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { useStats } from "./stats-provider";

export function StatsPrimaryButtons() {
  const { setOpen } = useStats();
  return (
    <Button onClick={() => setOpen("create")}>
      <Plus className="size-4" /> Add stat
    </Button>
  );
}
