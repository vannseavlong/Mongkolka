"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { Button } from "@mongkolka/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mongkolka/ui/dropdown-menu";
import type { ChecklistItem } from "../data/schema";
import { useChecklist } from "./checklist-provider";

export function ChecklistRowActions({ row }: { row: Row<ChecklistItem> }) {
  const { setOpen, setCurrentRow } = useChecklist();
  const item = row.original;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreVertical className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(item);
            setOpen("edit");
          }}
        >
          Edit
          <Pencil className="ms-auto size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            setCurrentRow(item);
            setOpen("delete");
          }}
        >
          Delete
          <Trash2 className="ms-auto size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
