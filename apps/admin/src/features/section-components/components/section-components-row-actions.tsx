"use client";

import { Trash2 } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { Button } from "@mongkolka/ui/button";
import type { SectionComponent } from "../data/schema";
import { useSectionComponents } from "./section-components-provider";

export function SectionComponentsRowActions({ row }: { row: Row<SectionComponent> }) {
  const { setOpen, setCurrentRow } = useSectionComponents();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => {
        setCurrentRow(row.original);
        setOpen("delete");
      }}
    >
      <Trash2 className="size-4" />
      <span className="sr-only">Delete</span>
    </Button>
  );
}
