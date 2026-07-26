"use client";

import { Trash2 } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { Button } from "@mongkolka/ui/button";
import type { Service } from "../data/schema";
import { useServices } from "./services-provider";

export function ServicesRowActions({ row }: { row: Row<Service> }) {
  const { setOpen, setCurrentRow } = useServices();

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
