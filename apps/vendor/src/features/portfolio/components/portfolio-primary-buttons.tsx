"use client";

import { Plus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { usePortfolio } from "./portfolio-provider";

export function PortfolioPrimaryButtons() {
  const { setOpen } = usePortfolio();
  return (
    <Button onClick={() => setOpen("create")}>
      <Plus className="size-4" /> Add photo
    </Button>
  );
}
