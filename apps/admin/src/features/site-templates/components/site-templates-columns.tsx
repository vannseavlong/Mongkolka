import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import { ExternalLink } from "lucide-react";
import { siteOrigin } from "@/lib/site-url";
import type { SiteTemplate } from "../data/schema";
import { SiteTemplateActiveCell } from "./site-template-active-cell";
import { SiteTemplatesRowActions } from "./site-templates-row-actions";

export const siteTemplatesColumns: ColumnDef<SiteTemplate>[] = [
  {
    id: "preview",
    header: "Theme",
    cell: ({ row }) => (
      <div
        className="size-8 rounded-full border"
        style={{
          backgroundColor: row.original.default_theme.bg_color,
          borderColor: row.original.default_theme.accent_color,
        }}
      />
    ),
  },
  {
    accessorKey: "template_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Template ID" />,
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("template_id")}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "slug",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
    cell: ({ row }) => {
      const slug = row.original.slug;
      return slug ? (
        <span className="font-mono text-sm">{slug}</span>
      ) : (
        <span className="text-sm text-muted-foreground">Not set</span>
      );
    },
  },
  {
    id: "preview_link",
    header: "Preview",
    cell: ({ row }) => {
      const slug = row.original.slug;
      if (!slug) return <span className="text-sm text-muted-foreground">-</span>;
      return (
        <a
          href={siteOrigin(slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Preview
          <ExternalLink className="size-3.5" />
        </a>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Active" />,
    cell: ({ row }) => <SiteTemplateActiveCell template={row.original} />,
  },
  {
    id: "actions",
    cell: SiteTemplatesRowActions,
  },
];
