"use client";

import type { ReactNode } from "react";
import { Cloud, HardDrive, Images } from "lucide-react";
import { Card, CardContent } from "@mongkolka/ui/card";
import { Progress } from "@mongkolka/ui/progress";
import { Skeleton } from "@mongkolka/ui/skeleton";
import { cn } from "@mongkolka/ui/utils";
import { useStorageSummary } from "../lib/use-storage-summary";

function Tile({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <Card className="min-w-0 py-0">
      <CardContent className="flex flex-col gap-1.5 p-4">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          {label}
        </p>
        {children}
      </CardContent>
    </Card>
  );
}

const ICON = "size-4";

/** Three at-a-glance tiles: how many images, how much space, and where the files are kept. */
export function StorageSummary() {
  const { loading, summary } = useStorageSummary();

  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-3" aria-busy="true" aria-label="Loading storage summary">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const { count, max, percent, level, totalLabel, where } = summary;
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Tile icon={<Images className={ICON} aria-hidden />} label="Images">
        <p className="text-2xl font-semibold tracking-tight">
          {count ?? "—"}
          <span className="text-sm font-normal text-muted-foreground"> of {max}</span>
        </p>
        <Progress
          value={percent}
          aria-label="Library space used"
          className={cn("h-1.5", level !== "ok" && "bg-destructive/20 [&>div]:bg-destructive")}
        />
        {level !== "ok" && (
          <p className="text-xs text-destructive">{level === "full" ? "Your library is full." : "Almost full."}</p>
        )}
      </Tile>
      <Tile icon={<HardDrive className={ICON} aria-hidden />} label="Space used">
        <p className="text-2xl font-semibold tracking-tight">{totalLabel}</p>
        <p className="text-xs text-muted-foreground">Photos are shrunk before upload to save space.</p>
      </Tile>
      <Tile icon={<Cloud className={ICON} aria-hidden />} label="Kept in">
        <p className={cn("text-2xl font-semibold tracking-tight", where.tone === "warn" && "text-amber-600")}>{where.title}</p>
        {where.detail && <p className="[overflow-wrap:anywhere] text-xs text-muted-foreground">{where.detail}</p>}
      </Tile>
    </div>
  );
}
