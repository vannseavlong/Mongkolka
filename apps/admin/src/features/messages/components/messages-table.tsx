"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import type { ContactMessage } from "../data/schema";
import { messagesColumns } from "./messages-columns";

export function MessagesTable({ data }: { data: ContactMessage[] }) {
  return (
    <DataTable columns={messagesColumns} data={data} searchKey="name" searchPlaceholder="Filter by name…" />
  );
}
