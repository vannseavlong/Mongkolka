"use client";

import { Plus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { useSiteTemplates } from "./site-templates-provider";

export function SiteTemplatesPrimaryButtons() {
  const { setOpen } = useSiteTemplates();
  return (
    <Button onClick={() => setOpen("create")}>
      <Plus className="size-4" /> Add site template
    </Button>
  );
}
