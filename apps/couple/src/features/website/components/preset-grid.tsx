import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@mongkolka/ui/utils";

export interface PresetTile {
  id: string;
  name: string;
  active: boolean;
  sample: ReactNode;
}

/** Preset tiles: hover or focus previews, click picks. */
export function PresetGrid({
  tiles,
  onPick,
  onPreview,
  onPreviewEnd,
}: {
  tiles: PresetTile[];
  onPick: (id: string) => void;
  onPreview: (id: string) => void;
  onPreviewEnd: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {tiles.map((tile) => (
        <button
          key={tile.id}
          type="button"
          aria-pressed={tile.active}
          onClick={() => onPick(tile.id)}
          onMouseEnter={() => onPreview(tile.id)}
          onFocus={() => onPreview(tile.id)}
          onMouseLeave={onPreviewEnd}
          onBlur={onPreviewEnd}
          className={cn(
            "flex flex-col gap-1.5 rounded-md border p-2 text-left text-xs outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
            tile.active && "border-primary ring-1 ring-primary",
          )}
        >
          {tile.sample}
          <span className="flex items-center justify-between gap-1">
            <span className="truncate">{tile.name}</span>
            {tile.active && <Check className="size-3 shrink-0" aria-label="Selected" />}
          </span>
        </button>
      ))}
    </div>
  );
}
