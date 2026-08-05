"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { Button } from "@mongkolka/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mongkolka/ui/dropdown-menu";
import type { Stat } from "../data/schema";
import { useStats } from "./stats-provider";

export function StatsRowActions({ row }: { row: Row<Stat> }) {
  const { setOpen, setCurrentRow } = useStats();
  const stat = row.original;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(stat);
            setOpen("edit");
          }}
        >
          <Pencil className="size-5" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            setCurrentRow(stat);
            setOpen("delete");
          }}
        >
          <Trash2 className="size-5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
