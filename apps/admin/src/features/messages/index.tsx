"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
import { useApiQuery } from "@/lib/use-api-query";
import { MessagesDialogs } from "./components/messages-dialogs";
import { MessagesProvider } from "./components/messages-provider";
import { MessagesTable } from "./components/messages-table";
import type { ContactMessage } from "./data/schema";

export function Messages() {
  const { data, error } = useApiQuery<{ messages: ContactMessage[] }>("/admin/api/contact-messages");
  const messages = data?.messages ?? [];
  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <MessagesProvider>
      <PageHeader
        title="Messages"
        description={`Submissions from the public Contact page.${unreadCount > 0 ? ` ${unreadCount} unread.` : ""}`}
      />
      <Main fluid>
        {error && <p className="text-destructive">{error}</p>}
        <MessagesTable data={messages} />
      </Main>
      <MessagesDialogs />
    </MessagesProvider>
  );
}
