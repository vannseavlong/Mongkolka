"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@mongkolka/ui/card";
import { Skeleton } from "@mongkolka/ui/skeleton";
import { useApiQuery } from "@/lib/use-api-query";
import type { OverviewStats } from "@/lib/types";

const STAT_LABELS: { key: keyof OverviewStats; label: string }[] = [
  { key: "totalCouples", label: "Total couples" },
  { key: "totalVendors", label: "Total vendors" },
  { key: "pendingCouples", label: "Pending couples" },
  { key: "pendingVendors", label: "Pending vendors" },
  { key: "activeTemplates", label: "Active templates" },
];

export default function DashboardPage() {
  const { data, loading, error } = useApiQuery<OverviewStats>("/admin/api/overview");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium">Overview</h1>

      {error && <p className="text-destructive">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STAT_LABELS.map((stat) => (
          <Card key={stat.key}>
            <CardHeader>
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !data ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-medium">{data[stat.key]}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
