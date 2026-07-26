"use client";

import { Plus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { useGuests } from "./guests-provider";

export function GuestsPrimaryButtons() {
  const { setOpen } = useGuests();
  return (
    <Button onClick={() => setOpen("create")}>
      <Plus className="size-4" /> Add guest
    </Button>
  );
}
