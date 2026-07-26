"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@mongkolka/ui/card";
import { Skeleton } from "@mongkolka/ui/skeleton";
import { Badge } from "@mongkolka/ui/badge";
import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import type { OverviewStats } from "./data/schema";

export function Overview() {
  const { data, loading, error } = useApiQuery<OverviewStats>("/couple/api/overview");

  const stats = [
    {
      label: "Guests confirmed",
      value: data ? `${data.confirmedGuests} / ${data.totalGuests}` : undefined,
    },
    {
      label: "Budget spent",
      value: data ? `$${data.totalSpent.toLocaleString()} / $${data.totalAllocated.toLocaleString()}` : undefined,
    },
    {
      label: "Checklist done",
      value: data ? `${data.completedChecklistItems} / ${data.totalChecklistItems}` : undefined,
    },
  ];

  return (
    <Main>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>

        {error && <p className="text-destructive">{error}</p>}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Countdown to the big day
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            {loading || !data ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <p className="text-4xl font-medium">
                {data.daysUntilWedding != null ? `${data.daysUntilWedding} days` : "Set your wedding date"}
              </p>
            )}
            {data && (
              <Badge variant={data.websiteStatus === "published" ? "default" : "outline"} className="capitalize">
                Website {data.websiteStatus}
              </Badge>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader>
                <CardTitle className="text-sm font-normal text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading || !stat.value ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-2xl font-medium">{stat.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Main>
  );
}
