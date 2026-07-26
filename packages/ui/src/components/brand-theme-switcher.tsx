"use client";

import { Check, Palette } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useBrandTheme } from "../hooks/use-brand-theme";
import { BRAND_THEMES } from "../lib/brand-themes";

export function BrandThemeSwitcher() {
  const { theme, setTheme } = useBrandTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette className="size-4" />
          Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="flex flex-col gap-1">
          {BRAND_THEMES.map((brandTheme) => (
            <button
              key={brandTheme.id}
              type="button"
              onClick={() => setTheme(brandTheme.id)}
              className="flex items-center gap-3 rounded-md p-2 text-left hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex shrink-0 overflow-hidden rounded-full border">
                {brandTheme.swatch.map((color, i) => (
                  <span key={i} className="size-4" style={{ backgroundColor: color }} />
                ))}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{brandTheme.label}</div>
                <div className="text-xs text-muted-foreground">{brandTheme.description}</div>
              </div>
              {theme === brandTheme.id && <Check className="size-4 shrink-0" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
