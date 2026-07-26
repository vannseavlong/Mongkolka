"use client";

import { Trash2 } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { Button } from "@mongkolka/ui/button";
import type { SiteTemplate } from "../data/schema";
import { useSiteTemplates } from "./site-templates-provider";

export function SiteTemplatesRowActions({ row }: { row: Row<SiteTemplate> }) {
  const { setOpen, setCurrentRow } = useSiteTemplates();

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
