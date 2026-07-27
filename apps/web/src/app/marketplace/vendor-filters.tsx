"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@mongkolka/ui/input";
import { Button } from "@mongkolka/ui/button";
import type { VendorCategory } from "./types";

export function VendorFilters({
  categories,
  activeCategory,
}: {
  categories: VendorCategory[];
  activeCategory?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          defaultValue={searchParams.get("search") ?? ""}
          placeholder="Search vendors by name or location..."
          className="pl-9"
          onChange={(e) => {
            const value = e.target.value;
            updateParams({ search: value || undefined });
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={!activeCategory ? "default" : "outline"}
          size="sm"
          onClick={() => updateParams({ category: undefined })}
        >
          All categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category.category_id}
            variant={activeCategory === category.category_id ? "default" : "outline"}
            size="sm"
            onClick={() => updateParams({ category: category.category_id })}
          >
            {category.label_en}
          </Button>
        ))}
      </div>
    </div>
  );
}
