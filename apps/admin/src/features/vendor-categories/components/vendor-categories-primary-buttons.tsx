"use client";

import { Plus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { useVendorCategories } from "./vendor-categories-provider";

export function VendorCategoriesPrimaryButtons() {
  const { setOpen } = useVendorCategories();
  return (
    <Button onClick={() => setOpen("create")}>
      <Plus className="size-4" /> Add category
    </Button>
  );
}
