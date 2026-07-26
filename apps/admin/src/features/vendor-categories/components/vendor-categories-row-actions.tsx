"use client";

import { Trash2 } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { Button } from "@mongkolka/ui/button";
import type { VendorCategory } from "../data/schema";
import { useVendorCategories } from "./vendor-categories-provider";

export function VendorCategoriesRowActions({ row }: { row: Row<VendorCategory> }) {
  const { setOpen, setCurrentRow } = useVendorCategories();

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
