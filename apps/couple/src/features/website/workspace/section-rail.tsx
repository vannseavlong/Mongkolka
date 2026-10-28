"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { Switch } from "@mongkolka/ui/switch";
import { cn } from "@mongkolka/ui/utils";
import type { WebsiteSection } from "../data/schema";
import { sectionLabel } from "./section-labels";

/** Ordered list of sections: select, reorder, and turn on/off. */
export function SectionRail({
  sections,
  selectedId,
  reordering,
  pending,
  onSelect,
  onMove,
  onToggle,
}: {
  sections: WebsiteSection[];
  selectedId: string | null;
  reordering: boolean;
  /** Section ids with a save in flight; their switch is disabled. */
  pending: ReadonlySet<string>;
  onSelect: (sectionId: string) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onToggle: (section: WebsiteSection, enabled: boolean) => void;
}) {
  return (
    <ul className="flex flex-col gap-1.5" aria-label="Website sections">
      {sections.map((section, index) => {
        const selected = section.section_id === selectedId;
        const name = sectionLabel(section.section_key);
        const cannotUp = index === 0 || reordering;
        const cannotDown = index === sections.length - 1 || reordering;
        return (
          <li
            key={section.section_id}
            className={cn("flex items-center gap-1 rounded-lg border p-1.5", selected && "border-primary bg-accent")}
          >
            <div className="flex flex-col">
              <Button
                size="icon"
                variant="ghost"
                className="size-6 max-sm:size-9 aria-disabled:opacity-50"
                // aria-disabled, not disabled, so keyboard focus stays on the button after a move.
                aria-disabled={cannotUp}
                onClick={() => !cannotUp && onMove(index, -1)}
              >
                <ArrowUp className="size-3" />
                <span className="sr-only">Move {name} up</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-6 max-sm:size-9 aria-disabled:opacity-50"
                aria-disabled={cannotDown}
                onClick={() => !cannotDown && onMove(index, 1)}
              >
                <ArrowDown className="size-3" />
                <span className="sr-only">Move {name} down</span>
              </Button>
            </div>
            <button
              type="button"
              aria-current={selected ? "true" : undefined}
              onClick={() => onSelect(section.section_id)}
              className={cn(
                "min-h-9 min-w-0 flex-1 rounded-md px-2 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring",
                !section.enabled && "text-muted-foreground line-through",
              )}
            >
              {name}
            </button>
            <Switch
              checked={section.enabled}
              disabled={pending.has(section.section_id)}
              onCheckedChange={(checked) => onToggle(section, checked)}
              aria-label={`Show ${name} on the website`}
            />
          </li>
        );
      })}
    </ul>
  );
}
