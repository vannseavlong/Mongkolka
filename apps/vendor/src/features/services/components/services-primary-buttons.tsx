"use client";

import { Plus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { useServices } from "./services-provider";

export function ServicesPrimaryButtons() {
  const { setOpen } = useServices();
  return (
    <Button onClick={() => setOpen("create")}>
      <Plus className="size-4" /> Add service
    </Button>
  );
}
