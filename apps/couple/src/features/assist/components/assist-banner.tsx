"use client";

import { Button } from "@mongkolka/ui/button";
import { exitAssist, useAssistBanner } from "../lib/use-assist-session";

/** Height is fixed (h-12) so full-height screens can subtract it through --assist-banner. */
export function AssistBanner() {
  const { active, coupleName, minutes } = useAssistBanner();
  if (!active) return null;
  return (
    <div className="flex h-12 items-center justify-between gap-3 bg-amber-300 px-4 text-xs text-amber-950 sm:text-sm">
      <p role="status" className="line-clamp-2 min-w-0 leading-tight">
        Editing <strong>{coupleName}</strong> as Mongkolka admin ·{" "}
        <span className="whitespace-nowrap">{minutes} min left</span>
      </p>
      <Button size="sm" variant="outline" className="shrink-0 bg-white text-amber-950" onClick={exitAssist}>
        Exit
      </Button>
    </div>
  );
}
