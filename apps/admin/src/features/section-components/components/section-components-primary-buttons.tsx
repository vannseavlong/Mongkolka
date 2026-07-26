"use client";

import { Plus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { useSectionComponents } from "./section-components-provider";

export function SectionComponentsPrimaryButtons() {
  const { setOpen } = useSectionComponents();
  return (
    <Button onClick={() => setOpen("create")}>
      <Plus className="size-4" /> Add component
    </Button>
  );
}
