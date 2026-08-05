"use client";

import { useState } from "react";
import { Globe, Heart, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mongkolka/ui/dropdown-menu";
import { api, ApiError } from "@/lib/api";
import type { Theme } from "../data/schema";
import { useThemes } from "./themes-provider";

type Scope = "web" | "couple";

// Web and couple activation are independent, so both live alongside Edit and
// Delete in one dropdown rather than as separate inline buttons — keeps the
// row a single fixed-width trigger no matter which scopes are already active.
export function ThemesRowActions({ row }: { row: Row<Theme> }) {
  const { setOpen, setCurrentRow } = useThemes();
  const theme = row.original;
  const [activatingScope, setActivatingScope] = useState<Scope | null>(null);

  async function activate(scope: Scope) {
    setActivatingScope(scope);
    try {
      await api.patch(`/admin/api/themes/${theme.theme_id}/activate`, { scope });
      toast.success(
        `"${theme.name}" is now the ${scope === "web" ? "landing page" : "couple portal"} theme`,
      );
      mutate("/admin/api/themes");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to activate theme");
    } finally {
      setActivatingScope(null);
    }
  }

  const isActive = theme.is_active_web || theme.is_active_couple;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {!theme.is_active_web && (
          <DropdownMenuItem onClick={() => activate("web")} disabled={activatingScope !== null}>
            <Globe className="size-5" />
            Set Web
          </DropdownMenuItem>
        )}
        {!theme.is_active_couple && (
          <DropdownMenuItem onClick={() => activate("couple")} disabled={activatingScope !== null}>
            <Heart className="size-5" />
            Set Couple
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(theme);
            setOpen("edit");
          }}
        >
          <Pencil className="size-5" />
          Edit
        </DropdownMenuItem>
        {!isActive && (
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(theme);
              setOpen("delete");
            }}
          >
            <Trash2 className="size-5" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
