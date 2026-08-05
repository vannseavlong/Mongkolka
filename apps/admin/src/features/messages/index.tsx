"use client";

import { Main } from "@mongkolka/ui/layout/main";
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
      <Main>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground">
              Submissions from the public Contact page.
              {unreadCount > 0 && ` ${unreadCount} unread.`}
            </p>
          </div>
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <MessagesTable data={messages} />
      </Main>
      <MessagesDialogs />
    </MessagesProvider>
  );
}
