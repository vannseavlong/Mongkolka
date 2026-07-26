"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { Card, CardContent, CardFooter } from "@mongkolka/ui/card";
import type { PortfolioItem } from "../data/schema";
import { usePortfolio } from "./portfolio-provider";

export function PortfolioGrid({ data }: { data: PortfolioItem[] }) {
  const { setOpen, setCurrentRow } = usePortfolio();

  if (data.length === 0) {
    return <p className="text-muted-foreground">No photos yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {data.map((item) => (
        <Card key={item.item_id} className="overflow-hidden py-0">
          <CardContent className="p-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- external, arbitrary vendor-supplied URLs */}
            <img src={item.image_url} alt={item.caption ?? ""} className="aspect-square w-full object-cover" />
          </CardContent>
          <CardFooter className="flex items-center justify-between py-3">
            <span className="truncate text-sm text-muted-foreground">{item.caption ?? "—"}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setCurrentRow(item);
                setOpen("delete");
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
