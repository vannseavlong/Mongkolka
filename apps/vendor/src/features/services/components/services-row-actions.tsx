"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { Button } from "@mongkolka/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mongkolka/ui/dropdown-menu";
import type { Service } from "../data/schema";
import { useServices } from "./services-provider";

export function ServicesRowActions({ row }: { row: Row<Service> }) {
  const { setOpen, setCurrentRow } = useServices();

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
          variant="destructive"
          onClick={() => {
            setCurrentRow(row.original);
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
