"use client";

import { Plus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { useThemes } from "./themes-provider";

export function ThemesPrimaryButtons() {
  const { setOpen } = useThemes();
  return (
    <Button onClick={() => setOpen("create")}>
      <Plus className="size-4" /> Add theme
    </Button>
  );
}
